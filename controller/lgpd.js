const fs = require('fs')
const pdfParse = require('pdf-parse')

const home = async(req, res)=>{
    try {
        res.render('lgpd/home');
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

const lerPdf = async (req, res)=>{
    try {
        if(!req.files && !req.files.pdfFile){
            res.status(400);
            res.end();
        }
        pdfParse(req.files.pdfFile).then(result=>{
            console.log(result)
            res.send(result.text)
        })
    } catch (error) {
        console.log(error);
        res.render('error');
    }
}


module.exports = {
    home,
    novoDocumento,
    lerPdf
};