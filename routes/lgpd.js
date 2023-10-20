const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path')

const {home, novoDocumento, salvarPdf, visualizarPdf, enviarArquivo} = require('../controller/lgpd.js');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'storage/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.replace(path.extname(file.originalname), '') + '---' + Date.now() + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/", home);
router.get("/novo-documento", novoDocumento);
router.post("/ler-pdf", upload.array('arquivos'), salvarPdf);
router.get("/visualizar/:id", visualizarPdf);
router.get("/arquivo/:filename", enviarArquivo);

module.exports = router;