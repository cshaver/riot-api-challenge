
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Match = Backbone.Model.extend({

      urlRoot: '/match',
      url: '/match',

      defaults: function(){
        return {};
      },

      parse:  function(data, options){
        data.participants = new Challenge.Collections.Participants(data.participants);
        data.teams        = new Challenge.Collections.Teams(data.teams);
        data.timeline     = new Challenge.Models.Timeline(data.timeline);
        console.log(data);
        return data;
      }

    });

    // collection
    Challenge.Collections.Matches = Backbone.Collection.extend({

      url: '/match',
      model: Challenge.Models.Match,

    });
    
})(Backbone);