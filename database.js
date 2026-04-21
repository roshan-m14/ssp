const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database('./school.db', (err) => { 
if (err) { 
console.error("Database connection error:", err.message); 
} else { 
console.log('Connected to the SQLite database.'); 
db.run(`CREATE TABLE IF NOT EXISTS students ( 
id INTEGER PRIMARY KEY AUTOINCREMENT, 
name TEXT, 
email TEXT, 
program TEXT, 
contact_number TEXT 
)`); 
// Add program column if it doesn't exist 
db.run(`ALTER TABLE students ADD COLUMN program TEXT`, (err) => { 
if (err && !err.message.includes('duplicate column name')) { 
console.error('Error adding column:', err.message); 
} 
}); 
// Add contact_number column if it doesn't exist 
db.run(`ALTER TABLE students ADD COLUMN contact_number TEXT`, (err) => { 
if (err && !err.message.includes('duplicate column name')) { 
console.error('Error adding column:', err.message); 
} 
}); 
// Add address column if it doesn't exist 
db.run(`ALTER TABLE students ADD COLUMN address TEXT`, (err) => { 
if (err && !err.message.includes('duplicate column name')) { 
console.error('Error adding column:', err.message); 
} 
}); 
} 
}); 
module.exports = db;