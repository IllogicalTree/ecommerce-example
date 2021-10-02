const express = require("express");
const app = express();
const seedDatabase = require("./seed.js");
const mydb = require("./cloudant.js");

app.use(express.json());

seedDatabase();

app.get("/", (req, res) => {
  res.send("We're up and running! Check out /products")
})

app.get("/products", (req, res) => {
  let products = [];
  mydb.list({ include_docs: true }, (err, body) => {
    if (!err) {
      body.rows.forEach((row) => {
        products.push({
          id: row.doc.id,
          title: row.doc.title,
          price: row.doc.price,
          description: row.doc.description,
          category: row.doc.category,
          image: row.doc.image,
        });
      });
    }
    res.json(products);
  });
});

// TODO add additional endpoints, e.g request a single product by id

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening to requests at http://localhost:${port}`);
});
