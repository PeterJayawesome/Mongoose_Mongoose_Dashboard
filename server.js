// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var session = require('express-session');
app.use(session({secret:"mongoosesdashboard"}))
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Require Mongoose
var mongoose = require('mongoose');
// Connect Mongoose to MongoDB
mongoose.connect('mongodb://localhost/mongoose_dashboard');
// Create your Mongoose Schemas
var UserSchema = new mongoose.Schema({
 name: {type:String},
 weight: {type:Number}
},{timestamps:true});
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

// Routes
// Root Request
app.get('/', function(req, res) {
    if(req.session.err){
        console.log(req.session.err);
    }
    User.find({},function(err,users){
        // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
        res.render('index',{mongoose:users});
    })
})
// Add User Request 
app.post('/mongoose', function(req, res) {
    console.log("POST DATA", req.body);
    var user = new User(req.body);
    // This is where we would add the user from req.body to the database.
    user.save(function(err){
    	if(err){
    		console.log(err);
        }
		res.redirect('/');
    })
})

app.get('/mongooses/new',function(req,res){
    res.render('new');
})

app.get('/mongooses/edit/:id',function(req,res){
    User.findOne({_id:req.params.id},function(err,user){
        if(err){
            req.session.err = err;
            res.redirect('/');
        }
        else{
            res.render("edit",{mongoose:user});
        }
    })
})

app.get('/mongooses/:id',function(req,res){
    User.findOne({_id:req.params.id},function(err,user){
        if(err){
            req.session.err = err;
            res.redirect('/');
        }
        else{
            console.log(req.params.id);
            res.render("show",{user: user});
        }
    })
	
})

app.post("/mongooses/destroy/:id",function(req,res){
    User.remove({_id:req.params.id},function(err){
        if(err){
            req.session.err = err;
        }
        res.render('/');
    })
})

app.post('/mongooses/:id',function(req,res){
    User.update({_id:req.params.id},req.body,function(err){
        if(err){
            req.session.err = err;
            res.redirect("/mongooses/edit/"+req.params.id) 
        }
        else{
            console.log("Update successfully!")
            res.redirect('/')
        }
    })
})


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
