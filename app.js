    require("dotenv").config();


console.log(process.env.SECREATE);


const express = require("express");
const app = express() ;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path") ;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate") ;
const wrapAsync = require("./utils/wrapAsync.js") ;
const expressError = require("./utils/expressError.js") ;
const {listingSchema , reviewSchema} = require("./schema.js") ;
const review = require("./models/review.js");
const listingRouter = require("./routes/listing.js") ;
const reviewRouter = require("./routes/review.js") ;
const userRouter = require("./routes/user.js");                              
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport") ;
const LocalStrategy = require("passport-local") ;
const User = require("./models/user.js") ;

const MONGO_URL = process.env.ATLASDB_URL;

main()
.then(() =>{
    console.log("Connected to DB ");
})
.catch((err) => {
    console.log(err) ;
})

async function main(){
    await mongoose.connect(MONGO_URL) ;
}


app.set("view engine" , "ejs" ) ;
app.set("views" , path.join(__dirname , "views")) ;
app.use(express.urlencoded({extended:true})) ;
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate) ;
app.use(express.static(path.join(__dirname,"public"))) ;


const sessionOptions = {
    secret : "mysupersecretcode" ,
    resave : false ,
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 , // THE COOKIE WILL EXPIRE AFTER GIVEN TIME (7 DAYS)
        maxAge : 7 * 24 * 60 * 60 * 1000 ,
        httpOnly : true ,
    }
} ;


// app.get("/" , (req,res) => {

//     res.send("Hii I am root ") ;
// })



app.use(session(sessionOptions)) ;
app.use(flash()) ; // to use flash the message after session is configured


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()) ;








app.use((req,res , next) => {
    res.locals.success = req.flash("success") ;
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    next() ;
});


app.get("/demouser", async (req,res) =>{

    let fakeUser = new User({
        email : "student@gmail.com" ,
        username : "Shyam" ,

    });

    let registeredUser = await User.register(fakeUser ,"Helloworld") ;
    res.send(registeredUser) ;
    
})



app.use("/listings" , listingRouter) ;
app.use("/listings/:id/reviews" , reviewRouter) ;
app.use("/" , userRouter) ;








//    app.get("/testListing" , async (req, res) => {
//     let sampleListing = new Listing({

//         title : "My new Villa" ,
//         discription : "By the beach" ,
//         price : 5000 ,
//         location : "Mumbai" ,
//         country : "India" ,
//      }) ;

//      await sampleListing.save() ;
//      console.log("Sample is saved successfully") ;
//      res.send("Successful Testing") ;



//    })




app.use("/" , (req , res , next) =>{
    // next(new expressError(404 , "Page not found")) ;
    res.send("Page not found") ;
})


// app.use((err, req, res , next) =>{
     
//     console.dir(err)

// //  res.status(404).render("error.ejs" , {err});
//    // res.send("Something went wrong") ;
// })


app.listen(8080 ,() =>{

    console.log("The server is listening at the port 8080");
})
