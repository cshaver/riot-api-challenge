
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Timeline = Backbone.Model.extend({

      initialize: function(){
        this.set({
          frames : new Challenge.Collections.Frames(this.get('frames')),
        });
      },

      defaults: function(){
        return {
         
        };
      }

    });

    // collection
    Challenge.Collections.Timelines = Backbone.Collection.extend({

      model: Challenge.Models.Timeline,

    });
    
})(Backbone);