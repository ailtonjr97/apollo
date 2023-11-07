const Setores = require("../db/setores");

const setores = async(req, res)=>{
    try {
        const setores = await Setores.selectSetores();
        const contagem = await Setores.countSetores();
        res.render("setores/home", {
            setores: setores,
            contagem: contagem
        })
    } catch (error) {
        console.log(error);
        res.render("error")
    }
}

const setoresPost = async(req, res)=>{
    try {
        await Setores.insertSetores(req.body.nome)
        res.redirect("/setores")
    } catch (error) {
        console.log(error);
        res.render("error")
    }
}

const novoSetor = async(req, res)=>{
    try {
        res.render("setores/novoSetor.ejs")
    } catch (error) {
        console.log(error);
        res.render("error")
    }
}

module.exports = {
    setores,
    setoresPost,
    novoSetor
}