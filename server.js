const express = require('express');
const connectionDB = require('./config/db')

const app = express();
//DB Connection
connectionDB();

//Init a MiddleWare(Body Parser)
app.use(express.json({extended:false}))


app.get('/', (req, res) => res.send('API Running'))

//Defining Routes

app.use('/api/users', require('./Routes/API/Users'))
app.use('/api/auth', require('./Routes/API/Auth'))
app.use('/api/posts', require('./Routes/API/Posts'))
app.use('/api/profile', require('./Routes/API/Profile'))



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`))