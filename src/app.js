import express from 'express';
import cors from 'cors';   
import cookieParser from 'cookie-parser';

const app = express();

//Basic middleware
app.use(cors({
  origin: ['https://alumnihub-frontend.vercel.app','http://localhost:5173'], 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Cookie', 'X-Requested-With'],
}));

app.use(express.json({limit:"16kb"}));  //limit incoming data
app.use(express.urlencoded({extended:true, limit:"16kb"}));  // used for parsing incoming form data 
app.use(express.static('public'))  //sets files in public as static
app.use(cookieParser()) //used for cookie reading


//Routes
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import eventRouter from './routes/events.routes.js';
import loginRouter from './routes/login.routes.js';
import donationRouter from './routes/donation.routes.js';
import jobRouter from './routes/jobs.routes.js';

app.use('/api/',loginRouter)
app.use('/api/admin',adminRouter)
app.use('/api/users',userRouter)
app.use('/api/events',eventRouter)
app.use('/api/jobs', jobRouter);
app.use('/api/donations',donationRouter)

export default app;