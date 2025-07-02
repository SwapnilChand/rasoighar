import sqlite3
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI


app = FastAPI()

class Recipe(BaseModel):
    title: str
    ingredients: str
    steps: str
    category: str
    image_url: Optional[str] = None
    is_tried: Optional[int] = 0

@app.get("/recipes/{id}")
def get_all_recipes(id:int):
    conn = sqlite3.connect("recipes.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes WHERE id = ?", (id,))
    row = cursor.fetchone()
    conn.close()
    if (row):
        return {"recipe": row}
    return {"recipe": [], "msg": "No recipes with the given id found"}


@app.get("/recipes")
def get_all_recipes():
    conn = sqlite3.connect("recipes.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes")
    rows = cursor.fetchall()
    conn.close()
    return {"recipes": rows}


@app.post("/add-sample-recipe")
def add_sample_recipe():
    with sqlite3.connect("recipes.db") as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO recipes (title, ingredients, steps, category) VALUES (?, ?, ?, ?)",
            (
                "Omlette",
                "Eggs, onions, chilli flakes",
                "Fix raw eggs with chopped onions and chilli, put oil on a pan and pour the batter, cook for a few minutes.",
                "non-veg"
            )
        )
        conn.commit()
        return {"msg": "Recipe added"}

@app.get("/veg-recipes")
def get_veg_recipes():
    conn = sqlite3.connect("recipes.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes WHERE category = ?", ("veg",))
    rows = cursor.fetchall()
    conn.close()
    return {"veg_recipes": rows}

@app.get("/tried-recipes")
def get_tried_recipes():
    conn = sqlite3.connect("recipes.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes WHERE is_tried = 1")
    rows = cursor.fetchall()
    conn.close()
    return {"tried_recipes": rows}


@app.post("/add-recipe")
def add_recipe(recipe:Recipe):
    with sqlite3.connect("recipes.db") as conn:
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO recipes (title, ingredients, steps, category, image_url, is_tried) VALUES (?, ?, ?, ?, ?, ?)",
            (
                recipe.title,
                recipe.ingredients,
                recipe.steps,
                recipe.category,
                recipe.image_url,
                recipe.is_tried
            )
        )
        conn.commit()
        return {"msg": "Recipe added"}

@app.post("/recipes/{id}/mark-tried")
def mark_as_tried(id: int):
    with sqlite3.connect("recipes.db") as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE recipes SET is_tried = 1 WHERE id = ?", (id,)
        )
        conn.commit()     
        if cursor.rowcount == 0:
            return {"msg": f"No recipe found with id: {id}"}
        return {"msg": "Marked as tried"}

@app.get("/recipes/search")
def search_recipes(q: str):
    with sqlite3.connect("recipes.db") as conn:
        cursor = conn.cursor()
        like_query = f"%{q}%"
        cursor.execute("SELECT * FROM recipes WHERE title like ? or ingredients like ?", (like_query, like_query))
        rows = cursor.fetchall()
        if rows:
            return {"results" : rows}
        return {"results": [], "msg": "No recipes match found"}
