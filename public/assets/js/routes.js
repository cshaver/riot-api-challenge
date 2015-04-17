var GalleryRouter = Backbone.Router.extend ({
  routes: {
    '' : 'home',
    'view': 'viewImage'
  },
  home: function () {
    alert('you are viewing home page');
  },
  viewImage: function () {
    alert('you are viewing an image');
  }
});