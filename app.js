const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');

const port = 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const article = mongoose.model('article', articleSchema);


app.route('/articles')

.get((req, res) => {

  try{
    article.find({}).then(articles=>{
      console.log(articles);
      res.send(articles)
    })
  }
catch(err){
    res.send(err)
}

})


.post((req,res)=>{
 const title = req.body.title;
 const content = req.body.content;

try{
  article.findOne({title: title}).then(foundArticle=>{
    if(foundArticle){
      res.send('Article with same name already exists')
    }
  else{
    const newArticle = new article({title: title, content: content});
    newArticle.save();
    res.redirect('/articles');
  }})
}
catch(err){
 res.send(err);
}
})


.delete((req,res)=>{

try{
  article.deleteMany({}).then(()=>{
  res.redirect('/articles');
}) 
}
catch(err){
  res.send(err)
}
});


app.route('/articles/:articleTitle')

.get((req,res)=>{
 const reqTitle = req.params.articleTitle;
 console.log(reqTitle)

try{
  article.findOne({title: reqTitle}).then(article=>{
    if(article){
      res.send(article);
    }
    else{
      res.send('Article does not exist');
    }
  })
}
catch(err){
  res.send(err)
}

})

.put((req,res)=>{

try{
  const reqTitle = req.params.articleTitle;

  article.findOne({title: reqTitle}).then(article=>{
      const updatedArticle = article.overwrite({title: req.body.title, content: req.body.content})
        res.send(updatedArticle);
      
      })
    }
      
    
catch(err){
  res.send(err)
}

})

.patch((req,res)=>{
  const reqTitle= req.params.articleTitle;

try{
  article.updateOne({title: reqTitle}, {$set: req.body}).then(
    updatedArticle=>{
      res.send(updatedArticle);
    });
}
catch(err){
  res.send(err)
}
 
})

.delete((req,res)=>{

const reqTitle = req.params.articleTitle;
article.findOne({title: reqTitle}).then(article=>{
  if(article){
    article.deleteOne({title: reqTitle}).then(()=>{res.redirect('/articles')});
  }
  else{
    res.send('Article not found');
  }
})
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

