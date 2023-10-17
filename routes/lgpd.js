const express = require("express");
const router = express.Router();

const {home, novoDocumento, lerPdf} = require('../controller/lgpd.js');

router.get("/", home);
router.get("/novo-documento", novoDocumento);
router.post("/ler-pdf", lerPdf);

module.exports = router;