(function ($, window, document, undefined) {

  $.ajaxSetup({
    contentType: "application/json; charset=utf-8"
  });

  $(function () {
    // do things in here

    console.log('hi1');

    // clean();
    // function clean() {
    //   $.get( "/cleaner", function( data ) {
    //     console.log( data );
    //     clean();
    //   });
    // }

    migrate();

    function migrate(){
      $.get("/migrate", function( data ){
        console.log('done');
        migrate();
      });
    }
   

    

    
    // $.get( "/match", function( data ) {
    //   console.log( JSON.parse(data) );
    // });

    // $.post( "/match", JSON.stringify({ func: "getNameAndTime" }), function( data ) {
    //   console.log(data);
    // }, "json");

  });

})(jQuery, window, document);
