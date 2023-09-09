const express= require('express')
const app= express()
const handlebars=require('express-handlebars')
const path=require('path')
const cookieParser=require ('cookie-parser');
const session = require('express-session');
const database = require('./config/database');
const port = 3000;
database.connect();
// configure Handlebars view engine
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser('ddn'));
app.use(session({ cookie: { maxAge: 300000000 } }));

app.set('views', path.join(__dirname, 'views'));

const tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
    { id: 1, name: 'thanh hà', price: 0 },
    ]

app.get('/', (req, res) => {
    let a='product A';
    return res.render('home',{tours})
})
app.get('/about', (req, res) => {
    let re="about";
    return res.render('about',{about:re})
})
//=================_________________________________________________

// app.get('/api/tours', (req, res) => res.json(tours))

app.get('/api/tours', (req, res) => {
    const toursXml = '<?xml version="1.0"?><tours>' +
    tours.map(p =>
    `<tour price="${p.price}" id="${p.id}">${p.name}</tour>`
    ).join('') + '</tours>'
    const toursText = tours.map(p =>
    `${p.id}: ${p.name} (${p.price})`
    ).join('\n')
    res.format({
    'application/json': () => res.json(tours),
    'application/xml': () => res.type('application/xml').send(toursXml),
    'text/xml': () => res.type('text/xml').send(toursXml),
    'text/plain': () => res.type('text/plain').send(toursText),
    })
    })

// app.post('/api/tour/update/:id', (req, res) => {
//     const p = tours.find(p => p.id === parseInt(req.params.id))
//     if(!p) return res.status(404).json({ error: 'No such tour exists' })
//     if(req.body.name) p.name = req.body.name
//     if(req.body.price) p.price = req.body.price
//     res.json({ success: true })
//     })
app.get('/search', (req, res)=>{
    var id = req.query.id;
	var data = tours.filter(item=>{
        return item.id === parseInt(id)
    });
    console.log(data)
	res.render('home', {
		findtours: data
    });
})

app.get('/add',(req,res)=>{
    return res.render('add')
})

app.post('/add',(req,res)=>{
    const data={
        id:parseInt(req.body.id),
        name:req.body.name,
        price:req.body.price,
    };
    tours.push(data)
    console.log(tours)
    return res.send(`<div class="w-90 mt-5 alert alert-success text-center">${"success"}</div>`)
})

// app.get('/api/tour/:id', (req, res) => {
//     const idx = tours.findIndex(tour => tour.id === parseInt(req.params.id))
//     if(idx < 0) return res.json({ error: 'No such tour exists.' })
//     tours.splice(idx, 1)
//     return res.json({ success: true })
//     })
// localhost
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
// custom 404 page
// app.use((req, res) => {
// res.status(404)
// res.render('404')
// })
// // custom 500 page
// app.use((err, req, res, next) => {
// console.error(err.message)
// res.status(500)
// res.render('500')
// })