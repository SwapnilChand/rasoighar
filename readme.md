# Rasoi Ghar – Recipe Manager

Rasoi Ghar is a full-stack recipe management app that lets users add, view, search, and organize their favorite recipes.

Built with **React** (frontend), **FastAPI** (backend), and **SQLite** (database), it provides a simple and intuitive interface for home cooks and food enthusiasts.

---

## 🚀 Features

- **Add New Recipes**  
  Users can add recipes with a title, ingredients, steps, category (veg, non-veg, dessert, etc.), and an optional image.

- **View & Search Recipes**  
  Browse all saved recipes in a card/grid view. Search recipes by title or ingredients.

- **Filter by Category**  
  Quickly filter recipes by categories such as veg, non-veg, dessert, etc.

- **Mark as Tried/To Try**  
  Mark recipes as “tried” or “to try” for easy tracking.

- **Image Uploads**  
  Upload and view images for each recipe.

- **AI-Powered Suggestions**

  - Suggest recipes based on available ingredients (keyword match)
  - Highlight similar recipes based on title/description
  - Auto-categorize recipes using the ingredients list
  - Generate a recipe summary (title + key steps)

- **Shopping List**  
  Create a shopping list from selected recipes.

- **User Accounts**  
  Users can sign up and save personal recipes.

---

## 🛠 Tech Stack

- **Frontend:** ReactJS (with form inputs, filters, and card/grid views)
- **Backend:** FastAPI (Python with Pydantic models)
- **Database:** SQLite (for database)
- **UI Library:** shadcn/ui (for beautiful, accessible components)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/SwapnilChand/rasoighar
cd rasoighar
```

### 2. Setup Backend

```sh
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python db.py
uvicorn main:app --reload
```
