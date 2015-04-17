// get match ids

(function ($, window, document, undefined) {

  'use strict';

  $(function () {
    // do things in here

  });

})(jQuery, window, document);

var api_key    = 'API_KEY',
    output     = $('textarea'),
    message    = $('.message');

var getMatchIds = function() {
  // do things in here

  // epochStart = 1427865900,
  var epochStart = 1428213300,
      timer      = 1001;

  getData(epochStart);

  function getData(epoch){
    $.ajax({
      url: "https://na.api.pvp.net/api/lol/na/v4.1/game/ids?beginDate=" + epoch + "&api_key=" + api_key + ""
    }).done(function( data ) {
      append(data);
      setTimeout(function(){
        message.html(epoch);
        getData(epoch + 300);
      }, timer);
    }).fail(function( data, something ) {
      // message.html(data);
    });
  }

  function append(data){
    output.val((output.val() + data + ',').trim());
  }

};