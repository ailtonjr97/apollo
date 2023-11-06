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
            files: await dbFiles.showFiles(),
            contagem: await dbFiles.countFiles()
        });
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const novoDocumento = async (req, res)=>{
    try {
        const tipos = await dbFiles.selectGrouDoc()
        res.render('lgpd/novoDocumento', {
            tipos: tipos
        })
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}


const salvarArquivo = async (req, res)=>{
    try {
        const encrypt = (buffer) => {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
            return result;
        };

        for(let i = 0; i < req.files.length; i++){
            const name = Date.now() + "-" + req.files[i].originalname

            const criptografado = encrypt(req.files[i].buffer);
    
            if(req.files.length != 1){
                await dbFiles.insertFiles(
                );
            }else{
                await dbFiles.insertFiles(
                    req.files[i].fieldname,
                    req.files[i].originalname,
                    req.files[i].encoding,
                    req.files[i].mimetype,
                    req.files[i].size,
                    name,
                    req.body.input_obs,
                    req.body.input_nome,
                    req.body.input_subtitulo,
                    req.body.input_tipo
                );
            }

            await files.insertFiles(criptografado, req.files[i].originalname, req.files[i].mimetype, req.files[i].size, req.files[i].fieldname, req.files[i].encoding)
    
            fs.writeFile("storage/" + name, criptografado, (err) => { 
                if(err){
                    console.log(err);
                    res.render('error')
                }
            });
        }

        res.redirect('/lgpd');

    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const visualizarPdf = async(req, res)=>{
    try {
        const consulta = await dbFiles.visualizaFile(req.params.id)
        res.render("lgpd/visualizador.ejs", {
            consulta: consulta
        });
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const enviarArquivo = async(req, res) =>{
    try {
        const decrypt = (encrypted) => {
            const iv = encrypted.slice(0, 16);
            encrypted = encrypted.slice(16);
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
            return result;
         };

         const arquivo = await dbFiles.selectFile(req.params.id)

         fs.readFile('storage/' + arquivo[0].name, (err, data)=>{
            const decrypted = decrypt(data);
            fs.writeFile("temp/" + arquivo[0].name, decrypted, ()=>{
                res.sendFile(path.join(__dirname, `../temp/${arquivo[0].name}`))
            });
        });

        setTimeout(() => {
            fs.unlink("temp/" + arquivo[0].name, (err)=>{
                if (err) {
                    res.render("error")
                    console.log(err);
                }
            })
        }, 60000);
        
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const baixarArquivo = async(req, res) =>{
    try {
        const decrypt = (encrypted) => {
            const iv = encrypted.slice(0, 16);
            encrypted = encrypted.slice(16);
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
            return result;
         };

        const arquivo = await dbFiles.selectFile(req.params.id)

        fs.readFile('storage/' + arquivo[0].name, (err, data)=>{
           const decrypted = decrypt(data);
           fs.writeFile("temp/" + arquivo[0].name, decrypted, ()=>{
            res.download(path.join(__dirname, `../temp/${arquivo[0].name}`))
           });
       });

       setTimeout(() => {
           fs.unlink("temp/" + arquivo[0].name, ()=>{
               if (err) {
                   res.render("error")
                   console.log(err);
               }
           })
       }, 30000);
        
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}

const newuser = async(req, res) =>{
    try {
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
        console.log(error);
        res.render('error');
    }
}


const newGroupDoc = async(req, res) =>{
    try {
        if(req.query.limit == null){
            var grupos = await dbFiles.selectGrouDoc(25);
        }else{
            var grupos = await dbFiles.selectGrouDoc(req.query.limit);
        }
        
        res.render('lgpd/gruposDocumento',{grupos:grupos});
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}
const registerNewGroupDoc = async(req, res) =>{
    try {
        res.render('lgpd/cadastroGruposDocumento');
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}
const saveRegisterNewGroupDoc = async(req, res) =>{
    try {
        dbFiles.insertNewGrouDoc(req.body.nome,req.body.descricao,req.body.validade,req.body.setor,req.body.grupo_seguranca,req.body.img_exemplo)
        res.redirect('/lgpd/novo-grupo-documento')
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}



module.exports = {
    home,
    novoDocumento,
    salvarArquivo,
    visualizarPdf,
    enviarArquivo,
    newuser,
    registernewuser,
    saveRegisterNewUser,
    baixarArquivo,
    newGroupDoc,
    registerNewGroupDoc,
    saveRegisterNewGroupDoc
};