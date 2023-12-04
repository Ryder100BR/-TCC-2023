const { object, string } = require("yup");
const express = require("express");
const multer = require("multer");
const { apiEndpoints } = require("../../api/index");
const { uploadFolder } = require("../../config/upload");
const fs = require("fs");
const { Router } = require("express");


const routes = Router();
const upload = multer({ dest: uploadFolder }); // Certifique-se de configurar a pasta de destino correta.
routes.post("/fotos", upload.single("file"), (req, res) => {
  try {
    // Aqui você deve processar e salvar a foto no seu banco de dados ou armazenamento.
    // A propriedade req.file contém as informações do arquivo enviado.
    console.log("Arquivo recebido:", req.file);

    // Exemplo: Salvar a foto no banco de dados
    // const foto = new Foto({ nome: req.file.originalname, url: req.file.filename });
    // foto.save();

    return res.status(200).json({ message: "Arquivo recebido com sucesso" });
  } catch (error) {
    console.error("Erro ao processar o arquivo", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});
class Fotos {
  async store(req, res, next) {
    let fotoSchema = object({
      id_evento: string().required("Entre com o ID do evento"),
      nome: string().required("Entre com o nome da foto"),
      descricao: string().required("Entre com a descrição da foto"),
      url: string().required("Entre com a URL da foto"),
    });

    try {
      await fotoSchema.validate(req.body);
    } catch (error) {
      return res.status(400).send({ error: error.message }).end();
    }

    const foto = apiEndpoints.db
      .get("/fotos")
      .find({ nome: req.body.nome })
      .cloneDeep()
      .value();

    if (foto) {
      return res
        .status(400)
        .send({ error: "Foto com esse nome já cadastrada" })
        .end();
    }

    req.body = {
      ...req.body,
      id: Date.now().toString(), // Gera um ID único baseado no timestamp
    };

    next();
  }

  async update(req, res, next) {
    let fotoSchema = object({
      id_evento: string(),
      nome: string(),
      descricao: string(),
      url: string(),
    });

    try {
      await fotoSchema.validate(req.body);
    } catch (error) {
      return res.status(400).send({ error: error.message }).end();
    }

    next();
  }
}

module.exports = new Fotos();
