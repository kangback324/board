require('dotenv').config();
const express = require('express');
const { swaggerUi, specs } = require("./swagger.js")

const app = express();
const board_router = require('./routes/board.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/board', board_router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
