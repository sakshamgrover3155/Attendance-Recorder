const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Redirect home page to /posts
app.get('/', (req, res) => {
  res.redirect('/posts');
});

// GET /posts → Display all blog posts
app.get('/posts', (req, res) => {
  fs.readFile(path.join(__dirname, 'post.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading posts:', err);
      return res.status(500).send('Error loading posts.');
    }
    const posts = JSON.parse(data);
    res.render('home', { posts });
  });
});

// GET /post → Display a single post by ID
app.get('/post', (req, res) => {
  const postId = parseInt(req.query.id);
  fs.readFile(path.join(__dirname, 'post.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading posts:', err);
      return res.status(500).send('Error loading post.');
    }
    const posts = JSON.parse(data);
    const post = posts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('post', { post });
  });
});

// GET /addpost → Show form to add a new post
app.get('/addpost', (req, res) => {
  res.render('addpost');
});

// POST /add-post → Add a new post
app.post('/add-post', (req, res) => {
  const { title, content } = req.body;

  fs.readFile(path.join(__dirname, 'post.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading posts:', err);
      return res.status(500).send('Error loading posts.');
    }

    const posts = JSON.parse(data);
    const newPost = {
      id: posts.length ? posts[posts.length - 1].id + 1 : 1,
      title,
      content
    };

    posts.push(newPost);

    fs.writeFile(path.join(__dirname, 'post.json'), JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        console.error('Error saving post:', err);
        return res.status(500).send('Error saving post.');
      }
      res.redirect('/posts');
    });
  });
});

// DELETE /delete-post → Remove a post by ID
app.post('/delete-post', (req, res) => {
    const postId = parseInt(req.body.id);
  
    fs.readFile(path.join(__dirname, 'post.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading posts:', err);
        return res.status(500).send('Error loading posts.');
      }
  
      let posts = JSON.parse(data);
      const updatedPosts = posts.filter(post => post.id !== postId);
  
      fs.writeFile(path.join(__dirname, 'post.json'), JSON.stringify(updatedPosts, null, 2), (err) => {
        if (err) {
          console.error('Error deleting post:', err);
          return res.status(500).send('Error deleting post.');
        }
        res.redirect('/posts');
      });
    });
  });
  
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
