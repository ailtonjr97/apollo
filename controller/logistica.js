const db = require('../db/produtos.js')
const puppeteer = require('puppeteer')

const home = async(req, res)=>{
    res.render('logistica/home')
}

const produtos = async(req, res)=>{
    try {
        res.render('logistica/produtos', {
            results: await db.countProdutos(),
            produtos: await db.selectProdutos()
        });
    } catch (error) {
        console.log(error)
        res.render('error')
    };
}

const atualizarSB1 = async(req, res)=>{
    try {
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto('https://tcloud.totvs.com.br/produto/protheus?topology=135676&tab=2.1');
            setTimeout(() => {}, 12000);
            Keyboard.press('s')


        const conn = await mysqlConnect.connect();
        var data = fs.readFileSync('storage/sb1.csv')
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array

        const values = [];
        const colunas = []

        data[0].forEach(async element => {
            colunas.push(element)
        });

        data.forEach(async (element, index) => {
            if(index < 1) return;
            values.push(element)
        });
    
        await conn.query("INSERT INTO sb1_produtos (?) VALUES ?", [colunas, values], function(err) {
            if (err) throw err;
        });

        res.redirect('/logistica/produtos')
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}

const detalhes = async(req, res)=>{
    try {
        let produto = await db.selectProduto(req.params.id)
        res.render('logistica/detalhes', {
            produto: produto
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const produtosKorp = async(req, res)=>{
    try {
        
    } catch (error) {
        res.render('error')
        console.log(error)
    }
}



module.exports = {
    home,
    produtos,
    atualizarSB1,
    detalhes,
};