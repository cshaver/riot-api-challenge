
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};
Challenge.Views       = Challenge.Views || {};

Challenge.Views.AppView = Backbone.View.extend({
  
  el: "main",
  
  events: {
    'click #newRoom' : 'newRoom'
  },

  templates: {
    main       : JST['main'],
    share      : JST['share'],
    sprite     : JST['sprite'],
    bettingRow : JST['betting-row']
  },

  room: null,
  socket: null,
  frameTime: 300,

  initialize: function () {
    this.render()

    this.match = new Challenge.Models.Match();

    var self = this;
    this.match.fetch({
      success: function(model, response){
        self.fetchChampions(model);
      }
    });

  },
  
  render: function () {
    $(this.el).html(this.templates.main());
  },

  fetchChampions: function(match){
    var self = this;

    var participants = this.match.get('participants'),
        counter      = participants.length;

    participants.each(function(participant){

      // get champion for participant
      var url = "/champ/" + participant.get('championId');
      $.get( url, function( data ) {
        participant.set('champion', new Challenge.Models.Champion(data));
        counter = counter - 1;

        if (counter === 0){
          self.renderMatchIntro();
        }
      });
      
    });
  },

  renderMatchIntro: function(){
    console.log('intro');
    var self = this;

    var participants = this.match.get('participants');

    participants.each(function(participant){
      $('.bets tbody', this.$el).append(self.templates.bettingRow( participant.get('champion').attributes ));
    });

    this.replayMatch();
  },

  replayMatch: function(){
    console.log(this.match);

    var self = this;
    var frames = this.match.get('timeline').get('frames');

    var $spriteList = $('.sprite-list', this.$el);

    var index = 0;
    var interval = setInterval(function(){
      console.log(index);
      var frame = frames.at(index);

      // do things

      if (index === 0){
        $spriteList.empty();
      }

      var participantFrames = frame.get('participantFrames');


      participantFrames.each(function(pFrame){

        var champion = self.match.get('participants').at(pFrame.get('participantId') - 1).get('champion');

        var templateOptions = {
          participantId : pFrame.get('participantId'),
          sprite        : champion.get('image').full,
          position      : self.normalizePosition(pFrame.get('position'))
        };

        if (index === 0){
          $spriteList.append(self.templates.sprite(templateOptions));
        }
        else {
          var id     = 'participant' + templateOptions.participantId,
              bottom = templateOptions.position.y,
              left   = templateOptions.position.x;

          $('#' + id, this.$el).css('bottom', bottom + '%').css('left', left + '%');
        }
      });

      // check interval
      index++;
      if(index === frames.length) {
        clearInterval(interval);
      }
    }, self.frameTime);

  },

  normalizePosition: function(position){
    var min = {x: -120, y: -120};
    var max = {x: 14870, y: 14980};
    var imageSize = { x: 256 , y: 256 };

    var x = position.x / (max.x + min.x) * 100,
        y = position.y / (max.y + min.y) * 100;

    return { x : x, y : y };

  },

  renderSprite: function(id){

  },

  newRoom: function() {
    var self = this;
    
    $.get( "/room", function( data ) {
      self.room   = new Challenge.Models.Room(data.room);
      self.user   = new Challenge.Models.User(data.user);
      self.socket = io();

      self.socket.emit('join', data);

      self.showLink();
    });
  },

  showLink: function(){
    var url = window.location.origin + '/join/' + this.room.get('id');
    $(this.el).append(this.templates.share({ link : url }));
  }

});