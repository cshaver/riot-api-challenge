
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.ParticipantFrame = Backbone.Model.extend({

      initialize: function(){
      },

      defaults: function(){
        return {
         
        };
      }

    });

    // collection
    Challenge.Collections.ParticipantFrames = Backbone.Collection.extend({

      model: Challenge.Models.ParticipantFrame,

    });
    
})(Backbone);