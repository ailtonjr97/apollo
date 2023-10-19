const express = require("express");
const router = express.Router();
const multer = require('multer');

const {home, novoDocumento, salvarPdf, visualizarPdf} = require('../controller/lgpd.js');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/", home);
router.get("/novo-documento", novoDocumento);
router.post("/ler-pdf", upload.array('arquivos'), salvarPdf);
router.get("/visualizar-pdf/:id", visualizarPdf);

module.exports = router;