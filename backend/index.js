const express = require('express');
const cors = require('cors');

require('dotenv').config()

const router = require ('./src/routes/routes')

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(router)


app.get('/', (req, res) => {
  res.send('Olá Isaac');
});

// const PORT = process.env.PORT || 4000;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

