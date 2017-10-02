(function($) {

  $.plugin('enhanceAnchors', function() {

    this.options = {

    };

    this.init = function($el) {
      var $filters = $el.find('li > a');

      var $targets = $($filters
        .map(function() {
          if (!!(targetID = this.href.split('#')[1])) {
            return '#' + targetID;
          }
        })
        .get()
        .join(',')
        .replace(/(,)+/g, ',')
      ).hide();

      $filters.bind('click', function() {
        var target  = this.href.split('#')[1],
          $target = $targets.hide();

        $filters
          .filter('.active')
          .removeClass('active');

        if (!!target) {
          $target = $('#' + target);
        }

        $(this).addClass('active');
        $target.show();
      });

      // initially show either ...
      var $initActiveFilter;

      // marked as active
      $initActiveFilter = $filters.filter('.active');

      // or through location hash
      if (!$initActiveFilter.length) {
        var $active = $filters.filter('[href=' + window.location.hash + ']');
        if ($active.length) {
          $initActiveFilter = $active;
        }
      }

      // or simply the first one
      if (!$initActiveFilter.length) {
        $initActiveFilter = $filters.filter('[href=#]');
      }

      $initActiveFilter.trigger('click');
    };

    this.destroy = function($el) {

    };

  });

})(jQuery);
