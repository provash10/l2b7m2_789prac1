import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import config from "./config";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import fs from 'fs';


const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

//express middleware
app.use((req, res, next) => {
  console.log('Method - URL - Time:', req.method, req.url, Date.now());
  const log = (`\nMethod -> ${req.method} - Time -> ${Date.now()} - URL -> ${req.url}\n`);
  fs.appendFile('logger.txt', log, (err)=>{
    console.log(err);
  })
  next();
});

app.get("/", (req: Request, res: Response) => {
  //   res.send('Mission 2 - Be a Node Expert. 7,8,9 Practice !')
  res.status(200).json({
    message: "Express Server",
    author: " Next Level",
  });
});

app.use('/api/users',userRoute);
app.use('/api/profile',profileRoute);
app.use('/api/auth',authRouter);


export  default app;
