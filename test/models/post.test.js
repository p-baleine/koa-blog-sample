var co = require('co');
var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var User = require('../../lib/models/user');
var Post = require('../../lib/models/post');
var Comment = require('../../lib/models/comment');
var Tag = require('../../lib/models/tag');
var knex = require('bookshelf').blogBookshelf.knex;

describe('Post', function() {

  beforeEach(function(done) {
    co(function *() {
      yield knex('comments').del();
      yield knex('posts_tags').del();
      yield knex('posts').del();
      yield knex('users').del();
    })(done);
  });

  describe('relations', function() {
    it('should belong to User', function() {
      expect(new Post().user().relatedData).to.exist;
      expect(new Post().user().relatedData.target).to.equal(User);
      expect(new Post().user().relatedData.type).to.equal('belongsTo');
    });

    it('should have many comments', function() {
      expect(new Post().comments().relatedData).to.exist;
      expect(new Post().comments().relatedData.target).to.equal(Comment);
      expect(new Post().comments().relatedData.type).to.equal('hasMany');
    });

    it('should belong to many tags', function() {
      expect(new Post().tags().relatedData).to.exist;
      expect(new Post().tags().relatedData.target).to.equal(Tag);
      expect(new Post().tags().relatedData.type).to.equal('belongsToMany');
    });
  });

  describe('#save()', function() {
    describe('tag attachement', function() {
      it('should attach tags', function(done) {
        co(function *() {
          var user = yield new User({ email: 'p.baleine@gmail.com', name: 'p', password: 's' }).save();
          var post = yield new Post({ title: 't1', content: 'c1', user_id: user.id, tags: [1, 2] }).save();
          var postsTags = yield knex('posts_tags')
                .where('post_id', post.id)
                .whereIn('tag_id', [1, 2])
                .orderBy('tag_id')
                .select();

          expect(postsTags[0].post_id).to.equal(post.id);
          expect(postsTags[0].tag_id).to.equal(1);
          expect(postsTags[1].post_id).to.equal(post.id);
          expect(postsTags[1].tag_id).to.equal(2);          
        })(done);
      });

      it('should dettach tags', function(done) {
        co(function *() {
          var user = yield new User({ email: 'p.baleine@gmail.com', name: 'p', password: 's' }).save();
          var post = yield new Post({ title: 't1', content: 'c1', user_id: user.id, tags: [1, 2] }).save();

          post.set('tags', [2]); // detach tag 1
          yield post.save();

          var postsTags = yield knex('posts_tags')
                .where('post_id', post.id)
                .whereIn('tag_id', [1, 2])
                .orderBy('tag_id')
                .select();

          expect(postsTags).to.have.length(1);
          expect(postsTags[0].post_id).to.equal(post.id);
          expect(postsTags[0].tag_id).to.equal(2);
        })(done);
      });

      it('should not save when attaching tag failed', function(done) {
        co(function *() {
          var user = yield new User({ email: 'p.baleine@gmail.com', name: 'p', password: 's' }).save();
          var post = new Post({ title: 't1', content: 'c1', tags: [1, 1], user_id: user.id });

          yield post.save(); // post.save() would failed due to duplicated id of tags.
        }).call(this, function(e) {
          expect(e).to.exist;
          knex('posts').select().then(function(posts) {
            expect(posts).to.be.empty;
          });
          done();
        });
      });

      it('should throw error when some error occurred other than `ValidatorError`', function(done) {
        co(function *() {
          var user = yield new User({ email: 'p.baleine@gmail.com', name: 'p', password: 's' }).save();
          var post = new Post({ title: 't1', content: 'c1', tags: [1, 2], user_id: user.id });

          sinon.stub(post, 'save', function() { throw new Error(); });

          yield post.save();
        })(function(e) {
          expect(e).to.exist;
          done();
        });
      });
    });

    describe('validations', function() {
      it('should not save post when the given title is empty', function(done) {
        co(function *() { 
          var user = yield new User({ email: 'p.baleine@gmail.com', name: 'p', password: 's' }).save();
          var post = new Post({ content: 'content1', user_id: user.id });

          expect((yield post.save())).to.equal(false);
          expect(post.getValidationErrors()).to.contain('title is empty');
        })(done);
      });

      it('should not save post when the given content is empty', function(done) {
        co(function *() {
          var user = yield new User({ email: 'p.baleine@gmail.com', name: 'p', password: 's' }).save();
          var post = new Post({ title: 'title1', user_id: user.id });

          expect((yield post.save())).to.equal(false);
          expect(post.getValidationErrors()).to.contain('content is empty');
        })(done);
      });
    });
  });

  describe('.findAll()', function() {
    beforeEach(function(done) {
      co(function *() {
        var user = yield new User({ email: 'p.baleine@gmail.com', name: 'p', password: 's' }).save();

        yield new Post({ title: 'title1', content: 'content1', user_id: user.id }).save();
        yield new Post({ title: 'title2', content: 'content2', user_id: user.id }).save();
      })(done);
    });

    it('should return all posts.', function(done) {
      co(function *() {
        var posts = yield Post.findAll();

        expect(posts).to.have.length(2);
      })(done);
    });
  });
});
