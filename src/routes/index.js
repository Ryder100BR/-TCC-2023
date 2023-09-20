const { Router, static: expressStatic } = require("express");
const http = require("http");
const { storage, uploadFolder } = require("../config/upload");
const multer = require("multer");

const Usuarios = require("../controllers/usuarios/index");
const Convites = require("../controllers/convites/index");
const Pagamentos = require("../controllers/pagamentos/index");
const Fotos = require("../controllers/fotos/index");
const Eventos = require("../controllers/eventos/index");

const routes = new Router();
const upload = multer({ storage });

routes.get("/", (req, res) => {
  // return res.sendFile("/sandbox/public/index.html");
  return res.status(200).send("Servidor Backend - FormaControl").end();
});

routes.get("/refresh", (req, res) => {
  return res.sendFile("/sandbox/public/index.html");
  // return res.status(200).send("Servidor Funcionando").end();
});

routes.put("/api/*", (req, res) => {
  return res.status(400).end();
});

routes.get("/api/db", (req, res) => {
  return res.status(404).end(http.STATUS_CODES[404]);
});

routes.use("/files", expressStatic(uploadFolder));

routes.post("/auth", Usuarios.auth);
routes.post("/signup", Usuarios.signup);
routes.get("/activate/:chave", Usuarios.activate);

routes.get("/teste", (req, res, next) => {
  res.status(200).send("Teste de mensagem").end();
});

// Rotas para a entidade "usuarios"
routes.post("/api/usuarios", Usuarios.store);
routes.patch("/api/usuarios/:id", Usuarios.update);
routes.patch("/api/avatar/:id", upload.single("avatar"), Usuarios.uploadPhoto);

// Rotas para a entidade "convites"
routes.post("/api/convites", Convites.adicio);

// Rotas para a entidade "pagamentos"
routes.post("/api/pagamentos", Pagamentos.adicionarPagamento);

// Rotas para a entidade "fotos"
routes.post("/api/fotos", Fotos.adicionarFoto);

// Rotas para a entidade "eventos"
routes.post("/api/eventos", Eventos.adicionarEvento);

module.exports = { routes };
