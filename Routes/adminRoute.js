import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from "multer";
import path from 'path';
import con from '../utils/db.js';




const router = express.Router()
router.post('/adminLogin', (req, res) => {
 const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';


  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      console.log("SQL error:", err);  // Log the real error
      return res.json({ loginStatus: false, Error: "Query error" });
    }
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong credentials" });
    }
  });
});


router.get('/category', (req,res)=> {
    const sql = "SELECT * FROM category"
    con.query(sql,(err,result)=>{
        if(err){
            console.log("db err",err)
            return res.json({Status:false , Error:"Query error"})
        }
        return res.json({Status:true, Result:result })
    })
})

router.get('/employee', (req,res)=> {
    const sql = "SELECT * FROM employee"
    con.query(sql,(err,result)=>{
        if(err){
            console.log("db err",err)
            return res.json({Status:false , Error:"Query error"})
        }
        return res.json({Status:true, Result:result })
    })
})


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


router.post('/add_category', (req, res) => {
  console.log("✅ /auth/add_category route hit");
  const sql = "INSERT INTO category (`name`) VALUES (?)";

  // Replace this with actual DB connection
  con.query(sql, [req.body.category], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    res.json({ Status: true, message: "Category added successfully!" });
  });
});


router.post('/add_employee',upload.single('image'), (req, res) => {
  const sql = `
    INSERT INTO employee 
    (name, email, password, address, salary, image, category_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Hashing Error" });

    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id
    ];

    con.query(sql, values, (err, result) => { // ✅ values, NOT [values]
      if (err) {
        console.error("SQL Error:", err);
        return res.json({ Status: false, Error: "Query Error" });
      }
      return res.json({ Status: true });
    });
  });
});


router.get('/employee/:id',(req,res)=>{
    const sql = "SELECT * FROM employee WHERE id = ?"
    con.query(sql, [req.params.id],(err,result)=>{
        if(err) return result.json({Status:false,Error:"Query Error"})
        if(result.length > 0){
            res.json({Status:true,Result:result[0]})
        }
        else{
            res.json({Status:false,Error:"Employee not found"})
        }
    })
})

router.put('/employee/:id', upload.single("image"),(req,res)=>{
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

export { router as adminRouter };

