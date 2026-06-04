import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import config from "./config";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  //   res.send('Mission 2 - Be a Node Expert. 7,8,9 Practice !')
  res.status(200).json({
    message: "Express Server",
    author: " Next Level",
  });
});

app.use('/api/users',userRoute);
app.use('/api/profile',profileRoute);


export  default app;
