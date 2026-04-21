const express = require('express');
const db = require('./database');
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
db.all('SELECT * FROM students', [], (err, rows) => {
if (err) {
return console.error(err.message);
}
res.render('index', { students: rows });
});
});
app.post('/submit', (req, res) => {
const submittedName = req.body.studentName;
const submittedEmail = req.body.studentEmail;
const submittedPhone = req.body.studentPhone;
const submittedAddress = req.body.studentAddress;
db.run('INSERT INTO students (name, email, contact_number, address) VALUES (?, ?, ?, ?)', [submittedName, submittedEmail, submittedPhone, submittedAddress], (err) => {
if (err) {
return console.error(err.message);
}
res.redirect('/');
});
});
app.post('/delete/:id', (req, res) => {
const studentId = req.params.id;
db.run('DELETE FROM students WHERE id = ?', [studentId], (err) => {
if (err) {
return console.error(err.message);
}
res.redirect('/');
});
});
app.get('/edit/:id', (req, res) => {
const studentId = req.params.id;
db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, row) => {
if (err) {
return console.error(err.message);
}
res.render('edit', { student: row });
});
});
app.post('/update/:id', (req, res) => {
const studentId = req.params.id;
const updatedName = req.body.studentName;
const updatedEmail = req.body.studentEmail;
const updatedPhone = req.body.studentPhone;
const updatedAddress = req.body.studentAddress;
db.run('UPDATE students SET name = ?, email = ?, contact_number = ?, address = ? WHERE id = ?', [updatedName, updatedEmail, updatedPhone, updatedAddress, studentId], (err) => {
if (err) {
return console.error(err.message);
}
res.redirect('/');
});
});
app.listen(PORT, () => {
console.log(`Server is successfully running on port ${PORT}`);
});