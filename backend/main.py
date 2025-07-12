import sqlite3, os
from typing import Optional, List, Annotated
from pydantic import BaseModel, StringConstraints, Field
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class Recipe(BaseModel):
    title: Annotated[str, StringConstraints(min_length=1, strip_whitespace=True)]
    ingredients: Annotated[List[str], StringConstraints(min_length=1)]
    steps: Annotated[str, StringConstraints(min_length=1, strip_whitespace=True)]
    category: Annotated[List[str], StringConstraints(min_length=1)]
    image_url: Optional[str] = None
    is_tried: Annotated[int, Field(ge=0, le=1)] = 0


class RecipeOut(Recipe):
    id: int

class MessageResponse(BaseModel):
    msg: str
    image_url: Optional[str] = None

# Utility Function
db = "recipes.db"

def get_db_connection():
    conn = sqlite3.connect(db)
    conn.row_factory = sqlite3.Row
    return conn

# Endpoints

@app.get("/recipes/{id}", response_model=RecipeOut)
def get_recipe_by_id(id: int):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recipes WHERE id = ?", (id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return {
            **dict(row),
            "category": row["category"].split(","),
            "ingredients": row["ingredients"].split(",")
        }

@app.get("/recipes", response_model=List[RecipeOut])
def get_all_recipes():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recipes")
        rows = cursor.fetchall()

        return [
            {
                **dict(row),
                "category": row["category"].split(","),
                "ingredients": row["ingredients"].split(",")
            }
            for row in rows
        ]

@app.get("/recipes/category/{category}", response_model=List[RecipeOut])
def get_recipes_by_category(category: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recipes WHERE category LIKE ?", (f"%{category}%",))
        rows = cursor.fetchall()

        return [
            {
                **dict(row),
                "category": row["category"].split(","),
                "ingredients": row["ingredients"].split(",")
            }
            for row in rows
        ]

@app.get("/tried-recipes", response_model=List[RecipeOut])
def get_tried_recipes():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recipes WHERE is_tried = 1")
        rows = cursor.fetchall()

        return [
            {
                **dict(row),
                "category": row["category"].split(","),
                "ingredients": row["ingredients"].split(",")
            }
            for row in rows
        ]

@app.get("/recipes/search/q", response_model=List[RecipeOut])
def search_recipes(q: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        like_query = f"%{q}%"
        cursor.execute("SELECT * FROM recipes WHERE title LIKE ? OR ingredients LIKE ?", (like_query, like_query))
        rows = cursor.fetchall()

        return [
            {
                **dict(row),
                "category": row["category"].split(","),
                "ingredients": row["ingredients"].split(",")
            }
            for row in rows
        ]

@app.post("/add-sample-recipe", response_model=MessageResponse)
def add_sample_recipe():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO recipes (title, ingredients, steps, category) VALUES (?, ?, ?, ?)", ("Omlette", "Eggs, onions", "Mix & cook", "non-veg"))
        conn.commit()
        return {"msg": "Recipe added"}

@app.post("/add-recipe", response_model=MessageResponse)
async def add_recipe(
    title: str = Form(...),
    ingredients: str = Form(...),
    steps: str = Form(...),
    category: str = Form(...),
    is_tried: int = Form(0),
    image: UploadFile = File(None)):

    # image handling
    image_url = None
    if image:
        try:
            upload_dir = "uploads"
            os.makedirs(upload_dir, exist_ok=True)
            image_path = os.path.join(upload_dir, image.filename)
            with open(image_path, "wb") as f:
                f.write(await image.read())
            image_url = f"/uploads/{image.filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail="Image upload failed")

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO recipes (title, ingredients, steps, category, image_url, is_tried) VALUES (?, ?, ?, ?, ?, ?)",(title, ingredients, steps, category, image_url, is_tried))
        conn.commit()
        return {"msg": "Recipe added", "image_url": image_url}

@app.post("/recipes/{id}/mark-tried", response_model=MessageResponse)
def mark_as_tried(id: int):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE recipes SET is_tried = 1 WHERE id = ?", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return {"msg": "Recipe marked as tried"}

@app.patch("/recipes/{id}", response_model=RecipeOut)
async def update_recipe(
    id: int,
    title: Optional[str] = Form(None),
    ingredients: Optional[str] = Form(None),
    steps: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    is_tried: Optional[int] = Form(None),
    image: UploadFile = File(None)):

    updates = {}
    if title: updates["title"] = title
    if ingredients: updates["ingredients"] = ingredients
    if steps: updates["steps"] = steps
    if category: updates["category"] = category
    if is_tried is not None: updates["is_tried"] = is_tried

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recipes WHERE id = ?", (id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Recipe not found")

        image_url = row["image_url"]
        if image:
            try:
                upload_dir = "uploads"
                os.makedirs(upload_dir, exist_ok=True)
                image_path = os.path.join(upload_dir, image.filename)
                with open(image_path, "wb") as f:
                    f.write(await image.read())
                image_url = f"/uploads/{image.filename}"
                updates["image_url"] = image_url
            except:
                raise HTTPException(status_code=500, detail="Image update failed")

        if not updates:
            return dict(row)

        set_clause = ",".join([f"{k} = ?" for k in updates.keys()])
        values = list(updates.values()) + [id]
        cursor.execute(f"UPDATE recipes SET {set_clause} WHERE id = ?", values)
        conn.commit()

        # Return updated row
        cursor.execute("SELECT * FROM recipes WHERE id = ?", (id,))
        return dict(cursor.fetchone())

@app.delete("/recipes/{id}", response_model=MessageResponse)
def delete_recipe(id: int):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recipes WHERE id = ?", (id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Recipe not found")

        image_url = row["image_url"]
        if image_url and os.path.exists(image_url):
            os.remove(image_url)

        cursor.execute("DELETE FROM recipes WHERE id = ?", (id,))
        conn.commit()
        return {"msg": f"Recipe deleted with id: {id}"}

# Serve images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
