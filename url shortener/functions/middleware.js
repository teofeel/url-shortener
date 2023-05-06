const db = require('../db')
var crypto = require('crypto')

module.exports={
    checkIfLoggedIN:async (req,res,next)=>{
        try{
            if(!req.session.loggedin) throw new Error('User is not logged in')
            next()
        }catch(err){
            res.send({"status":400, "message":err.message})
        }
    }, 
    
    login:async (req,res,next)=>{
        try{
            if(req.session.loggedin) throw new Error('User is alredy logged in')

            const {email, password} = req.body

            if(!email || !password) throw new Error('Info is missing')
            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)==false) throw new Error('Email is in wrong format')

            let query = `SELECT * FROM users WHERE email="${email}"`
            db.connection.query(query, (err,data)=>{
                let hashedPassword = crypto.pbkdf2Sync(password, data[0].salt, 1000,64,'sha512').toString('hex')

                if(hashedPassword!=data[0].password) res.send('Email and password not matching')
                else next()
            })
        }catch(err){
            res.status(400).send({"message":err.message})
        }
    },

    register:async (req,res,next)=>{
        try{
            if(req.session.loggedin) throw new Error('User is already logged in')

            const {username,email,password,confirmPassword} = req.body

            if(!username || !email || !password || !confirmPassword) throw new Error('Info is missing')
            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)==false) throw new Error('Email is in wrong format')
            if(password!=confirmPassword) throw new Error('Passwords are not matching')

            var createTableIFNotExists = `
            CREATE TABLE IF NOT EXISTS users (
                id int(11) NOT NULL AUTO_INCREMENT,
                username varchar(50) NOT NULL,
                email varchar(255) NOT NULL,
                password varchar(1000) NOT NULL,
                salt varchar(1000) NOT NULL,
                PRIMARY KEY (id)
            );`
            db.connection.query(createTableIFNotExists, (error,data)=>{
                if(error) {res.sendStatus(400)}
            })

            let testEmail = `SELECT * FROM users WHERE email = "${email}"`
            db.connection.query(testEmail, (err,data)=>{
                if(data.length<1) next()
                else res.send({"status":400,"message":'This email is registered with another account'})
            })
        }catch(err){
            res.send({"message":err.message}).status(400)
        }
    },

    createNewURL:async (req,res,next)=>{
        const userID = req.session.userID
        const originalURL = req.body.originalURL
        const shortURL = `http://localhost:8080/${req.body.shortURL}`
        try{
            if(!originalURL || !shortURL) throw new Error('Info is missing')

            let checkExists = `SELECT * FROM urls WHERE userID = ${userID} AND shortURL = "htpp://shortened/${shortURL}"`
            db.connection.query(checkExists, (err,data)=>{
                if(data.length>0) res.send({"status":400, "message":"This short name of url alredy exists"})
                else next()
            })
        }catch(err){
            res.send({"message":err.message}).status(400) 
        }
    },

    editURL:async (req,res,next)=>{
        const userID = req.session.userID
        const shortURL = `http://localhost:8080/${req.body.shortURL}`
        const field = req.body.field
        const newValue = req.body.newValue
        try{
            if(!shortURL || !field || !newValue) throw new Error('Info is missing')
            

            let query = `SELECT * FROM urls WHERE userID=${userID} AND shortURL = "${shortURL}"`
            db.connection.query(query,(err,data)=>{
                try{
                    if(err) throw new Error(err)
                    if(data.length!=1) throw new Error("URL doesn't exists")
                    next()
                }catch(e){
                    res.send(e.message).status(400)
                }
            })
        }catch(err){
            res.send(err.message).status(400)
        }
    },

    deleteURL:async (req,res,next)=>{
        const userID = req.session.userID
        const shortURL = `http://localhost:8080/${req.body.shortURL}`
        try{
            if(!shortURL) throw new Error('Info is missing') 
            
            let checkURL = `SELECT * FROM urls WHERE userID = ${userID} AND shortURL = "${shortURL}"`
            db.connection.query(checkURL, (err,data)=>{
                if(data.length<1) res.send({"message":"This url doesn't exist"}).status(400)
                else next()
            })
        }catch(err){
            res.send({"message":err.message}).status(400) 
        }
    }
}