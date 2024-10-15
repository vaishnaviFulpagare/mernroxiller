app.get('/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const query = {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    };

    const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(parseInt(perPage));
    res.json(transactions);
});

app.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(`2021-${parseInt(month) + 1}-01`);

    const totalSales = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
        { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const soldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: true });
    const unsoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: false });

    res.json({ totalSales, soldItems, unsoldItems });
});



app.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(`2021-${parseInt(month) + 1}-01`);

    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        // add other ranges
    ];

    const response = await Promise.all(
        priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                price: { $gte: range.min, $lte: range.max },
                dateOfSale: { $gte: startDate, $lt: endDate }
            });
            return { range: range.range, count };
        })
    );

    res.json(response);
});
app.get('/pie-chart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2021-${month}-01`);
    const endDate = new Date(`2021-${parseInt(month) + 1}-01`);

    const categories = await Transaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json(categories);
});

app.get('/combined-data', async (req, res) => {
    const month = req.query.month;

    const transactions = await Transaction.find({ month });
    const statistics = await getStatistics(month);
    const barChartData = await getBarChartData(month);
    const pieChartData = await getPieChartData(month);

    res.json({ transactions, statistics, barChartData, pieChartData });
});
