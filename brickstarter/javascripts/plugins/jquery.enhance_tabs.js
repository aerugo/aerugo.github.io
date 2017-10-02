(function($) {

  $.plugin('enhanceTabs', function() {

    this.options = {

    };

    this.init = function($el) {
      var $tabs     = $el.find('.tabs'),
          $tabLinks = $tabs.find('li > a');

      var $tabContents = $($tabLinks.map(function() {
        return '#' + this.href.split('#')[1];
      }).get().join(',')).hide();

      $tabLinks.bind('click', function() {
        var $target = $el.find('#' + this.href.split('#')[1]);
        var $activeTabLink = $tabLinks.filter('.active').removeClass('active');

        if ($activeTabLink.length) {
          var activeTarget = $activeTabLink.get(0).href.split('#')[1];
          $('#' + activeTarget).hide();
        }

        $(this).addClass('active');
        $target.show();
      });

      // initially show either ...
      var $initActiveTabLink;

      // marked as active
      $initActiveTabLink = $tabLinks.filter('.active');

      // or through location hash
      if (!$initActiveTabLink.length) {
        var $active = $tabLinks.filter('[href=' + window.location.hash + ']');
        if ($active.length) {
          $initActiveTabLink = $active;
        }
      }

      // or simply the first one
      if (!$initActiveTabLink.length) {
        $initActiveTabLink = $tabLinks.first();
      }

      $initActiveTabLink.trigger('click');
    };

    this.destroy = function($el) {
      var $tabLinks = $el.find('ul.tabs li > a').removeClass('active');
      $tabLinks.unbind('click');
    };

  });

})(jQuery);
