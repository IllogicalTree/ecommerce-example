/* All dummy data used to seed the database has been taken from https://github.com/keikaavousi/fake-store-api */

const products = require("./products.json");
const mydb = require("./cloudant.js");

const seedDatabase = async () => {
  await mydb.bulk({ docs: products });
  console.log("Finished adding products to database");
};

module.exports = seedDatabase;
