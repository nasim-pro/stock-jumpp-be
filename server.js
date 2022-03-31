const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const categoryRouter = require('./route/category')
const productRouter = require('./route/product');

mongoose.connect('mongodb://localhost:27017/crud', () => console.log(`mongodb connected`))
app.set('view-engine', 'ejs')
app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
