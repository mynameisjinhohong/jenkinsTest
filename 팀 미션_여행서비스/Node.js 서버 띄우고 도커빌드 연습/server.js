const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

// PostgreSQL 클라이언트 설정
const client = new Client({
  host: 'db',  // Docker Compose에서 설정한 서비스 이름
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// API 엔드포인트: 사용자 정보 반환
app.get('/api/user', (req, res) => {
  client.query('SELECT * FROM users LIMIT 1', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result.rows[0]);
    }
  });
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
