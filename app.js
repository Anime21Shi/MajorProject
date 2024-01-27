if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*3600
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION",err);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Demo User
// app.get("/demouser",async(req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}
main().then(()=> console.log("database connected"))
.catch(err => console.log(err));

app.listen(8080,() => {
    console.log("app is listening at port 8080");
});

// app.get("/",(req,res) => {
//     res.send("Hi, I am root");
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);


// app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My Villa",
//         description: "By the beach",
//         price: 2000,
//         location: "Calangute, Goa",
//         country: "India"
//     })

//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("successful testing");
// });

// error handling middleware
app.use("*",(req,res,next) => {
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
})

