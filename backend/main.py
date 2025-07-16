import asyncio
import os
import cloudinary
import cloudinary.uploader
from typing import List, Optional
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, model_validator
from databases import Database
from dotenv import load_dotenv

# config
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set.")

database = Database(DATABASE_URL)

cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key = os.getenv("CLOUDINARY_API_KEY"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure=True
)

# lifespan
@asynccontextmanager
async def lifespan(app:FastAPI):
    print("lifespan startup event")
    await database.connect()

    create_table_query = """
        CREATE TABLE IF NOT EXISTS recipes(
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            ingredients TEXT NOT NULL,
            steps TEXT NOT NULL,
            category TEXT NOT NULL,
            image_url TEXT,
            is_tried INTEGER DEFAULT 0
        );
    """
    await database.execute(query=create_table_query)

    yield
    print("Lifespan shutdown event. Disconnecting from database.")
    await database.disconnect()

# initialize app instance
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# pydantic models
class RecipeOut(BaseModel):
    id: int
    title: str
    ingredients: List[str]
    steps: str
    category: List[str]
    image_url: Optional[str] = None
    is_tried: int

    @model_validator(mode='before')
    @classmethod
    def split_strings(cls, data):
        mutable_data = dict(data)

        ingredients_val = mutable_data.get('ingredients')
        category_val = mutable_data.get('category')

        if isinstance(ingredients_val, str):
            mutable_data['ingredients'] = [s.strip() for s in ingredients_val.split(",")]
        if isinstance(category_val, str):
            mutable_data['category'] = [s.strip() for s in category_val.split(",")]

        return mutable_data

class MessageResponse(BaseModel):
    msg: str
    image_url: Optional[str] = None

# endpoints
@app.api_route("/", methods=['GET', 'HEAD'])
def health_check():
    return {"status": "ok", "message": "RasoiGhar API is healthy!"}

@app.get("/recipes", response_model=List[RecipeOut])
async def read_recipes(q: Optional[str] = None, category: Optional[str] = None):
    try:
        if q:
            query = "SELECT * FROM recipes WHERE title ILIKE :search_term OR ingredients ILIKE :search_term"
            values = {"search_term": f"%{q}%"}
            db_rows = await database.fetch_all(query=query, values=values)
        if category:
            query = "SELECT * FROM recipes WHERE category = :category"
            values = {":category" : category}
            db_rows = await database.fetch_all(query=query, values=values) 
        else:
            query = "SELECT * FROM recipes ORDER BY id DESC"
            db_rows = await database.fetch_all(query=query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {e}")

    return db_rows

@app.post("/add-recipe", response_model=MessageResponse)
async def add_recipe(
    title: str = Form(...),
    ingredients: str = Form(...),
    steps: str = Form(...),
    category: str = Form(...),
    is_tried: int = Form(0),
    image: UploadFile = File(None)):

    image_url = None
    if image:
        try:
            loop = asyncio.get_event_loop()
            upload_result = await loop.run_in_executor(
                None,
                lambda: cloudinary.uploader.upload(image.file, folder="rasoighar_uploads")
            )
            image_url = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload to cloud failed: {e}")

    query = "INSERT INTO recipes (title, ingredients, steps, category, image_url, is_tried) VALUES (:title, :ingredients, :steps, :category, :image_url, :is_tried)"
    values = {
        "title": title,
        "ingredients": ingredients,
        "steps": steps,
        "category": category,
        "is_tried": is_tried,
        "image_url": image_url}
    try:
        await database.execute(query=query, values=values)
        return {"msg": "Recipe added", "image_url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database insertion failed: {e}")

@app.delete("/recipes/{id}", response_model=MessageResponse)
async def delete_recipe(id: int):
    find_query = "SELECT id FROM recipes WHERE id = :id"
    recipe_exists = await database.fetch_one(query=find_query, values={"id": id})
    if not recipe_exists:
        raise HTTPException(status_code=404, detail=f"Recipe with id {id} not found")

    delete_query = "DELETE FROM recipes WHERE id = :id"
    await database.execute(query=delete_query, values={"id":id})
    return {"msg": f"Recipe with id {id} successfully deleted"}

@app.patch("/recipes/{id}", response_model=RecipeOut)
async def edit_recipe(
    id: int,
    title: Optional[str] = Form(None),
    ingredients: Optional[str] = Form(None),
    steps: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    is_tried: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None)):

    updates = {}
    if title is not None: updates["title"] = title
    if ingredients is not None: updates["ingredients"] = ingredients
    if steps is not None: updates["steps"] = steps
    if category is not None: updates["category"] = category
    if is_tried is not None: updates["is_tried"] = is_tried

    if image:
        try:
            loop = asyncio.get_event_loop()
            upload_result = await loop.run_in_executor(
                None,
                lambda: cloudinary.uploader.upload(image.file, folder="rasoighar_uploads")
            )
            updates["image_url"] = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {e}")

    if not updates:
        raise HTTPException(status_code=400, detail="No update data provided.")

    set_parts = [f"{key} = :{key}" for key in updates.keys()]
    set_clause = ", ".join(set_parts)
    query = f"UPDATE recipes SET {set_clause} WHERE id = :id RETURNING *"

    values_for_query = updates.copy()
    values_for_query["id"] = id

    try:
        updated_row = await database.fetch_one(query=query, values=values_for_query)
        if not updated_row:
            raise HTTPException(status_code=404, detail="Recipe not found for update.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database update failed: {e}")

    return updated_row