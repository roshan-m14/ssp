const express = require('express'); 
const app = express(); 
const PORT = 3000; 

app.get('/',(request,response)=> {
    response.send('<h1>Welcome to Mila!</h1>');
});

app.get('/name',(request,response)=> {
    response.send('<h1>Hi im Roshan!</h1>');
});

app.get('/about',(request,response)=> {
    response.send('<p>im 22</p>');
});

app.get('/contact',(request,response)=> {
    response.send('<h1>01153061410</h1>');
});

app.get('/email',(request,response)=> {
    response.send('<h1>roshanmanirajan17@gmail.com</h1>');
});

app.listen(PORT, () => { 
console.log(`Server is successfully running on port ${PORT}`); 
}); 