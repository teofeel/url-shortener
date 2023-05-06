const db = require('../db')
var crypto = require('crypto')

module.exports={
    login:async (req,res)=>{
        const email = req.body.email

        let query = `SELECT * FROM users WHERE email="${email}"`
        db.connection.query(query, (err,data)=>{
            req.session.loggedin = true;
            req.session.userID = data[0].id;
            res.send({"message":`User loggedin`}).status(200) 
        })
    },
    
    register:async (req,res)=>{
        const {username,email,password} = req.body

        let salt = crypto.randomBytes(16).toString('hex')
        let hashedPassword = crypto.pbkdf2Sync(password,salt,1000,64,'sha512').toString('hex')
        
        let newUser = `INSERT INTO users (username,email,password,salt) VALUES ("${username}","${email}","${hashedPassword}","${salt}")`
        db.connection.query(newUser, (err,data)=>{
            if(err) res.send({"status":400, "message":"Could not register, try again"}).status(400) 
        })
        
        let getID = `SELECT * FROM users WHERE email="${email}"`
        db.connection.query(getID,(err, data)=>{
            if(err) {res.sendStatus(400)}
            else{
                req.session.loggedin = true;
                req.session.userID = data[0].id;
                res.send({"message":`New user has been created`}).status(200) 
            }
        })
    },

    createNewURL:async (req,res)=>{
        const userID = req.session.userID
        const originalURL = req.body.originalURL
        const shortURL = `http://localhost:8080/${req.body.shortURL}`
        const date = Date()

        try{
            if(!originalURL || !shortURL) throw new Error('Info is missing') 
            
            let createURLTable = `CREATE TABLE IF NOT EXISTS urls (
                id int(11) NOT NULL AUTO_INCREMENT,
                userID int(50) NOT NULL,
                originalURL varchar(1000) NOT NULL,
                shortURL varchar(255) NOT NULL,
                dateCreated varchar(255) NOT NULL,
                PRIMARY KEY (id)
            )`
            db.connection.query(createURLTable, (err,data)=>{
                if(err) res.send({"message":"Try again later"}).status(400) 
            })
        
            let newURL = `INSERT INTO urls (userID, originalURL, shortURL, dateCreated) VALUES ("${userID}","${originalURL}","${shortURL}","${date}")`
            db.connection.query(newURL, (err,data)=>{
                if(err) res.send({"message":err}).status(400) 
                else res.send({"message":"New shortened URL created"}).status(200) 
            })
        }catch(err){
            res.send({"message":err.message}).status(400) 
        }
    },

    editURL:async (req,res)=>{
        const userID = req.session.userID
        const shortURL = `http://localhost:8080/${req.body.shortURL}`
        const field = req.body.field
        
        if(field == 'shortURL'){
            let newValue = `http://localhost:8080/${req.body.newValue}`
            let query = `UPDATE urls SET shortURL="${newValue}" WHERE userID=${userID} AND shortURL = "${shortURL}"`
            db.connection.query(query, (err,data)=>{
                if(err) res.send('Try again').status(400)
                else res.send('URL field updated').status(200)
            })
        }else{
            let query = `UPDATE urls SET originalURL="${req.body.newValue}" WHERE userID=${userID} AND shortURL = "${shortURL}"`
            db.connection.query(query, (err,data)=>{
                if(err) res.send('Try again').status(400)
                else res.send('URL field updated').status(200)
            })
        }
    },

    deleteURL:async (req,res)=>{
        const userID = req.session.userID
        const shortURL = `http://localhost:8080/${req.body.shortURL}`

        let deleteRow = `DELETE FROM urls WHERE userID = ${userID} AND shortURL = "${shortURL}"`
        db.connection.query(deleteRow, (err,data)=>{
            if(err) res.send({"status":400, "message":"Could not delete, try again"})
            else res.send({"message":"URL deleted"}).status(200) 
        })
        
    }
}