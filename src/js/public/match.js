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

