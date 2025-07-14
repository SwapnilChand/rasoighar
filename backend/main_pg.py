import os
from databases import Database

DATABASE_URL = os.getenv("DATABASE_URL") 
database = Database(DATABASE_URL)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()