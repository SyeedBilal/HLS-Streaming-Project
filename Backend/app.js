const express=require('express');
const app =express();
const userRouter=require('./routes/googleAuth')
const sessionConfig=require('./config/sessionsConfig')
const connectDB = require('./config//databaseCongif');
const uploadRouter = require('./routes/videoUpload');
const path=require('path');
const cors=require('cors');
const downloadRouter =require('./routes/downloadVideo')



app.use(cors({
  origin: ['http://localhost:3000','http://localhost:5173'],
  credentials: true // Allow cookies to be sent with requests
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(sessionConfig);

app.use(userRouter);
app.use(uploadRouter);
app.use('/download',downloadRouter);


// In your main app
app.set(`view engine`,'ejs');
app.set('views','views');
app.use('/processed', express.static(path.join(__dirname, 'uploads', 'processed')));


const port =3000;

connectDB();

app.get('/',(req,res)=>{
  // res.send('Welcome to the Video Transcoding Service <a href="/auth/google">Login with Google</a>');
  res.render('googleAuth.ejs');
})



app.listen(port,()=>{
  console.log(`Server is running on port http://localhost:${port}`);
})