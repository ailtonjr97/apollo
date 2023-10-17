const axios = require("axios")
const sql = require('mssql')

const sqlConfig = {
  user: process.env.MSUSER,
  password: process.env.MSPASSWORD,
  database: process.env.MSDATABASE,
  server: process.env.MSSERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

const home = async(req, res)=>{
    try {
          const clientes = [];
          await sql.connect(sqlConfig);

          const result = await sql.query ('select * from CLIENTES');

          result.recordset.forEach(element => {
            clientes.push(element.CODIGO);
          });
       } catch (err) {
          console.log(err)
       }
};

module.exports = {
    home,
}