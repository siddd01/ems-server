import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { adminRouter } from './Routes/adminRoute.js';
import { EmployeeRouter } from './Routes/EmployeeRoute.js';



const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT' , 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // ✅ REQUIRED for res.cookie to work properly

app.use('/auth', adminRouter);
app.use('/employee',EmployeeRouter );
app.use('/Images', express.static('public/images'));

app.listen(3000, () => {
  console.log("server is running");
});
