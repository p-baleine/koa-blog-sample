var co = require('co');
var expect = require('chai').expect;
var render = require('../../lib/render');
var join = require('path').resolve;

var posts = [
  { title: 't1', content: 'c1', user: { name: 'u1' }, tags: [{ text: 'tag1' }], comments: [{}, {}] }
];

describe('post/index view', function() {

  function *renderIndex(posts) {
    var viewFile = join(__dirname, '../../../lib/views/post/index.jade');
    return (yield render(viewFile, {
      formatDate: function() {},
      posts: posts
    }));
  }

  it('should render posts', function(done) {
    co(function *() {
      var window = yield renderIndex(posts);
      expect(window.$('.post')).to.have.length(posts.length);
    })(done);
  });

  it('should render post title', function(done) {
    co(function *() {
      var window = yield renderIndex(posts);
      expect(window.$('.post:first-child .title').html()).to.contain(posts[0].title);
    })(done);
  });

  it('should render post content', function(done) {
    co(function *() {
      var window = yield renderIndex(posts);
      expect(window.$('.post:first-child .content').html()).to.contain(posts[0].content);
    })(done);
  });

  it('should render post author\'s name', function(done) {
    co(function *() {
      var window = yield renderIndex(posts);
      expect(window.$('.post:first-child .author').html()).to.contain(posts[0].user.name);
    })(done);
  });

  it('should render post tags', function(done) {
    co(function *() {
      var window = yield renderIndex(posts);
      expect(window.$('.post:first-child .tags').html()).to.contain(posts[0].tags[0].text);
    })(done);
  });

  it('should render post comment count', function(done) {
    co(function *() {
      var window = yield renderIndex(posts);
      expect(window.$('.post:first-child .comment-count').html()).to.contain(posts[0].comments.length);
    })(done);
  });
});
