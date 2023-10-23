const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path')

const {home, novoDocumento, salvarPdf, visualizarPdf, enviarArquivo, newuser, registernewuser, saveRegisterNewUser, baixarArquivo} = require('../controller/lgpd.js');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/", home);
router.get("/novo-documento", novoDocumento);
router.post("/ler-pdf", upload.array('arquivos'), salvarPdf);
router.get("/visualizar/:id", visualizarPdf);
router.get("/arquivo/:id", enviarArquivo);
router.get("/download/:id", baixarArquivo);
router.get("/novo-usuario", newuser);
router.get("/cadastro-novo-usuario", registernewuser);
router.post("/cadastro-novo-usuario", saveRegisterNewUser);
module.exports = router;