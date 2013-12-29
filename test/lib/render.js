var coRender = require('co-render');
var jsdom = require('jsdom');
var join = require('path').join;
var fs = require('fs');
var option = { encoding: 'utf-8' };
var jquery = fs.readFileSync(join(__dirname, '/../../bower_components/jquery/jquery.min.js'), option);

// co-domify ? co-dom ? not render ? make module

function *render(view, opts) {
  var body = yield coRender(view, opts);

  return (yield function(cb) {
    jsdom.env({
      html: body,
      src: [jquery],
      done: cb
    });
  });
}

module.exports = render;
