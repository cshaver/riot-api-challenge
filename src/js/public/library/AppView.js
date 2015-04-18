
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};
Challenge.Views       = Challenge.Views || {};

// begins other views
Challenge.Views.AppView = Backbone.View.extend({
  
  el: "main",
  
  events: {
  },

  templates: {
    main : JST['main']
  },

  initialize: function (options) {
    this.render()

    Challenge.Views.socketView = new Challenge.Views.SocketView(options);
    Challenge.Views.matchView = new Challenge.Views.MatchView(options);
  },
  
  render: function () {
    $(this.el).html(this.templates.main());
  }

});