const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    ejs = require("ejs"),
    mongoose = require("mongoose"),
    sanitizer = require("express-sanitizer"),
    methodOverride = require("method-override");

mongoose.connect("mongodb+srv://admin-suraj:itsgabru@clustermine-vrxpf.mongodb.net/blogpost", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(sanitizer());
mongoose.set('useFindAndModify', false);

app.listen(3000 , function () {
    console.log("server started on port");
})

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
})

var blog = mongoose.model("blog", blogSchema);

app.get("/", function (req, res) {
    res.redirect("/blogs");
})

app.get("/blogs", function (req, res) {
    blog.find({}, function (err, foundblog) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blog: foundblog });
        }
    })
})

app.get("/blogs/new", function (req, res) {
    res.render("new");
})

app.post("/blogs", function (req, res) {
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);

    blog.create(req.body.blog, function (err, newb) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/:id", function (req, res) {
    blog.findById(req.params.id, function (err, found) {
        if (err) {
            res.render("/blogs")
        } else {
            res.render("show", { blog: found });
        }
    })
})

app.get("/blogs/:id/edit", function (req, res) {
    blog.findById(req.params.id, function (err, found) {
        if (err) {
            res.render("/blogs")
        } else {
            res.render("edit", { blog: found });
        }
    })
})

app.put("/blogs/:id", function (req, res) {
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, found) {
        if (err) {
            res.render("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

app.delete("/blogs/:id", function (req, res) {
    blog.findByIdAndRemove(req.params.id, function (err, found) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})