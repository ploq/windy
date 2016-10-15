var express = require('express');
var app = express();
var api = require ("./routes/api");

app.use("/api", api);


app.listen(8080, function () {});
