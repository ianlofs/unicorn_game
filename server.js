var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + '/dist'))

app.get('/', (req, res) => {
  console.log(res);
  console.log(req);
  res.sendfile('dist/index.html');
});

app.listen(PORT);
