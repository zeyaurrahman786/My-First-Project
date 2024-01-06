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
    try {
        const{username,email,password}=req.body;
        if(username,email,password){
            const existEmail=await User.findOne({email})
            if(existEmail) return res.render('index',{msg:'email already taken',status:false})
            if (
                password.length >= 8 &&
                /[A-Z]/.test(password) &&
                /[0-9]/.test(password) &&
                /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)
              ) {
                const newUser = new User({
                    username,
                    email,
                    password
                });
                const savedata=await newUser.save()
                console.log(savedata)
                res.render('index',{msg:'registration successfull', status:true})
                
              }else{
                res.render('index',{msg:'password invalid',status:false})
              }
        }else{
            res.render('index',{msg:'all fileds are required',status:false})
        }
    } catch (error) {
        console.log(`registration failed : ${error.message}`)
        res.render('index',{msg:"something went wrong please try again later"})
    }
  

    
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    dbConnection(DB_URI)
});
