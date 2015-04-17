
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.User = Backbone.Model.extend({

      defaults: function(){
        return {};
      },

    });
    
})(Backbone);