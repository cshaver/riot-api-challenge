
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Event = Backbone.Model.extend({

      initialize: function(){
          
      },

      defaults: function(){
        return {
         
        };
      }

    });

    // collection
    Challenge.Collections.Events = Backbone.Collection.extend({

      model: Challenge.Models.Event,

    });
    
})(Backbone);