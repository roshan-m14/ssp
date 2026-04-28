require('dotenv').config();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const express = require('express');
const db = require('./database');
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false    
}));
app.post('/submit', canAddDelete, (req, res) => {
const submittedName = req.body.studentName;
const submittedEmail = req.body.studentEmail;
const submittedPhone = req.body.studentPhone;
const submittedAddress = req.body.studentAddress;
db.run('INSERT INTO students (name, email, phone_number, address) VALUES (?, ?, ?, ?)', [submittedName, submittedEmail, submittedPhone, submittedAddress], (err) => {
if (err) {
return console.error(err.message);
}
console.log(`[SYSTEM] '${req.session.username}' registered a new student: ${submittedName}`);
res.redirect('/dashboard');
});
});
app.post('/delete/:id', canAddDelete, (req, res) => {
const studentId = req.params.id;
db.run('DELETE FROM students WHERE id = ?', [studentId], (err) => {
if (err) {
return console.error(err.message);
}
console.log(`[SYSTEM] '${req.session.username}' deleted student ID: ${studentId}`);
res.redirect('/dashboard');
});
});
app.get('/edit/:id', canEdit, (req, res) => {
const studentId = req.params.id;
db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, row) => {
if (err) return console.error(err.message);
// DEFENSIVE CHECK: Does this student actually exist in the database?
if (!row) {
return res.redirect('/dashboard');
}
res.render('edit', { student: row });
});
});
app.post('/update/:id', canEdit, (req, res) => {
const studentId = req.params.id;
const updatedName = req.body.studentName;
const updatedEmail = req.body.studentEmail;
const updatedPhone = req.body.studentPhone;
const updatedAddress = req.body.studentAddress;
db.run('UPDATE students SET name = ?, email = ?, phone_number = ?, address = ? WHERE id = ?', [updatedName, updatedEmail, updatedPhone, updatedAddress, studentId], (err) => {
if (err) {
return console.error(err.message);
}
console.log(`[SYSTEM] '${req.session.username}' updated the record for student ID: ${studentId}`);
res.redirect('/dashboard');
});
});
app.listen(PORT, () => {
console.log(`Server is successfully running on port ${PORT}`);
});

// Gateway Route (With Reverse Bouncer)
app.get('/', (req, res) => {
if (req.session.loggedIn) {
return res.redirect('/dashboard'); // Skip login if already logged in!
}
res.render('index');
});
// Process Login
app.post('/login', (req, res) => {
const { username, password } = req.body;
db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
if (err) return console.error(err.message);
if (user && bcrypt.compareSync(password, user.password)) {
req.session.loggedIn = true;
req.session.username = user.username;
req.session.role = user.role; // Store the RBAC role
res.redirect('/dashboard');
} else {
res.render('index', { error: 'Invalid username or password!' });
}
});
});
// Logout Route
app.get('/logout', (req, res) => {
req.session.destroy();
res.redirect('/');
});

// Level 1: Must be logged in (Allows Admin, Editor, and Viewer)
function requireAuth(req, res, next) {
if (req.session.loggedIn) next();
else res.redirect('/');
}
// Level 2: Edit Permission (Allows Admin and Editor)
function canEdit(req, res, next) {
if (req.session.loggedIn && (req.session.role === 'admin' || req.session.role === 'editor')) {
next();
} else {
res.redirect('/dashboard');
}
}
// Level 3: Add & Delete Permissions (Allows Admin ONLY)
function canAddDelete(req, res, next) {
if (req.session.loggedIn && req.session.role === 'admin') {
next();
} else {
res.redirect('/dashboard');
}
}
app.get('/dashboard', requireAuth, (req, res) => {
db.all('SELECT * FROM students', [], (err, rows) => {
if (err) return console.error(err.message);
res.render('dashboard', {
students: rows,
role: req.session.role,
username: req.session.username
});
});
});
app.use((req, res) => {
res.redirect('/dashboard');
});