import sqlite3

with sqlite3.connect("recipes.db") as conn:
    with open("recipes.sql") as f:
        conn.executescript(f.read())
    conn.commit()