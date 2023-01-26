//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser : true});

const articleSchema = {
  title : String,
  content : String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
.post(function(req, res){
  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("All articles were deleted.");
    }else{
      res.send(err);
    }
  });
});

app.route("/articles/:title")
.get(function(req, res){
  Article.findOne({title : req.params.title}, function(err, foundArticle){
    if(!err){
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("No such article with the given title exists !")
      }
    }else{
      res.send(err);
    }
  })
})
.put(function(req, res){
  Article.update(
    {title: req.params.title},
    {title: req.body.title, content: req.body.content},
    function(err, response){
      if(!err){
        if(response.modifiedCount){
          res.send("Successfully updated article.");
        }else{
          if(response.matchedCount){
            res.send("Send both title and content with the PUT request.")
          }else{
            res.send("No such article with the given title exists !");
          }
        }
      }else{
        res.send(err);
      }
    }
  );
})
.patch(function(req, res){
  Article.update(
    {title: req.params.title},
    {$set : req.body},
    function(err, response){
      if(!err){
        if(response.matchedCount){
          res.send("Successfully updated article.");
        }else{
          res.send("No such article with the given title exists !");
        }
      }else{
        res.send(err);
      }
    }
  );
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.title},
    function(err, response){
      if(!err){
        if(response.deletedCount){
          res.send("Successfully deleted article.");
        }else{
          res.send("No such article with the given title exists !");
        }
      }else{
        res.send(err);
      }
    }
  )
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
