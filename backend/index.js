require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});


app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, email], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User registered successfully' });
    });
});
// app.post('/register', (req, res) => {
//     const { username, password,email } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
//     db.query(query, [username, hashedPassword], (err, result) => {
//         if (err) throw err;
//         res.json({ message: 'User registered successfully' });
//     });
// });

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
                res.json({ token, username: user.username, email: user.email });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     const query = 'SELECT * FROM users WHERE username = ?';
//     db.query(query, [username], (err, results) => {
//         if (err) throw err;
//         if (results.length > 0) {
//             const user = results[0];
//             if (bcrypt.compareSync(password, user.password)) {
//                 const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
//                 res.json({ token });
//             } else {
//                 res.status(401).json({ error: 'Invalid credentials' });
//             }
//         } else {
//             res.status(401).json({ error: 'Invalid credentials' });
//         }
//     });
// });

app.get('/templates/:templateName', (req, res) => {
    const templateName = req.params.templateName;
    const templatePath = path.join(__dirname, 'templates', templateName);

    fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading template:', err);
            return res.status(500).json({ error: 'Template not found' });
        }
        res.json({ content: data });
    });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Route to send email

app.post('/send-email', [verifyToken, upload.single('attachment')], async (req, res) => {
    const { from, to, cc, subject, text } = req.body;
    const attachment = req.file;

    console.log('Received request to send email:', { from, to, cc, subject, text, attachment });

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: from, // Use the sender's email from the request
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: from, // Use the sender's email from the request
        to: to,
        cc: cc,
        subject: subject,
        html: text,
        attachments: attachment ? [{ path: attachment.path }] : []
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: error.toString() });
        }
        console.log('Email sent:', info.response);
        res.json({ message: 'Email sent: ' + info.response });
    });
});

// app.post('/send-email', [verifyToken, upload.single('attachment')], async (req, res) => {
//     const { to, cc, subject, text, isMultiple } = req.body;
//     let recipients = to;

//     if (isMultiple) {
//         recipients = to.split(',').map(email => email.trim());
//     }

//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     let mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: recipients,
//         cc: cc,
//         subject: subject,
//         html: text,
//         attachments: req.file ? [{ path: req.file.path }] : []
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//             return res.status(500).json({ error: error.toString() });
//         }
//         console.log('Email sent:', info.response);
//         res.json({ message: 'Email sent: ' + info.response });
//     });
// });

app.get('/user/email', verifyToken, (req, res) => {
    const username = req.body;
    const query = 'select data.email from data join users on data.username = users.username;';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching user email:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            if (results.length > 0) {
                res.json({ email: results[0].email });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
