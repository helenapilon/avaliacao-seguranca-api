const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: ["http://localhost:3000", "https://avaliacao-seguranca.vercel.app/"],
};

const db = require("./queries");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Avaliação - Segurança de Aplicações." });
});

app.get("/user", db.getUsers);
app.get("/user/:id", db.getUserById);
app.post("/user/login", db.login);
app.post("/user", db.createUser);
app.put("/user/:id", db.updateUser);
app.delete("/user/:id", db.deleteUser);

app.get("/log", db.getLogs);
app.get("/log/:id", db.getLogById);
app.get("/log/user/:id", db.getLogByUserId);
app.post("/log", db.createLog);
app.delete("/log/:id", db.deleteLog);

app.get("/role", db.getRoles);
app.get("/role/:id", db.getRoleById);
app.post("/role", db.createRole);
app.put("/role/:id", db.updateRole);
app.delete("/role/:id", db.deleteRole);

app.get("/type", db.getTypes);
app.get("/type/:id", db.getTypeById);
app.post("/type", db.createType);
app.put("/type/:id", db.updateType);
app.delete("/type/:id", db.deleteType);

app.get("/pet", db.getPets);
app.get("/pet/:id", db.getPetById);
app.post("/pet", db.createPet);
app.put("/pet/:id", db.updatePet);
app.delete("/pet/:id", db.deletePet);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
