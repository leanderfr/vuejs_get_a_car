

const http = require('http')
const fs = require('fs')
const _ = require('lodash')
const express = require('express')

const morgan = require('morgan')

const mysql = require('mysql')

//const router = express.Router()

const routes = require('./routes/carRoutes')
const app = express()

app.set('view engine','ejs')
app.listen(3000)

app.use( morgan('dev') )

app.use( express.json() )    //converte para req.body

app.get('/teste', (req, res) => {
res.send('teste ok')

})



app.use(routes)

//app.use('/blogs', routes)

//app.use((req, res) => {
  //res.render('404')
//})


const conexao = require('./database/setup')


/*
const server = http.createServer( (req, res) => {
  res.setHeader('Content-Type','text/plain')

  let num = _.random(0, 30)
  res.end(`num = ${num}`)
  
  
  //res.setHeader('Content-Type','text/html')
  //fs.readFile('./views/index.html', (err, data) => {
    //if (! err) {
      //res.statusCode = 200
      //res.end(data)
    //}
  //})


  //console.log(req.url, req.method)
//  res.write('teste')
//  res.end()

})

server.listen(3000, 'localhost', () => {
  console.log('servidor ok')
})
*/