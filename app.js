var bodyParser = require("body-parser"), 
	methodOverride = require("method-override"),
	expressSanitizer= require("express-sanitizer"), 
	express    = require ("express"),
	mongoose   = require("mongoose"), 
	app 	   = express(); 

// app config
mongoose.connect("mongodb://localhost/blog_app"); 
app.set("view engine", "ejs"); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// mongoose/model config
var blogSchema= new mongoose.Schema({
	title: String, 
	image: String, 
	body : String, 
	created: {type:Date, default: Date.now}
})
// compile into our model
var blog= mongoose.model("blog", blogSchema); 

// Restful Routs
app.get("/", function(req, res){
	res.redirect("/blogs"); 
})

app.get("/blogs", function(req, res){
	blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR"); 
		}else{
			res.render("index", {blogs:blogs}); 
		}
	})
})

app.get("/blogs/new", function(req, res){
	res.render("new");
})
app.post("/blogs", function(req, res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
	blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new"); 
		}else{
			res.redirect("/blogs");
		}
	})
})

app.get("/blogs/:id", function(req, res){
	blog.findById(req.params.id, function(err, foundblog){
		if(err){
			res.redirect("/blogs"); 
		}else{
			res.render("show", {blog: foundblog})
		}
	})
})

app.get("/blogs/:id/edit", function(req, res){
	blog.findById(req.params.id, function(err, foundblog){
		if(err){
			res.redirect("/blogs"); 
		}else{
			res.render("edit", {blog: foundblog})
		}
	})
})

app.put("/blogs/:id", function(req, res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id, req.body.blog,  function(err, updatedblog){
		if(err){
			res.redirect("/blogs"); 
		}else{
			res.redirect("/blogs/"+ req.params.id); 
		}
	})
})
app.delete("/blogs/:id", function(req, res){
	blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs"); 
		}else{
			res.redirect("/blogs"); 
		}
	})
})



app.listen(8000, function(){
	console.log("Listening on port 8000"); 
})