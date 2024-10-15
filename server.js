const axios = require('axios');
const express = require('express');
const Transaction = require('./models/Transaction'); // Import the model

const app = express();

app.get('/seed', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.insertMany(response.data);
        res.send('Database seeded successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

