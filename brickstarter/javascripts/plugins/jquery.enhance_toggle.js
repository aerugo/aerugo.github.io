(function($){

  // ---------------------------------------------------------------------------

  $.plugin('enhanceToggle', function() {

    var $trigger, $target, targetSelector, originalHeight, options;

    function onTriggerClick(event) {
      var start = $target.height(),
        end = (start === 0) ? $target.height('auto').height() : 0;

      // don't jump to the anchor
      if (options.silent) event.preventDefault();

      $target.toggleClass(options.openedClassName);
      $trigger.toggleClass(options.activeClassName);

      // remove window hash if it matches the current target and
      // we're about to hide the target
      if (window.location.hash == targetSelector && start > 0) {
        window.location.hash = '';
        event.preventDefault();
      }

      // slide open or closed
      $target.height(start).animate({ height: end }, options.duration, options.easing, function() {
        // remove inline height after animation is done if target is open
        if (end > 0) $target.height('');
        options.callback();
      });
    }

    this.options = {
      openedClassName : 'enh-toggle-opened',
      activeClassName : 'enh-toggle-active',
      duration        : 250,
      easing          : 'eightyTwentyQuartOut',
      callback        : $.noop,
      silent          : false
    };

    this.init = function($el) {
      $trigger = $el;
      targetSelector = $trigger.attr('href');
      $target = $(targetSelector);
      originalHeight = $target.height();
      options = this.options;

      $target.height(0);
      $trigger.bind('click.' + this.namespace, onTriggerClick);

      // trigger toggle if the current location hash matches the selector
      if (window.location.hash == targetSelector) {
        $trigger.trigger('click.' + this.namespace);
      }
    };

    this.destroy = function($el) {
      $trigger.unbind('click.' + this.namespace);
      $target.height(originalHeight);
    };

  });

})(jQuery);
