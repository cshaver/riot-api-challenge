
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Participant = Backbone.Model.extend({

      initialize: function(){
        this.set({
          masteries : new Challenge.Collections.Masteries(this.get('masteries')),
          runes     : new Challenge.Collections.Runes(this.get('runes'))
        });
      },

      defaults: function(){
        return {
         
        };
      }

    });

    // collection
    Challenge.Collections.Participants = Backbone.Collection.extend({

      model: Challenge.Models.Participant,

    });
    
})(Backbone);