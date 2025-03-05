const express = require('express');
const cors = require('cors');

require('dotenv').config()

const router = require ('./src/routes/routes')

const app = express();
app.use(cors())
app.use(express.json())
app.use(router)


app.get('/', (req, res) => {
  res.send('Olá Isaac');
});

// const PORT = process.env.PORT || 4000;
const PORT =  4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:4000`);
});

