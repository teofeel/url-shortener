const express = require('express')
const session = require('express-session')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const db = require('./db')

const controller = require('./functions/controller')
const middleware = require('./functions/middleware')
const views = require('./functions/views')

const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    secret: 'secret',
	resave: false,
	saveUninitialized: true
}))

app.get('/viewURLs', middleware.checkIfLoggedIN, views.viewURLs)
app.get('/:shortURL', middleware.checkIfLoggedIN, views.redirect)

app.post('/register', middleware.register, controller.register)
app.post('/login', middleware.login, controller.login)
app.post('/createNewURL', [middleware.checkIfLoggedIN, middleware.createNewURL], controller.createNewURL)

app.put('/editURL', [middleware.checkIfLoggedIN, middleware.editURL], controller.editURL)

app.delete('/deleteURL', [middleware.checkIfLoggedIN, middleware.deleteURL], controller.deleteURL)
app.delete('/logout', views.logout)

app.listen(PORT, (err)=>{console.log('Server is running')})