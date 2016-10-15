var express = require('express');
var app = express();
var api = require ("./routes/api");

app.use("/api", api);
app.use('/static', express.static('static'));

app.get("/", function(req, res){
    res.sendfile("static/main.html");
});

app.listen(8080, function () {});

