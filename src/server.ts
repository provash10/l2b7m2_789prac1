import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_dK1LytpgYv8z@ep-bold-pond-aqk2siik-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
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
            `);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

initDB();

// app.get('/', (req : Request, res : Response) => {
//   res.send('Mission 2 - Be a Node Expert. 7,8,9 Practice !')
// })
//default
app.get("/", (req: Request, res: Response) => {
  //   res.send('Mission 2 - Be a Node Expert. 7,8,9 Practice !')
  res.status(200).json({
    message: "Express Server",
    author: " Next Level",
  });
});

//Users
app.post("/api/users", async (req: Request, res: Response) => {
  // console.log(req.body);
  // const body = req.body; //body destructure
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
        INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4)
        RETURNING *
        `,
      [name, email, password, age]
    );
    // console.log(result);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
            SELECT * FROM users
            `);
    res.status(200).json({
      success: true,
      message: "Users Retrived Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const result = await pool.query(
      `
            SELECT * FROM users WHERE id=$1
            `,
      [id]
    );
    // console.log(result)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "Users Retrived Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, age, is_active } = req.body;

  // console.log("Id : ", id);
  // console.log({name,email,password,age,is_active})

  try {
    const result = await pool.query(
      `
        UPDATE users SET name=$1, password=$2,age=$3,is_active=$4
        WHERE id=$5 RETURNING *
        `,
      [name, password, age, is_active, id]
    );
    // console.log(result)
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users Not Found",
        data: {},
      });
    }

    
    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
