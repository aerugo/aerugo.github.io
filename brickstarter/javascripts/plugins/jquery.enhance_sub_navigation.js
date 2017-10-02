(function($){
$('.sub-navigation')
   // test the menu to see if all items fit horizontally
   .bind('responsiveNavigation', function(){
      var nav = $(this),
      items = nav.find('li');

      nav.removeClass('drop-menu');

      // when the nav wraps under the logo, or when options are stacked, display the nav as a menu
      if ($(items[items.length-1]).offset().top > $(items[1]).offset().top ) {
         // show the menu -- add a class for scoping menu styles
        nav.addClass('drop-menu');

        // Ugly hack to get the nav showing also in prototype where there's not current page parent logic for subpages
        if ($('.sub-navigation').find('li.active').length<1) {
          $('.sub-navigation .wrapper ul').prepend('<li class="active"><a>Navigation</a>');
        }

        $('.sub-navigation').find('li.active').unbind('click').bind('click', function(event){
          event.preventDefault();
          $(this).parent().toggleClass('expanded');
          return false;
         });
       }
       else
         $('.sub-navigation').find('li.active').unbind("click");
   });

   // ...and update the nav on window events
   $(window).bind('load resize orientationchange', function(){
      $('.sub-navigation').trigger('responsiveNavigation');
   });

})(jQuery);
