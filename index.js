const express = require('express');

//importing the routers
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

const app = express();

const PORT = 5000

app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).json({
        message : "This is a Home page !"
    })
})
app.use('/users',usersRouter);
app.use('/books',booksRouter);



// app.all('*',(req,res)=>{
//     res.status(500).json({
//         message: "Not Built Yet"
//     })
// })

app.listen(PORT,()=>{
    console.log(`Server is running http://localhost:${PORT}`);
    
})