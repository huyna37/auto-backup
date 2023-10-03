const express = require("express");
const app = express();
const cron = require('node-cron');


const backup = require('./models/Backup.model.js');

app.use('/backup', async (req, res) => {
    await backup();
    res.status(200).json('ok')
})

cron.schedule('0 0 * * *', async () => {
    await backup();
});
app.listen(3100, () => {
    console.log(`Server is running on port ${3100}`);
});