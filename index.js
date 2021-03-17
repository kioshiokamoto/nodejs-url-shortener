import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import shortUrl from './routes/shortUrl.js'
//Connect Db
connectDB();

const app = express();
//Middleware
app.use(express.json());

app.use('/app', shortUrl);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Servidor funcionando en http://localhost:${PORT}`));

process.on("unhandledRejection", (err,promise)=>{
    console.log(`Logged Error: ${err}`);
    server.close(()=>process.exit(1))
});
