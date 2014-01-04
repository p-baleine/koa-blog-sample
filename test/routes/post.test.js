var co = require('co');
var _ = require('lodash');
var path = require('path');
var expect = require('chai').expect;
var sinon = require('sinon');
var jade = require('jade');
var User = require('../../lib/models/user');
var Post = require('../../lib/models/post');
var Bookshelf = require('bookshelf').blogBookshelf;
var post = require('../../lib/routes/post');
var cleanupDb = require('../lib/cleanup-db')(Bookshelf.knex);

var fixtures = [
  { title: 'title1', content: 'content1' },
  { title: 'title2', content: 'content2' },
  { title: 'title3', content: 'content3' }
];

describe('post route', function() {
  beforeEach(function() {
    this.renderFileSpy = sinon.stub(jade, 'renderFile').callsArgWith(2, '');
  });

  afterEach(function() {
    jade.renderFile.restore();
  });

  describe('GET /', function() {
    beforeEach(function() {
      this.fetchSpy = sinon.spy(Bookshelf.Collection.prototype, 'fetch');
      this.querySpy = sinon.spy(Bookshelf.Collection.prototype, 'query');
    });

    afterEach(function() {
      Bookshelf.Collection.prototype.fetch.restore();
      Bookshelf.Collection.prototype.query.restore();
    });

    it('should fetch posts with user, comments and tags', function(done) {
      co(function *() {
        yield post.index;

        expect(this.fetchSpy.lastCall.args[0]).to.have.been.property('withRelated');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('user');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('comments');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('tags');
      }).call(this, done);
    });

    it('should fetch posts in the order of post\'s created_at desc', function(done) {
      co(function *() {
        yield post.index;

        expect(this.querySpy).to.have.been.calledWith('orderBy', 'created_at', 'desc');
      }).call(this, done);
    });

    it('should render `post/index`', function(done) {
      co(function *() {
        yield post.index;

        expect(this.renderFileSpy.args[0][0]).to.match(/post\/index\.jade/);
      }).call(this, done);
    });
  });

  describe('GET /:post', function() {
    beforeEach(function(done) {
      co(function *() {
        this.user = yield new User({ email: 'a@a.com', name: 'aa', password: 'mysecret' }).save();
        this.post = yield new Post({ title: 'title', content: 'content', user_id: this.user.id }).save();
        this.fetchSpy = sinon.spy(Post.prototype, 'fetch');
      }).call(this, done);
    });

    afterEach(function() {
      Post.prototype.fetch.restore();
    });

    it('should fetch a post that has passed id', function(done) {
      co(function *() {
        yield post.show.call(this, this.post.id);

        expect(this.fetchSpy.lastCall.thisValue.id).to.equal(this.post.id);
      }).call(this, done);
    });

    it('should fetch a post with user, comments and tags', function(done) {
      co(function *() {
        yield post.show.call(this, this.post.id);

        expect(this.fetchSpy.lastCall.args[0]).to.have.been.property('withRelated');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('user');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('comments');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('tags');
      }).call(this, done);
    });

    it('should render `post/show`', function(done) {
      co(function *() {
        yield post.show.call(this, this.post.id);

        expect(this.renderFileSpy.args[0][0]).to.match(/post\/show\.jade/);
      }).call(this, done);
    });

    describe('when the post dose not exist', function() {
      it('should respond with error', function(done) {
        var ctx = _.extend(this, {
          throw: sinon.spy(function(message) {
            throw new Error(message);
          })
        });

        co(function *() {
          yield post.show.call(this, this.post.id + 100);
        }).call(ctx, function(e) {
          expect(e.message).to.equal('404');
          done();
        });
      });
    });
  });
});
