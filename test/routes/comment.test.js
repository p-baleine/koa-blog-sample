var _ = require('lodash');
var co = require('co');
var expect = require('chai').expect;
var sinon = require('sinon');
var User = require('../../lib/models/user');
var Post = require('../../lib/models/post');
var Comment = require('../../lib/models/comment');
var Bookshelf = require('bookshelf').blogBookshelf;
var knex = Bookshelf.knex;
var comment = require('../../lib/routes/comment');
var cleanupDb = require('../lib/cleanup-db')(knex);

describe('comment route', function() {
  describe('POST /', function() {
    beforeEach(function(done) {
      co(function *() {
        this.user = yield new User({ email: 'a@a.com', name: 'aa', password: 'mysecret' }).save();
        this.post = yield new Post({ title: 'title', content: 'content', user_id: this.user.id }).save();
        this.saveSpy = sinon.spy(Comment.prototype, 'save');
      }).call(this, done);
    });

    afterEach(function() {
      Comment.prototype.save.restore();
    });

    function stubContext(mochaContext) {
      return _.extend({
        req: {
          body: {
            commenter: 'usi',
            content: 'content'
          }
        },
        user: {
          id: mochaContext.user.id
        },
        redirect: sinon.spy(),
        throw: sinon.spy(function(code) {
          throw new Error(code);
        })
      }, mochaContext);
    }

    describe('when the post dose not exist', function() {
      it('should respond with error', function(done) {
        co(function *() {
          yield comment.create.call(this, this.post.id + 100);
        }).call(stubContext(this), function(e) {
          expect(e).to.exist;
          done();
        }.bind(this));
      });
    });

    describe('when the post exist', function() {
      it('should save comment', function(done) {
        co(function *() {
          yield comment.create.call(this, this.post.id);

          expect(this.saveSpy).to.have.been.called;
          expect(this.saveSpy.lastCall.thisValue.get('post_id')).to.equal(this.post.id);
          expect(this.saveSpy.lastCall.thisValue.get('commenter')).to.equal('usi');
          expect(this.saveSpy.lastCall.thisValue.get('content')).to.equal('content');
        }).call(stubContext(this), done);
      });

      it('should respond with saved comment', function(done) {
        co(function *() {
          yield comment.create.call(this, this.post.id);

          expect(this.body.get('commenter')).to.equal('usi');
        }).call(stubContext(this), done);        
      });
    });
  });
});
