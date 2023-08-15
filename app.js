require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose=require('mongoose');
const cors=require('cors');
//
const corsOptions=require('./config/cors');
const credentials=require('./middleware/credentials');
const connectDB=require('./config/database');
const errorHandlerMiddleware=require('./middleware/error_handler');
const authenticationMiddleware = require('./middleware/authentication')
//
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


const app = express();
const PORT=3500;


connectDB();
app.use(credentials);
app.use(cors(corsOptions));
//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticationMiddleware)
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandlerMiddleware);

//Routers
app.use('/', indexRouter);  
app.use('/users', usersRouter);
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/session',require('./routes/api/session'));
app.use('/api/task',require('./routes/api/task'));
app.use('/api/blog',require('./routes/api/blog'));
app.use('/api/comment',require('./routes/api/comment'));


app.all('*', (req, res) => {
  res.status(404)

  if(req.accepts('json')){
    res.json({'error': '404 Not Found'})
  }else{
    res.type('text').send('404 Not Found')
  }
})

mongoose.connection.once('open', ()=>{
  console.log('DB connected')
  app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })
})