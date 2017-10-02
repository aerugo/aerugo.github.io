(function($) {

  $.plugin('enhanceLoading', function() {

    var self = this, $container, enabled, triggerEvents, updateWindowLocation, useAjaxParameter, scrollToTop, firstPopStateFired;

    function scrollToContainer() {
      if ($container.offset().top < $(window).scrollTop())
        $('html, body').animate({ scrollTop: $container.offset().top }, 400);
    }

    // Return version of `url` we can use for ajax loading (as opposed
    // to what we set as the page URL in the browser address bar)
    function urlForLoading(url) {
      var noHashURL = url.split('#')[0];
      return !useAjaxParameter ? noHashURL : noHashURL + (noHashURL.indexOf('?') === -1 ? '?' : '&') + 'ajax=true';
    };

    function doLoad(url, loadUpdatesLocation, doneHandler) {
      if (scrollToTop)
        scrollToContainer();
      window.nkEnhanceLoadingInProgress = true;
      $container.load(
        [urlForLoading(url), $container.selector + ' > *'].join(' '),
        function() {
          $(window).resize(); // update adaptive images
          if (updateWindowLocation && (loadUpdatesLocation !== false))
            history.pushState(null, null, url);
          if (!!doneHandler)
            doneHandler();
          window.nkEnhanceLoadingInProgress = false;
        }
      );
    };

    function onEvent(event) {
      event.preventDefault();
      if (!enabled)
        return;
      var $el = $(this);

      if ($el.is('a:not(.disabled)'))
        doLoad($el.attr('href'));
      else if ($el.is('input, select, form')) {
        var $closestForm = $el.closest('form');
        doLoad($closestForm.attr('action').replace(/^\./, '') + '?' + $closestForm.serialize());
      }
    };

    function mapFromQueryString(query) {
      var ret = {};
      var vars = query.replace(/^\?/, '').split('&');
      for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        pair[0] = decodeURIComponent(pair[0]);
        pair[1] = decodeURIComponent(pair[1]);
        if (typeof ret[pair[0]] === 'undefined')
          ret[pair[0]] = pair[1];
        else if (typeof ret[pair[0]] === 'string')
          ret[pair[0]] = [ret[pair[0]], pair[1]];
        else
          ret[pair[0]].push(pair[1]);
      }
      return ret;
    };

    function updateStaticTriggerElements() {
      var setInputCheckedState = function($inputEl, isChecked) {
        if ($inputEl.hasClass('enh-checkbox')) {
          $inputEl.enhanceCheckbox('check', isChecked);
        } else {
          if (isChecked)
            $inputEl.attr('checked', 'checked');
          else
            $inputEl.removeAttr('checked');
        }
      };
      var setSelectValue = function($selectEl, selectedValue) {
        var valueToApply = selectedValue;
        if (typeof selectedValue == 'undefined' || selectedValue === null)
          valueToApply = $selectEl.find('option:first').val();
        if ($selectEl.hasClass('enh-select')) {
          $selectEl.enhanceSelect('select', valueToApply);
        } else {
          $selectEl.find('option').removeAttr('selected');
          $selectEl.find('option[value='+valueToApply+']').attr('selected', 'selected');
        }
      };

      var queryParams = mapFromQueryString(window.location.search);
      $.each(triggerEvents, function(eventName, selector) {
        var $el = $(selector);
        var isInsideContainer = (0 < $container.find($el).length);
        var $form = $el.closest('form');
        if (isInsideContainer || !$form)
          return;
        // Disable loading while we are updating the form so that
        // this would not trigger reloads:
        enabled = false;
        // Update form state to match GET parameters
        $form.find('input, select').each(function(index, formItem) {
          $formItem = $(formItem);
          var qValue = queryParams[$formItem.attr('name')];
          if ($formItem.is('input[type=checkbox], input[type=radio]'))
            setInputCheckedState($formItem, (qValue === 'on'));
          else if ($formItem.is('select'))
            setSelectValue($formItem, qValue);
          $formItem.trigger('change');
        });
        enabled = true;
      });
    };

    function onPopState(event) {
      // ignore the first popstate (which is sent upon the initial page load),
      // because we already have the initial content on the page:
      if (firstPopStateFired) {
        doLoad(window.location.href, false, function() {
          updateStaticTriggerElements();
        });
      }
      firstPopStateFired = true;
    };

    this.options = {
      container: '',
      events: {},
      updateWindowLocation: true,
      useAjaxParameter: true,
      scrollToTop: false
    };

    var supportsHistoryAPI = !!(window.history && history.pushState);

    this.init = function($el) {
      $container = $(this.options.container);
      updateWindowLocation = supportsHistoryAPI && this.options.updateWindowLocation;
      useAjaxParameter = this.options.useAjaxParameter;
      scrollToTop = this.options.scrollToTop;
      triggerEvents = this.options.events;
      enabled = true;

      $.each(this.options.events, function(eventName, selector) {
        $el.on(eventName + '.' + self.namespace, selector, onEvent);
        $(selector).closest('form').addClass('enhanced-loading');
      });
      if (updateWindowLocation)
        $(window).on('popstate', onPopState);
    };

    this.destroy = function($el) {
      $.each(this.options.events, function(eventName, selector) {
        $el.off(eventName + '.' + self.namespace);
        $(selector).closest('form').removeClass('enhanced-loading');
      });
      if (updateWindowLocation)
        $(window).off('popstate', onPopState);
    };

  });

})(jQuery);
