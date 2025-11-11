
const mysql = require('mysql')

const conexao = mysql.createConnection( {
  host: 'mysql.amegsistema.com.br',
  port: 3306, 
  user: 'amegsistema01',
  password: 'sucesso123',
  database: 'amegsistema01'  
})

module.exports = conexao
