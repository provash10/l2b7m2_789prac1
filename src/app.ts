import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import config from "./config";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
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

app.use('/api/users',userRoute)



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
        UPDATE users 
        SET 
        name=COALESCE($1,name), 
        password=COALESCE($2,password),
        age=COALESCE ($3,age),
        is_active=COALESCE($4,is_active)
        WHERE id=$5 RETURNING *
        `,
      [name, password, age, is_active, id]
    );
    // console.log(result)
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
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

app.delete('/api/users/:id',async(req:Request, res: Response)=>{
    const {id} = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1;
            `,
        [id],
    );
    // console.log(result)
    if(result.rowCount===0){
        res.status(404).json({
        success: false,
        message: "User Not Found",
        
      });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      data: {},
    });
    } catch (error:any) {
        res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
    }
})

export  default app;
