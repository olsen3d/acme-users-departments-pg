const express = require("express");
const app = express();
const db = require("./db");
const path = require("path");
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/api/users", async (req, res, next) => {
  await db
    .findAllUsers()
    .then(users => res.send(users))
    .catch(ex => next(ex));
});

app.get("/api/departments", async (req, res, next) => {
  await db.findAllDepartments().then(departments => console.log(departments));
});

db.sync().then(() => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});
