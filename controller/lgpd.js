const dbFiles = require('../db/lgpd');
const path = require('path');

const home = async(req, res)=>{
    try {
        res.render('lgpd/home', {
            files: await dbFiles.showFiles()
        });
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const novoDocumento = async (req, res)=>{
    try {
        res.render('lgpd/novoDocumento')
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const salvarPdf = async (req, res)=>{
    try {
        req.files.forEach(file => {
            dbFiles.insertFiles(file.fieldname, file.originalname, file.encoding, file.mimetype, file.destination, file.filename, file.path, file.size)
        });
        res.redirect('/lgpd')
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const visualizarPdf = async(req, res)=>{
    try {
        const consulta = await dbFiles.selectFile(req.params.id)
        res.send(`<embed src="/lgpd/arquivo/${consulta[0].filename}" style="width: 100%; height: 700px"/>`);
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const enviarArquivo = async(req, res) =>{
    try {
        res.sendFile(path.join(__dirname, `../storage/${req.params.filename}`))
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

module.exports = {
    home,
    novoDocumento,
    salvarPdf,
    visualizarPdf,
    enviarArquivo
};