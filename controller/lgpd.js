const fs = require('fs')
const pdfParse = require('pdf-parse')
const dbFiles = require('../db/lgpd')

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
        await dbFiles.insertFiles(req.body.pdfs)
        res.redirect('/lgpd')
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