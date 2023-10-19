const dbFiles = require('../db/lgpd');
const fs = require('fs');

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
        req.files.forEach(element => {
            dbFiles.insertFiles(element.buffer.toString('base64'), element.originalname, element.mimetype, element.size)
        });
        res.redirect('/lgpd/novo-documento')
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const visualizarPdf = async(req, res)=>{
    try {
        const consulta = await dbFiles.selectFile(req.params.id)

        const base64 = consulta[0].file
        const image = Buffer.from(base64, "base64")
        
        res.send(fs.writeFileSync("image.png", image))
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}


module.exports = {
    home,
    novoDocumento,
    salvarPdf,
    visualizarPdf
};