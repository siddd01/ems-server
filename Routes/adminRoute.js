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


export { router as adminRouter };

