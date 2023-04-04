const { Router, static: expressStatic } = require("express");
const http = require("http");
const { storage, uploadFolder } = require("../config/upload");
const multer = require("multer");
 
const Usuarios = require("../controllers/usuarios/index");

const routes = new Router();
const upload = multer({ storage });

routes.get('/', (req, res) => {
    res.send('Servidor Backend - FormaControl')
  })

routes.put("/api/*", (req, res) => {
    return res.status(400).end();
});

routes.get("/api/db", (req, res) => {
    return res.status(404).end(http.STATUS_CODES[404]);
});


routes.use("/files", expressStatic(uploadFolder));


routes.post("/api/usuarios", Usuarios.store);
routes.patch("/api/usuarios/:id", Usuarios.update);
routes.get("/api/activate/:chave", Usuarios.activate);
routes.patch("/api/avatar/:id", upload.single("avatar"), Usuarios.uploadPhoto);

module.exports = { routes };