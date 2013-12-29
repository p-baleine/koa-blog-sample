var _ = require('lodash');
var ValidatorError = require('validator').ValidatorError;
var BaseModel = require('./base');
var Bookshelf = require('bookshelf').blogBookshelf;

var Post = BaseModel.extend({

  tableName: 'posts',

  user: function() {
    return this.belongsTo(require('./user'));
  },

  comments: function() {
    return this.hasMany(require('./comment'));
  },

  tags: function() {
    return this.belongsToMany(require('./tag'));
  },

  validate: function(model) {
    this.validator.check(model.get('title'), 'title is empty').notEmpty();
    this.validator.check(model.get('content'), 'content is empty').notEmpty();
  },

  // override
  save: function(params, options) {
    var _this = this;

    return Bookshelf
      .transaction(function(t) {
        var tags = _this.get('tags');

        _this.attributes = _this.omit('tags');
        options = _.extend(options || {}, { transacting: t });

        return BaseModel.prototype.save.call(_this, params, options)
          .then(function(saved) {
            // cancel processing tags by throwing an error if save failed
            if (saved === false) { throw new ValidatorError(); }
            // first detach all tags which related to this post.
            return _this.tags().detach(null, options);
          })
          .then(function() {
            // then attach tags.
            return _this.tags().attach(tags, options);
          })
          .then(t.commit, t.rollback);
      })
      .yield(this) // ensure returning post.
      .catch(ValidatorError, function() { return false; }); // turn `ValidatorError` to false.
  }

});

module.exports = Post;
