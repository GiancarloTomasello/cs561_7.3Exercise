const express = require('express');
const app = express();

const products = {
    1: { id: 1, name: 'Laptop' },
    2: { id: 2, name: 'Phone' }
};

app.get('/product/:id', (req, res) => {
    const product = products[req.params.id];
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(3002, () => console.log('Product Service running on port 3002'));
