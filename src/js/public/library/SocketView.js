
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};
Challenge.Views       = Challenge.Views || {};

// new room, users, go button, betting
Challenge.Views.SocketView = Backbone.View.extend({
  
  el: ".socket",
  
  events: {
    'click #newRoom'      : 'newRoom'
  },

  templates: {
    roomSocket     : JST['room-socket'],
    freshSocket    : JST['fresh-socket'],
    share          : JST['share']
  },

  room: null,
  user: null,
  socket: null,
  isHost: false,

  initialize: function (options) {
    this.socket = io();

    if (options.room && options.user){

      this.room   = new Challenge.Models.Room(options.room);
      this.user   = new Challenge.Models.User(options.user);
      this.socket = io();

      var self = this;
      this.socket.on('users', function(data){
        self.renderUsers(data);
      });

      this.socket.on('fetch game', function(data){
        console.log('socket fetch game');
        self.fetchGame(data);
      });

      this.socket.emit('join', options);

      this.renderRoom();
    }
    else {
      this.isHost = true;
      this.render();
    }
  },
  
  render: function () {
    $(this.el).html(this.templates.freshSocket());
  },

  renderRoom: function(){
    $(this.el).html(this.templates.roomSocket());
  },

  renderUsers: function(data){
    console.log('render users');
    // lol not in el what is wrong with you
    var $list = $('#userList', this.el).text('');

    for (var i = 0; i < data.users.length; i++){
      var nick = data.users[i].nickname;

      if (nick === this.user.get('nickname')){
        nick = nick + " (you)";
      }

      $list.text( $list.text() + '\n' + nick );
    }
  },

  newRoom: function() {
    var self = this;
    
    $.get( "/room", function( data ) {
      self.room   = new Challenge.Models.Room(data.room);
      self.user   = new Challenge.Models.User(data.user);

      console.log('new room');

      self.socket.on('users', function(data){
        self.renderUsers(data);
      });

      self.socket.emit('join', data);

      self.renderRoom();
      self.showLink();
    });
  },

  announceFetchGame: function(matchId){
    console.log('announceFetchgame');
    this.socket.emit('fetch game', { room : self.room, matchId : matchId } );
  },

  fetchGame: function(data){
    if (data.matchId !== Challenge.Views.matchView.match.get('matchId')){
      console.log('fetch');
    }
    console.log(data.matchId);
  },

  showLink: function(){
    var url = window.location.origin + '/join/' + this.room.get('id');
    $('.share', this.el).html(this.templates.share({ link : url }));
  }

});