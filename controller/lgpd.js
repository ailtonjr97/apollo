const dbFiles = require('../db/lgpd');
const files = require('../db/files')
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

const algorithm = 'aes-256-ctr';
let key = process.env.FILESKEY;
key = crypto.createHash('sha256').update(String(key)).digest('base64').substring(0, 32);

const home = async(req, res)=>{
    try {
        res.render('lgpd/home', {
            files: await files.showFiles(),
            contagem: await files.countFiles()
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
        const encrypt = (buffer) => {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
            return result;
        };

        req.files.forEach(async (file) => {
            let criptografado = encrypt(file.buffer);
            await files.insertFiles(criptografado, file.originalname, file.mimetype, file.size, file.fieldname, file.encoding)
        });

        res.redirect('/lgpd')
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const visualizarPdf = async(req, res)=>{
    try {
        const consulta = await files.visualizaFile(req.params.id)
        res.send(`<embed src="/lgpd/arquivo/${consulta[0].id}#toolbar=0&navpanes=0&scrollbar=0"" style="width: 100%; height: 700px"/>`);
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const enviarArquivo = async(req, res) =>{
    try {
        const decrypt = (encrypted) => {
            // Get the iv: the first 16 bytes
            const iv = encrypted.slice(0, 16);
            // Get the rest
            encrypted = encrypted.slice(16);
            // Create a decipher
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            // Actually decrypt it
            const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
            return result;
         };

        const resultado = await files.selectFile(req.params.id)
        const decrypted = decrypt(resultado[0].file);

        const nomeArq = Date.now() + '-' + resultado[0].originalname

        fs.writeFileSync(nomeArq, decrypted)

        res.sendFile(path.join(__dirname, `../${nomeArq}`))

        setTimeout(()=>{
            fs.unlinkSync(nomeArq)
        }, 60000)
        
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