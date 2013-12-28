var expect = require('chai').expect;
var Promise = require('bluebird');
var _ = require('lodash');
var User = require('../../lib/models/user');
var Post = require('../../lib/models/post');
var Comment = require('../../lib/models/comment');
var Tag = require('../../lib/models/tag');
var knex = require('bookshelf').blogBookshelf.knex;

describe('Post', function() {

  function user(email, name, password) {
    email = email || 'p.baleine@gmail.com';
    name = name || 'p.baleine';
    password = password || 'mysecret';

    return new User({ email: email, name: name, password: password }).save();
  }

  beforeEach(function() {
    return Promise.all([
      knex('comments').del(),
      knex('posts_tags').del(),
      knex('posts').del(),
      knex('users').del()
    ]);
  });

  describe('relations', function() {
    it('should belong to User', function() {
      return Promise.all([
        expect(new Post().user().relatedData).to.exist,
        expect(new Post().user().relatedData.target).to.equal(User),
        expect(new Post().user().relatedData.type).to.equal('belongsTo')
      ]);
    });

    it('should have many comments', function() {
      return Promise.all([
        expect(new Post().comments().relatedData).to.exist,
        expect(new Post().comments().relatedData.target).to.equal(Comment),
        expect(new Post().comments().relatedData.type).to.equal('hasMany')
      ]);
    });

    it('should belong to many tags', function() {
      return Promise.all([
        expect(new Post().tags().relatedData).to.exist,
        expect(new Post().tags().relatedData.target).to.equal(Tag),
        expect(new Post().tags().relatedData.type).to.equal('belongsToMany')
      ]);
    });
  });

  describe('#save()', function() {
    describe('tag attachement', function() {
      it('should attach tags', function() {
        var post = new Post({ title: 't1', content: 'c1', tags: [1, 2] });

        return user().then(function(user) {
          post.set('user_id', user.id);
          return post.save();
        }).then(function() {
          return knex('posts_tags')
            .where('post_id', post.id)
            .whereIn('tag_id', [1, 2])
            .orderBy('tag_id')
            .select();
        }).then(function(postsTags) {
          return Promise.all([
            expect(postsTags[0].post_id).to.equal(post.id),
            expect(postsTags[0].tag_id).to.equal(1),
            expect(postsTags[1].post_id).to.equal(post.id),
            expect(postsTags[1].tag_id).to.equal(2)
          ]);
        });
      });

      it('should dettach tags', function() {
        var post = new Post({ title: 't1', content: 'c1', tags: [1, 2] });

        return user().then(function(user) {
          post.set('user_id', user.id);
          return post.save();
        }).then(function() {
          post.set('tags', [2]); // detach tag 1
          return post.save();
        }).then(function() {
          return knex('posts_tags')
            .where('post_id', post.id)
            .whereIn('tag_id', [1, 2])
            .orderBy('tag_id')
            .select();
        }).then(function(postsTags) {
          return Promise.all([
            expect(postsTags).to.have.length(1),
            expect(postsTags[0].post_id).to.equal(post.id),
            expect(postsTags[0].tag_id).to.equal(2)
          ]);
        });
      });
    });

    describe('validations', function() {
      it('should not save post when the given title is empty', function() {
        var post = new Post({ content: 'content1' });

        return user().then(function(user) {
          post.set('user_id', user.id);
          return post.save();
        }).then(function(result) {
          return Promise.all([
            expect(result).to.equal(false),
            expect(post.getValidationErrors()).to.contain('title is empty')
          ]);
        });
      });

      it('should not save post when the given content is empty', function() {
        var post = new Post({ title: 'title1' });

        return user().then(function(user) {
          post.set('user_id', user.id);
          return post.save();
        }).then(function(result) {
          return Promise.all([
            expect(result).to.equal(false),
            expect(post.getValidationErrors()).to.contain('content is empty')
          ]);
        });
      });
    });
  });

  describe('.findAll()', function() {
    beforeEach(function() {
      return user().then(function(user) {
          return Promise.all([
            new Post({ title: 'title1', content: 'content1', user_id: user.id }).save(),
            new Post({ title: 'title2', content: 'content2', user_id: user.id }).save()
          ]);
        });
    });

    it('should return all posts.', function() {
      return Post.findAll().then(function(posts) {
        return expect(posts).to.have.length(2);
      });
    });
  });
});
