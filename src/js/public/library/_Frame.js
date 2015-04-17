
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Frame = Backbone.Model.extend({

      initialize: function(){
        this.set({
          participantFrames : new Challenge.Collections.ParticipantFrames(_.map(this.get('participantFrames'), function(pf) { return pf; })),
          events            : new Challenge.Collections.Events(this.get('events'))
        });
      },

      defaults: function(){
        return {
         
        };
      }

    });

    // collection
    Challenge.Collections.Frames = Backbone.Collection.extend({

      model: Challenge.Models.Frame,

    });
    
})(Backbone);