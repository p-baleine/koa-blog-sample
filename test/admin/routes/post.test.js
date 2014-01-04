var _ = require('lodash');
var co = require('co');
var expect = require('chai').expect;
var sinon = require('sinon');
var jade = require('jade');
var Post = require('../../../lib/models/post');
var User = require('../../../lib/models/user');
var Bookshelf = require('bookshelf').blogBookshelf;
var knex = Bookshelf.knex;
var post = require('../../../lib/admin/routes/post');
var cleanupDb = require('../../lib/cleanup-db')(knex);

var fixtures = [
  { title: 'title1', content: 'content1' },
  { title: 'title2', content: 'content2' },
  { title: 'title3', content: 'content3' }
];

describe('admin post route', function() {
  beforeEach(function(done) {
    co(function *() {
      this.user = yield new User({ email: 'a@a.com', name: 'aa', password: 'mysecret' }).save();
    }).call(this, done);
  });

  beforeEach(function() {
    this.renderFileSpy = sinon.stub(jade, 'renderFile').callsArgWith(2, '');
  });

  afterEach(function() {
    jade.renderFile.restore();
  });

  describe('GET /', function() {
    beforeEach(function() {
      this.posts = Bookshelf.Collection.forge(fixtures, { model: Bookshelf.Model });
      this.fetchSpy = sinon.spy(Bookshelf.Collection.prototype, 'fetch');
    });

    afterEach(function() {
      Bookshelf.Collection.prototype.fetch.restore();
    });

    it('should fetch posts with user and comments', function(done) {
      co(function *() {
        yield post.index;

        expect(this.fetchSpy.lastCall.args[0]).to.have.been.property('withRelated');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('user');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('comments');
      }).call(this, done);
    });

    it('should render `post/index`', function(done) {
      co(function *() {
        yield post.index;

        expect(this.renderFileSpy.args[0][0]).to.match(/post\/index\.jade/);      
      }).call(this, done);
    });
  });

  // set `this.ctx`
  function stubContext(mochaContext) {
    return _.extend({
      req: {
        body: {
          post: {
            title: 'title',
            content: 'content'
          }
        }
      },
      user: {
        id: mochaContext.user.id
      },
      redirect: sinon.spy()
    }, mochaContext);
  }

  describe('POST /', function() {
    beforeEach(function() {
      this.saveSpy = sinon.stub(Post.prototype, 'save');
      this.saveSpy.returns({
        then: function(cb) { cb(true); }
      });
    });

    afterEach(function() {
      Post.prototype.save.restore();
    });

    it('should save post with user_id', function(done) {
      co(function *() {
        yield post.create;

        expect(this.saveSpy.lastCall.thisValue.get('user_id')).to.equal(this.user.id);
      }).call(stubContext(this), done);
    });

    describe('when post save success', function() {
      it('should redirect to `/admin/posts`', function(done) {
        co(function *() {
          yield post.create;

          expect(this.redirect).to.have.been.calledWith('/admin/posts');
        }).call(stubContext(this), done);
      });
    });

    describe('when post save failed', function() {
      beforeEach(function() {
        this.saveSpy.returns({
          then: function(cb) { cb(false); }
        });
      });

      it('should render `post/new` with post data', function(done) {
        co(function *() {
          yield post.create;

          expect(this.renderFileSpy.args[0][0]).to.match(/post\/new/);
        }).call(stubContext(this), done);
      });
    });
  });
});
