const express = require("express");
const path = require("path");
const fs = require('fs');

const app = express();

/* Ensure any requests prefixed with /static will serve our "frontend/static" directory */
app.use("/static", express.static(path.resolve(__dirname, "src")));

/* Redirect all routes to our (soon to exist) "index.html" file */
app.get("*", (req, res) => {
    let p = [];
    if (req.path === '/') {
        p = ['index.html'];
    } else {
        p = req.path.split('/');
    }
    if (fs.existsSync(path.resolve(__dirname, 'src', ...p))) {
        // NOT SECURE, DO NOT USE IN PROD
        res.sendFile(path.resolve(__dirname, 'src', ...p));
        return;
    }
    res.sendFile(path.resolve(__dirname, "src", 'index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));