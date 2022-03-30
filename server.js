const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;
const productRouter = require('./route/product')

app.set('view-engine', 'ejs')
app.get('/', (req, res) => {
    res.render('index.ejs')
})
  
mongoose.connect('mongodb://localhost:27017/crud', () => console.log(`mongodb connected`))
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/product', productRouter);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})