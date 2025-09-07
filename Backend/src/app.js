import express from 'express';
import cors from 'cors';   
import cookieParser from 'cookie-parser';

const app = express();

//Basic middleware
app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
}))
app.use(express.json({limit:"16kb"}));  //limit incoming data
app.use(express.urlencoded({extended:true, limit:"16kb"}));  // used for parsing incoming form data 
app.use(express.static('public'))  //sets files in public as static
app.use(cookieParser()) //used for cookie reading


//Routes
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';

app.use('/admin',adminRouter)
app.use('/',userRouter)

export default app;