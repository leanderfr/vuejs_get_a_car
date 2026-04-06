

const express = require('express')
const morgan = require('morgan')
const cors = require('cors'); // Import the cors middleware
const multer = require('multer');

const carRoutes = require('./routes/carRoutes')
const expressionRoutes = require('./routes/expressionRoutes')
const bookingRoutes  = require('./routes/bookingRoutes')

const db = require('./models')

const app = express()


// better debug
app.use( morgan('dev') )   

//app.use(express.json());

app.use(cors()); 

const upload = multer(); // For parsing text-only form-data


app.use('/car', carRoutes)
app.use('/expression', upload.none(), expressionRoutes)
app.use('/booking',  bookingRoutes)

app.use((req, response) => {
  response.status(404).send('Sorry, that route does not exist!');
  return
});

db.sequelize.sync().then((req) => { 
  app.listen(3000)

  console.log('conectou na base')
})





