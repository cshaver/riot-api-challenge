
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Rune = Backbone.Model.extend({

      initialize: function(){
          
      },

      defaults: function(){
        return {
         
        };
      }

    });

    // collection
    Challenge.Collections.Runes = Backbone.Collection.extend({

      model: Challenge.Models.Rune,

    });
    
})(Backbone);