import express, { type Application, type Request, type Response } from "express";
import {Pool} from "pg"
const app : Application = express()
const port = 5000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}))

const pool = new Pool({
    connectionString:"postgresql://neondb_owner:npg_SYnBF1sr9ibM@ep-nameless-sound-ap9q634f-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

// app.get('/', (req : Request, res : Response) => {
//   res.send('Mission 2 - Be a Node Expert. 7,8,9 Practice !')
// })

app.get('/', (req : Request, res : Response) => {
//   res.send('Mission 2 - Be a Node Expert. 7,8,9 Practice !')
res.status(200).json({
    message : "Express Server",
    "author" : " Next Level"
})
})

app.post('/',async(req: Request, res: Response)=>{
    // console.log(req.body);
    // const body = req.body; //body destructure
    const {name, email,password} = req.body;
    res.status(201).json({
        message : "Created",
        data: {
            name, email
        },
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})