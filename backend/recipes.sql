CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    steps TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_tried INTEGER DEFAULT 0
);