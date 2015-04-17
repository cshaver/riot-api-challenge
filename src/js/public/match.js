// TODO: console.image

window.Challenge = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function(){

    }
};

jQuery(document).ready(function () {
  
  $.ajaxSetup({
    contentType: "application/json; charset=utf-8"
  });

  // do things in here

  console.log('ohai');

  //define our new instance of router
  Challenge.Routers.router = new Challenge.Routers.Router();

  // use html5 History API
  Backbone.history.start({pushState: true}); 

});

