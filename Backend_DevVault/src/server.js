import {app}from './app.js'
import dotenv from 'dotenv'     
import {connecct_DB}  from './DB/index.js'
dotenv.config();
const port = process.env.PORT || 3000;
const server = async()=>{
    try {
        await connecct_DB();
        app.get("/",()=>{
            console.log("Hello from the server");
        })
        app.listen(port,"0.0.0.0",()=>{
            console.log(`Server is running on port ${port}`);
            console.log(`http://localhost:${port}`);
        })
    } catch (error) {
        console.error("Error starting the server:", error);
    }
   
}
server();