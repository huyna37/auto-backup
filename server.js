const express = require("express");
const app = express();

require('./models/Backup.model.js');

app.listen(3100, () => {
    console.log(`Server is running on port ${3100}`);
});