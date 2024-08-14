CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO users (name, email) VALUES ('홍진호', 'ghddhksduq@naver.com');
