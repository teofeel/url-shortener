const db = require('../db')
const openurl = require('openurl')

module.exports={
    viewURLs:async (req,res)=>{
        const userID = req.session.userID
    
        let viewURLs = `SELECT * FROM urls WHERE userID = ${userID}`
        db.connection.query(viewURLs, (err, data)=>{
            try{
                if(err) throw new Error("Please try again later")
    
                var userURLs = new Array()
                for(i in data){
                    userURLs.push({
                        originalURL : data[i].originalURL,
                        shortURL : data[i].shortURL
                    })
                }
                res.send({"urls":userURLs}).status(200) 
            }catch(e){
                res.send({"message":e.message}).status(400) 
            }
        })
    },
    redirect:async (req,res)=>{
        const shortURL = `http://localhost:8080/${req.params.shortURL}`
        const userID = req.session.userID

        let query = `SELECT * FROM urls WHERE userID = ${userID} AND shortURL="${shortURL}"`
        db.connection.query(query, async (err,data)=>{
            try{
                if(err) throw new Error(err.message)
                if(data.length!=1) throw new Error('This url doesnt exist')
                await openurl.open(data[0].originalURL)
                res.sendStatus(200)
                //res.redirect(data[0].originalURL)
            }catch(e){
                res.send(e.message).status(400)
            }
        })
    },
    logout:async (req,res)=>{
        req.session.destroy()
        res.sendStatus(200)
    }
}