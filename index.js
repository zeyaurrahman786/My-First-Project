import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI=process.env.MONGODB_URI

// Connect to MongoDB (Make sure MongoDB is running)
const dbConnection=async(DB_URI)=>{
    try {
        const result=await mongoose.connect(DB_URI);
console.log(`db connected on ${result.connection.port}`)
    } catch (error) {
        console.log(`db connection failed ${error.message}`)
    }

}


// middleware----
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

// view engine set---
app.set('view engine','ejs')

// Define user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Create User model
const User = mongoose.model('User', userSchema);



// Serve the HTML file
app.get('/', (req, res) => {
    res.render('index');
});

// Handle registration form submission
app.post('/register', async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    const savedata=await newUser.save()
    console.log(savedata)
    res.send({msg:'resgiter successful'})

    
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // dbConnection(DB_URI)
});
