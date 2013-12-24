var app = require('./lib/app'),

    port = 3000;

app.listen(port, function() {
  console.log('listening on %d', port);
});

