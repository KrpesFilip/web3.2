const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/', (req, res) => {
    res.redirect('/slike');
});

app.get('/slike', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'Images');
    const files = fs.readdirSync(folderPath);
    
    const images = files
    .filter(file =>  file.endsWith('.svg'))
    .map((file, index) => ({
        url: `/Images/${file}`,
        id: `slika${index + 1}`,
        title: `Slika ${index + 1}`
    }));
    
    res.render('slike', { images });
});

app.listen(PORT, () => {
console.log(`Server pokrenut na portu ${PORT}`);
});