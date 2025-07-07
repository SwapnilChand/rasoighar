CREATE TABLE recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    steps TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_tried INTEGER DEFAULT 0
);