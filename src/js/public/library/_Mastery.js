
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Mastery = Backbone.Model.extend({

      defaults: function(){
        return {};
      }

    });

    // collection
    Challenge.Collections.Masteries = Backbone.Collection.extend({

      model: Challenge.Models.Mastery,

    });
    
})(Backbone);