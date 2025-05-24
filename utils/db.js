import mysql from 'mysql'



const con =mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"ems"
})

con.connect(function(err){
    if(err){
        console.log(err)
    }
    else{
        console.log("connected")
    }
})

export default con