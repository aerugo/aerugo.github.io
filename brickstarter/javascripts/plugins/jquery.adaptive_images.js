(function($) {

  $.fn.adaptiveImages = function(options) {

    var $window = this, sizes = options || [];

    sizes.sort(function(a, b) {
      return b.value - a.value;
    });

    var selector = $.map(sizes, function(item) {
      return 'img[data-' + item.key + ']';
    }).join(', ');

    if (sizes.length === 0) return;

    var onResize = function() {
      var width = $window.width(), prop = 'original';

      $(selector).filter(':not(img[data-original])').each(function() {
        $(this).attr('data-original', $(this).attr('src'));
      });

      $.each(sizes, function(i, item) {
        if (width >= item.value) {
          prop = item.key;
          return false;
        }
      });

      $('img[data-' + prop + ']').each(function() {
        var $img = $(this), src = $img.attr('data-' + prop);
        if ($img.attr('src') !== src) {
          $img.attr('src', src);
        }
      });
    };

    $window.resize($.debounce(onResize, 10)).resize();

  };

})(jQuery);
