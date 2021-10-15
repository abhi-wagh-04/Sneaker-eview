
require('dotenv').config();
var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    bodyParser            = require("body-parser"),
    Campground            = require("./models/campground"),
    seedDB                = require("./seeds"),
    methodOverride        = require("method-override"),
    flash                 = require("connect-flash"),
    Comment               = require("./models/comment"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user");

var commentRoutes         = require("./routes/comments"),
    campgroundRoutes      = require("./routes/campgrounds"),
    indexRoutes           = require("./routes/index");



    // mongodb+srv://new-user-21:<password>@cluster0.yzlpg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const dburl=process.env.DB_URL;
// "mongodb://localhost/yelp_camp"
// LutNJ9PVdDGCXi57
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(methodOverride("_method"));
mongoose.set('useUnifiedTopology', true);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);

mongoose.connect(dburl,{
    useNewUrlParser:true
    
});

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('database connection');
}).on('error', (err)=>{
    console.log('Error',err);
})
// seedDB();  no need of seeding the database now

// connect flash must always be placed before passport config 
// and in between nothing must be placed

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Rusty is the best dog",
    resave: false,
    saveUninitialized: false 
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// below function is added to all the templates
app.use(function (req, res, next) {  
    res.locals.currentUser = req.user ;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success"); 
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


const PORT = process.env.PORT;

app.listen(PORT , function(){
    console.log("Server started!!!"); 
});