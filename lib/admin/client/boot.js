var $ = require('jquery');

$(function() {
  $('.post .destroy').click(function(e) {
    e.preventDefault();

    $.ajax({
      url: '/admin/posts/' + $(e.target).data('post-id'),
      type: 'delete',
      success: function() {
        location.href = '/admin/posts';
      }
    });
  });
});
