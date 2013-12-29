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

var fixtures = [
  { title: 'title1', content: 'content1' },
  { title: 'title2', content: 'content2' },
  { title: 'title3', content: 'content3' }
];

describe('admin post route', function() {
  before(function(done) {
    co(function *() {
      // TODO extract cleaning db process
      yield knex('comments').del();
      yield knex('posts_tags').del();
      yield knex('posts').del();
      yield knex('users').del();
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

    it('should render `post/index`');
  });

  describe('POST /', function() {
    beforeEach(function() {
      this.saveSpy = sinon.spy(Post.prototype, 'save');
    });

    afterEach(function() {
      Post.prototype.save.restore();
    });

    it('should save post with user_id', function(done) {
      var ctx = _.extend({
        req: {
          body: {
            post: {
              title: 'title',
              content: 'content'
            }
          }
        },
        user: {
          id: this.user.id
        },
        redirect: function() {}
      }, this);

      co(function *() {
        yield post.create;

        expect(this.saveSpy.lastCall.thisValue.get('user_id')).to.equal(this.user.id);
      }).call(ctx, done);
    });
  });
});
