Challenge.Routers = Challenge.Routers || {};

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
      self.room   = new Challenge.Models.Room(data.room);
      self.user   = new Challenge.Models.User(data.user);
      self.socket = io();

      self.socket.emit('join', data);
    });
  }

});