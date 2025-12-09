import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './server/config/db.js';
import { clerkMiddleware, Client } from '@clerk/express';
import { inngest } from './server/inngest/index.js';
import {serve} from 'inngest/express'
import { Inngest,functions } from './inngest/index.js';

const app = express();
const port = 3000 ;

await connectDB()
// Middleware

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

// Routes
app.get('/' , (req , res)=>res.send("Server is Live"));
app.use('/api/inngest' , serve({client: Inngest , functions}))

app.listen(port , ()=>console.log(`Server runnning at http://localhost:${port}`))
