Challenge.Routers = Challenge.Routers || {};
Challenge.Views       = Challenge.Views || {};

Challenge.Routers.Router = Backbone.Router.extend ({
  routes: {
    ''         : 'home',
    'join/:id' : 'room',
  },

  home: function () {
    console.log('router home');
    Challenge.Views.appView = new Challenge.Views.AppView();
  },

  room: function (id) {
    var url = '/room/' + id;
    $.get( url, function( data ) {
      Challenge.Views.appView = new Challenge.Views.AppView(data);
    });
  }

});