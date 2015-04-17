/*!
 * riotapichallenge
 * Riot API Challenge
 * http://www.cristinashaver.com
 * @author Cristina Shaver
 * @version 1.1.0
 * Copyright 2015. MIT licensed.
 */
// TODO: console.image

window.Challenge = {
    Models: {},
    Collections: {},
    Views: {},
    init: function(){

    }
};

jQuery(document).ready(function () {
  
  $.ajaxSetup({
    contentType: "application/json; charset=utf-8"
  });

  // do things in here

  console.log('ohai');

  

  Challenge.Views.appView = new Challenge.Views.AppView();



});



Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};
Challenge.Views       = Challenge.Views || {};

Challenge.Views.AppView = Backbone.View.extend({
  
  el: "main",
  
  events: {},
  
  initialize: function () {
    this.render();

    console.log(Challenge.Models.Match);

    this.match = new Challenge.Models.Match();

    this.match.fetch();
  },
  
  render: function () {

  }

});

Challenge.Models      = Challenge.Models || {};
Challenge.Collections = Challenge.Collections || {};

(function (Backbone) {
    'use strict';

    // model
    Challenge.Models.Ban = Backbone.Model.extend({

      initialize: function(){
          
      },

      defaults: function(){
        return {
         
        };
      }

    });

    // collection
    Challenge.Collections.Bans = Backbone.Collection.extend({

      model: Challenge.Models.Ban,

    });
    
})(Backbone);

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