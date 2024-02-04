import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

app.get('/plants', async (req, res) => {
  try {
      // Obtener el valor del parámetro 'page' de la solicitud del cliente
      const page = req.query.page;

      // Construir la URL de la solicitud a la API de Trefle con el parámetro 'page'
      const url = `https://trefle.io/api/v1/plants?token=dFyYL65yF8C_M9Y7ArXytbxj5olI0-Sw7wfmy5klD5o&page=${page}`;

      // Realizar la solicitud a la API de Trefle
      const response = await axios.get(url);

      // Enviar la respuesta de la API de Trefle al cliente
      res.json(response.data);
  } catch (error) {
      // Manejar cualquier error que ocurra durante la solicitud
      console.error(error);
      res.status(500).json({ message: 'Error al obtener datos de las plantas.' });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node js!");
});

app.get("/books", (req, res) => {
  const data = readData();
  res.json(data.books);
});

app.get("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = data.books.find((book) => book.id === id);
  res.json(book);
});

app.post("/books", (req, res) => {
  const data = readData();
  const body = req.body;
  const newBook = {
    id: data.books.length + 1,
    ...body,
  };
  data.books.push(newBook);
  writeData(data);
  res.json(newBook);
});

app.put("/books/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);
  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Book updated successfully" });
});

app.delete("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);
  data.books.splice(bookIndex, 1);
  writeData(data);
  res.json({ message: "Book deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
