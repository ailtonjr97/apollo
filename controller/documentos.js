const path = require("path")
const DbDocs = require("../db/qualidade.js")

const docsQualidade = async(req, res)=>{
    try {
        res.render("qualidade/home", {
            docs: await DbDocs.showDocs()
        });
    } catch (error) {
        console.log(error);
        res.render("error");
    };
};

const newDocsQualidade = async(req, res)=>{
    try {
        res.render("qualidade/novoDocumento");
    } catch (error) {
        console.log(error);
        res.render("error");
    };
};

const renderizaArquivo = async(req, res)=>{
    try {
        res.sendFile(path.join(__dirname, `../storage/FOR-EDP-025.pdf`));
    } catch (error) {
        console.log(error);
        res.render("error");
    };
};

const editarNovoDocumento = async(req, res)=>{
    try {
        res.render("qualidade/editarNovoDocumento");
    } catch (error) {
        console.log(error);
        res.render("error");
    };
};

const salvarNovoDocumento = async (req, res)=>{
    try {
        console.log(req.body)
        await DbDocs.insertDocs(
            req.body.tipo_doc,
            req.body.data,
            req.body.inspetor,
            req.body.cod_prod,
            req.body.descri,
            req.body.lote_odf,
            req.body.lance,
            req.body.quantidade_metragem,
            req.body.cpnc_numero,
            req.body.motivo_nc,
        )
        res.redirect("/documentos-qualidade")
    } catch (error) {
        console.log(error);
        res.render("error");
    }
}

const mostraDocumento = async(req, res)=>{
    try {
        const doc = await DbDocs.showDoc()
        res.render("qualidade/mostraDocumento", {
            doc: doc[0]
        })
    } catch (error) {
        console.log(error);
        res.render("error");
    }
}

module.exports = {
    docsQualidade,
    newDocsQualidade,
    renderizaArquivo,
    editarNovoDocumento,
    salvarNovoDocumento,
    mostraDocumento
}