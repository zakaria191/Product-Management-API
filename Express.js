const express = require('express');
const app = express();

app.use(express.json());

app.set("view engine","ejs")

app.use(express.static("public"));

const products = [
    { id: 1, name: 'iPhone 12 Pro', price: 1099.99 , description: 'zakaria'},
    { id: 2, name: 'Samsung Galaxy S21', price: 999.99 },
    { id: 3, name: 'Sony PlayStation 5', price: 499.99 },
    { id: 4, name: 'MacBook Pro 16', price: 2399.99 },
    { id: 5, name: 'DJI Mavic Air 2', price: 799.99 },
];


app.use((req,res,next) => {
    const currentdate = new Date();
    console.log(`${currentdate.toISOString()} ${req.method} ${req.url}`);
    next();
});

app.get('/',(req,res) =>{
    res.render("home", { products: products });
})

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/error', (req, res, next) => {
    console.log(nonExistentVariable); // This will trigger an error
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.render("productDetails", { product: product });
    } else {
        res.status(404).send("Product not found");
    }
});


app.get('/products/search/find', (req, res) => {
    const searchQuery = req.query.q;
    const minPrice = parseFloat(req.query.minprice);
    const maxPrice = parseFloat(req.query.maxprice);

    let filteredProducts = products;

    if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchTerm));
    }

    if (!isNaN(minPrice)) {
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
    }

    if (!isNaN(maxPrice)) {
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }

    res.json(filteredProducts);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;

    // Check if both name and price are provided
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and Price are required' });
    }
    
    const newProductId = products.length + 1;
    const newProduct = {
        id: newProductId,
        name,
        price: parseFloat(price)
    };
    products.push(newProduct);

    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProductData = req.body;

    // Find the product with the specified ID
    const productToUpdate = products.find(product => product.id === productId);

    if (!productToUpdate) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product data
    if (updatedProductData.name) {
        productToUpdate.name = updatedProductData.name;
    }
    if (!isNaN(updatedProductData.price)) {
        productToUpdate.price = parseFloat(updatedProductData.price);
    }

    res.json(productToUpdate);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    // Find the index of the product with the specified ID
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the product from the array
    const deletedProduct = products.splice(productIndex, 1)[0];

    res.json(deletedProduct);
});

app.use((err,req,res,next) =>{
    console.log(err.stack);
    res.status(500).json({error:'an error occured'});
    next();
});
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
