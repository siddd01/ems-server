import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from "multer";
import path from 'path';
import con from '../utils/db.js';
const router=express.Router()

router.post('/employee_login', (req, res) => {
 const sql = 'SELECT * FROM employee WHERE email = ? ';


  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      console.log("SQL error:", err);  // Log the real error
      return res.json({ loginStatus: false, Error: "Query error" });
    }
    if (result.length > 0) {
    bcrypt.compare(req.body.password , result[0].password,(err,response)=>{
         if (err) {
      console.log("SQL error:", err);  // Log the real error
      return res.json({ loginStatus: false, Error: "Wrong password " });
         }
         if(response){
            const email = result[0].email;
      const token = jwt.sign(
        { role: "employee", email: email },
        "employee_secret_key",
        { expiresIn: "1d" }
      ); res.cookie('token', token);
      return res.json({ loginStatus: true ,id:result[0].id });
         }
    })
      
     
    } else {
      return res.json({ loginStatus: false, Error: "Wrong credentials" });
    }
  });
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/detail/:id' ,(req,res)=>{
    const id=req.params.id
    const sql = "SELECT * FROM employee where id=? "
    con.query(sql , [id] , (err,result)=>{
        if(err) return res.json({Status:false , Error:"Query Error"})
        return res.json({Status:true,Result:result})
    })
})

router.get('/logout',(req,res)=>{
    res.clearCookie("token")
    return res.json({Status:true})
})


router.put('/selected_employee/:id', upload.single("image"),(req,res)=>{
    const {name,email,password,address,salary,category_id}=req.body
    const {id}=req.params
      let sql = `
    UPDATE employee SET 
      name = ?, 
      email = ?, 
      password = ?, 
      address = ?, 
      salary = ?, 
      category_id = ?
  `;
  const values = [name, email, password, address, salary, category_id];
  if(req.file){
    sql += `, image = ?`
    values.push(req.file.filename)
  }
  sql+= `WHERE id =? `
  values.push(id)

  con.query(sql, values , (err,result)=>{
    if(err) return res.json({Status:false,Error:"Query Error"})
    return res.json({Status:true,Result:"Employee updated Successfully"})
  })
    
})

export { router as EmployeeRouter };

