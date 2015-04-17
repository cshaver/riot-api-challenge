
Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Team = Backbone.Model.extend({

      initialize: function(){
        this.set({
          bans : new Challenge.Collections.Bans(this.get('bans')),
        });
      },

      defaults: function(){
        return {};
      }

    });

    // collection
    Challenge.Collections.Teams = Backbone.Collection.extend({

      model: Challenge.Models.Team,

    });
    
})(Backbone);