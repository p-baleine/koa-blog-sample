var co = require('co');
var path = require('path');
var expect = require('chai').expect;
var sinon = require('sinon');
var jade = require('jade');
var Base = require('../../lib/models/base'); // establish connection
var Bookshelf = require('bookshelf').blogBookshelf;
var post = require('../../lib/routes/post');

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
      this.posts = Bookshelf.Collection.forge(fixtures, { model: Bookshelf.Model });
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
      })(function(e) {
        if (e) { return done(e); }
        expect(this.fetchSpy.lastCall.args[0]).to.have.been.property('withRelated');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('user');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('comments');
        expect(this.fetchSpy.lastCall.args[0].withRelated).to.include('tags');
        done();
      }.bind(this));
    });

    it('should fetch posts in the order of post\'s created_at desc', function(done) {
      co(function *() {
        yield post.index;
      })(function(e) {
        if (e) { return done(e); }
        expect(this.querySpy).to.have.been.calledWith('orderBy', 'created_at', 'desc');
        done();
      }.bind(this));      
    });

    it('should render `post/index`', function(done) {
      co(function *() {
        yield post.index;
      })(function(e) {
        if (e) { return done(e); }
        expect(this.renderFileSpy.args[0][0]).to.match(/post\/index\.jade/);
        done();
      }.bind(this));      
    });
  });

  describe('GET /:post', function() {
    beforeEach(function() {
      this.fetchStub = sinon.stub(Bookshelf.Model.prototype, 'fetch').returns({
        then: function(cb) { cb(new Bookshelf.Model()); }
      });
    });

    afterEach(function() {
      Bookshelf.Model.prototype.fetch.restore();
    });

    it('should fetch a post that has passed id', function(done) {
      co(function *() {
        yield post.show(100);
      })(function(e) {
        if (e) { return done(e); }
        expect(this.fetchStub.lastCall.thisValue.id).to.equal(100);
        done();
      }.bind(this));
    });

    it('should fetch a post with user, comments and tags', function(done) {
      co(function *() {
        yield post.show;
      })(function(e) {
        if (e) { return done(e); }
        expect(this.fetchStub.lastCall.args[0]).to.have.been.property('withRelated');
        expect(this.fetchStub.lastCall.args[0].withRelated).to.include('user');
        expect(this.fetchStub.lastCall.args[0].withRelated).to.include('comments');
        expect(this.fetchStub.lastCall.args[0].withRelated).to.include('tags');
        done();
      }.bind(this));
    });

    it('should render `post/show`', function(done) {
      co(function *() {
        yield post.show;
      })(function(e) {
        if (e) { return done(e); }
        expect(this.renderFileSpy.args[0][0]).to.match(/post\/show\.jade/);
        done();
      }.bind(this));      
    });
  });
});
