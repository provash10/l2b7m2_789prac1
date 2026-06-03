import express, { type Application, type Request, type Response } from "express";
import {Pool} from "pg"
const app : Application = express()
const port = 5000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}))

const pool = new Pool({
    connectionString:"postgresql://neondb_owner:npg_dK1LytpgYv8z@ep-bold-pond-aqk2siik-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB=async()=>{
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)
            console.log("Database Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}

initDB();

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
    const {name, email,password,age} = req.body;

   try {
     const result = await pool.query(`
        INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4)
        RETURNING *
        `,[name,email,password,age]
    );
        // console.log(result);

    res.status(201).json({
        message : "User Created Successfully",
        data: result.rows[0],
    });
   } catch (error:any) {
    res.status(500).json({
        message : error.message,
        error: error,
    });
   }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})