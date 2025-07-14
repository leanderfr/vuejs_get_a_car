

const http = require('http')
const fs = require('fs')
const _ = require('lodash')
const express = require('express')

const app = express()

app.set('view engine','ejs')
app.listen(3000)


app.get('/', (req, res) => {
  //res.send('teste 123...')
//  res.sendFile('./views/index.html', {root: __dirname})
  res.render('index', {title: 'titulo teste'})
})

app.use((req, res) => {
  res.render('404')
})


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