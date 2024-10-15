const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    category: String,
    dateOfSale: Date,
    sold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);
