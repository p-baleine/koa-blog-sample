module.exports = assertCsrf;

function assertCsrf() {
  return function *(next) {
    if (!~['post', 'put'].indexOf(this.method.toLowerCase())) { return (yield next); }

    try {
      this.assertCSRF(this.req.body);
    } catch (err) {
      this.throw(403, 'This CSRF token is invalid!');
    }

    delete this.req.body._csrf;

    yield next;
  };
}
