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

const newuser = async(req, res) =>{
    try {
console.log(req.query.limit);
        if(req.query.limit == null){
            var user = await dbFiles.selectUsers(25);
        }else{
            var user = await dbFiles.selectUsers(req.query.limit);
        }
        
        res.render('lgpd/novoUsuario',{users:user});
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const registernewuser = async(req, res) =>{
    try {
        res.render('lgpd/cadastronovoUsuario')
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}
const saveRegisterNewUser = async(req, res) =>{
    try {

         dbFiles.insertNewUsers(req.body.nome,req.body.cpf,req.body.rg,req.body.nascimento,req.body.setor,req.body.status_)

        res.redirect('/lgpd/novo-usuario')
    } catch (error) {

        res.render('error');
    }
}
module.exports = {
    home,
    novoDocumento,
    salvarPdf,
    visualizarPdf,
    enviarArquivo,
    newuser,
    registernewuser,
    saveRegisterNewUser
};