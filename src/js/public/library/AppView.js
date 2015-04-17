
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};
Challenge.Views       = Challenge.Views || {};

Challenge.Views.AppView = Backbone.View.extend({
  
  el: "main",
  
  events: {},
  
  initialize: function () {
    this.render();

    console.log(Challenge.Models.Match);

    this.match = new Challenge.Models.Match();

    this.match.fetch();
  },
  
  render: function () {

  }

});