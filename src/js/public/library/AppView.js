
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};
Challenge.Views       = Challenge.Views || {};

Challenge.Views.AppView = Backbone.View.extend({
  
  el: "main",
  
  events: {
    'click #newRoom' : 'newRoom',
    'click #replay'  : 'replayMatch',
  },

  templates: {
    main       : JST['main'],
    share      : JST['share'],
    sprite     : JST['sprite'],
    table      : JST['table'],
    bettingRow : JST['betting-row']
  },

  room: null,
  socket: null,
  frameTime: 100,

  initialize: function () {
    this.render()

    this.match = new Challenge.Models.Match();

    var self = this;

    this.socket = io();

    this.socket.on('users update', function(users){
      self.renderUsers(users);
    });

    this.match.fetch({
      success: function(model, response){
        console.log(model);
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

    $('.table', this.$el).append(this.templates.table());

    var participants = this.match.get('participants');

    participants.each(function(participant, index){
      var $teamTable = $('.bets.team1 tbody', this.$el);
      if ((index + 1) > (participants.length / 2)){
        $teamTable = $('.bets.team2 tbody', this.$el);
      }
      $teamTable.append(self.templates.bettingRow( $.extend({}, participant.attributes, participant.get('champion').attributes) ));
    });
  },

  renderUsers: function(users){
    // lol not in el what is wrong with you
    $('.users').html(users);
  },

  replayMatch: function(){
    console.log(this.match);

    var self = this;
    var frames = this.match.get('timeline').get('frames');

    var $spriteList = $('.sprite-list', this.$el);

    var index = 0;
    var interval = setInterval(function(){
      var frame = frames.at(index);

      // do things

      if (index === 0){
        $spriteList.empty();
      }

      var participantFrames = frame.get('participantFrames');
      var eventFrames       = frame.get('events');

      self.updateSpritePositions(participantFrames, index);
      self.updateScoreTable(eventFrames);

      // check interval
      index++;
      if(index === frames.length) {
        clearInterval(interval);
      }
    }, self.frameTime);

  },

  updateScoreTable: function(eventFrames){
    // console.log(eventFrames);

    eventFrames.each(function(eFrame){
      var eventType = eFrame.get('eventType');
      
      if (eventType === 'CHAMPION_KILL'){

        // numbers in the rows shouldnt be canonical BUT HEY ITS 8AM
        var idPrefix = 'participantScore';

        // add kill to killerId
        var killerId = idPrefix + eFrame.get('killerId'),
            $killer  = $('#' + killerId, this.$el);

        // add death to victimId
        var victimId = idPrefix + eFrame.get('victimId'),
            $victim  = $('#' + victimId, this.$el);

        // add assist to assistingParticipantIds
        var $assists = $();
        _.each(eFrame.get('assistingParticipantIds'), function(id){
          $assists = $assists.add($('#' + idPrefix + id, this.$el));
        });

        $('.kills',  $killer).text( parseInt($('.kills',  $killer).text()) + 1);
        $('.deaths', $victim).text( parseInt($('.deaths', $victim).text()) + 1);

        $assists.each(function(){
          var cell = $(this).find('.assists');

          cell.text( parseInt( cell.text() ) + 1 );
        });

      }
    });
  },

  updateSpritePositions: function(participantFrames, index){
    var self = this;
    var $spriteList = $('.sprite-list', this.$el);

    // update sprite positions from participant frames
    participantFrames.each(function(pFrame){

      if (!_.isUndefined(pFrame.get('position'))){
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
          var id     = 'participantSprite' + templateOptions.participantId,
              $el    = $('#' + id, this.$el),
              bottom = templateOptions.position.y,
              left   = templateOptions.position.x;

          $el.animate({
            bottom : bottom,
            left   : left
          }, self.frameTime)
        }
      }
    });
  },

  normalizePosition: function(position){
    var min = {x: -120, y: -120};
    var max = {x: 14870, y: 14980};
    var imageSize = { x: 256 , y: 256 };

    console.log(position);

    var x = position.x / (max.x + min.x) * imageSize.x,
        y = position.y / (max.y + min.y) * imageSize.y;

    return { x : x, y : y };

  },

  renderSprite: function(id){

  },

  newRoom: function() {
    var self = this;
    
    $.get( "/room", function( data ) {
      self.room   = new Challenge.Models.Room(data.room);
      self.user   = new Challenge.Models.User(data.user);

      console.log('hi');
      self.socket.emit('join', data);

      self.showLink();
    });
  },

  showLink: function(){
    var url = window.location.origin + '/join/' + this.room.get('id');
    $(this.el).append(this.templates.share({ link : url }));
  }

});