CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    ingredients TEXT,
    steps TEXT,
    category TEXT,
    image_url TEXT,
    is_tried INTEGER DEFAULT 0
);