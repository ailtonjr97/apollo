const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: process.env.SQLHOST,
        port: '3306',
        user: process.env.SQLUSER,
        password: process.env.SQLPASSWORD,
        database: process.env.SQLDATABASE,
        waitForConnections: true,
        connectionLimit: 100,
        maxIdle: 100, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
      });
    return pool;
}

connect();

let showDocs = async()=>{
    const conn = await connect();
    const [values] = await conn.query('select * from docspro.docs_qualidade');
    conn.end();
    return values
}

let insertDocs = async(tipo_doc, data, inspetor, cod_prod, descri, lote_odf, lance, quantidade_metragem, cpnc_numero, motivo_nc)=>{
    const conn = await connect();
    await conn.query('INSERT INTO docspro.docs_qualidade (tipo_doc, data, inspetor, cod_prod, descri, lote_odf, lance, quantidade_metragem, cpnc_numero, motivo_cpnc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [tipo_doc, data, inspetor, cod_prod, descri, lote_odf, lance, quantidade_metragem, cpnc_numero, motivo_nc]);
    conn.end();
}

let showDoc = async()=>{
    const conn = await connect();
    const [values] = await conn.query('select * from docspro.docs_qualidade where id = 1');
    conn.end();
    return values
}


module.exports = {
    insertDocs,
    showDocs,
    showDoc
}