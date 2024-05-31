
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const app = express();
app.use(express.json());
const cors=require('cors')
app.use(cors({
    origin:"http://localhost:3000"
}))


const JWT_SECRET = 'your_jwt_secret_key';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'admin', 
  port:"3308"
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

   
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

     
      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }

       
        const token = jwt.sign({ username, email }, JWT_SECRET);

        res.status(200).json({ message: 'User registered successfully', token });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
  }
};


app.get('/posts', verifyToken, (req, res) => {
  
  res.status(200).json({ message: 'Posts fetched successfully' });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
