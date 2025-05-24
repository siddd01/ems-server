import express from 'express';
import jwt from 'jsonwebtoken';
import con from '../utils/db.js';

const router = express.Router()
router.post('/adminLogin', (req, res) => {
 const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';




//   con.query('SHOW TABLES', (err, result) => {
//   if (err) {
//     console.error("Test query error:", err);
//   } else {
//     console.log("Tables:", result);
//   }
// });


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
// TEMP: Test route
router.get('/test', (req, res) => {
  res.send("✅ Test route works!");
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



export { router as adminRouter };

