const express = require("express");
const router = express.Router();
const multer = require('multer');

const {home, novoDocumento, salvarArquivo, visualizarPdf, enviarArquivo, newuser, registernewuser, saveRegisterNewUser, baixarArquivo, newGroupDoc, registerNewGroupDoc, saveRegisterNewGroupDoc, EditUser} = require('../controller/lgpd.js');
const {setores, setoresPost, novoSetor} = require('../controller/setores.js');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


//files
router.get("/todos-os-documentos", home);
router.get("/novo-documento", novoDocumento);
router.post("/ler-pdf", upload.array('arquivos'), salvarArquivo);
router.get("/visualizar/:id", visualizarPdf);
router.get("/arquivo/:id", enviarArquivo);
router.get("/download/:id", baixarArquivo);

router.get("/novo-usuario", newuser);
router.get("/cadastro-novo-usuario", registernewuser);
router.post("/cadastro-novo-usuario", saveRegisterNewUser);
router.get("/editar-usuario", EditUser);

//Grupo documento
router.get("/novo-grupo-documento", newGroupDoc);
router.get("/cadastro-grupo-documento", registerNewGroupDoc);
router.post("/cadastro-grupo-documento", saveRegisterNewGroupDoc);

//Setores
router.get("/setores", setores);
router.get("/novo-setor", novoSetor);
router.post("/novo-setor", setoresPost);

module.exports = router;