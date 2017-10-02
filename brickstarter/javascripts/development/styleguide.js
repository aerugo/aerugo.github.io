$(function() {

  function resizeWithDelay(iframe) {
    setTimeout(function() {
      $(iframe.get(0).contentWindow).resize();
    }, 200);
  };

  function setActive(hash) {

    $('#sidebar a[href="' + hash + '"]').first().addClass('selected').parent().siblings().find('a').removeClass('selected');

    var $preview = $('#preview'),
      $iframe = $preview.find('iframe'),
      src = 'component_preview.html?component=' + hash.replace('#', '').replace('-', '_', 'g');

    if ($preview.is(':visible') && $iframe.attr('src') !== src) {
      $iframe.attr('src', src).fadeOut('fast');
      $('#preview h2')
        .html($(hash).find('h2').html())
        .find('a')
        .removeClass()
        .addClass('close-preview')
        .html('&larr; Close preview');
    };

    if (history.pushState && window.location.hash !== hash) {
      history.pushState(null, null, hash);
    }
  }

  // Resize iframes to match their content
  $('iframe').on('load', function() {
    var $iframe = $(this).fadeIn('fast');
    $(this.contentWindow).resize(function() {
      $iframe.height(this.$ ? this.$('body').height() : $('#main').height() - 50);
    });
    resizeWithDelay($iframe);
  });

  // Find out what we're looking at based on the scroll position
  $('#documentation').on('scroll', function() {
    var scrollTop = $(this).scrollTop();
    $('#documentation .component').each(function() {
      var $el = $(this);
      if (this.offsetTop + $el.height() > scrollTop) {
        setActive('#' + $el.attr('id'));
        return false;
      }
    });
  });

  // Handle sidebar navigation clicks
  $('#sidebar').on('click', 'ul a', function() {
    setActive($(this).attr('href'));
  });

  $('#sidebar').on('click', 'a.toggle-content', function() {
    $(this).toggleClass('selected');
  });

  // Toggle markup/styles visibility
  $('#documentation').on('click', '.component h3', function() {
    var $parent = $(this).parent('.markup, .styles');
    var klass = $parent.hasClass('open') ? 'closed' : 'open';
    $parent.removeClass('open closed').addClass(klass);
    return false;
  });

  // Open file in TextMate
  $('#documentation').on('click', 'a.open-file', function(event) {
    event.stopPropagation();
  });

  // Open size preview
  $('#documentation').on('click', 'a.open-preview', function() {
    $('#preview, #preview iframe').show();
    setActive($(this).attr('href'));
  });

  // Close size preview
  $('#preview').on('click', 'a.close-preview', function() {
    $('#preview, #preview iframe').hide();
    return false;
  });

  // Change preview size
  $('#preview').on('mouseover', 'ul.sizes a[data-width]', function(event) {
    var $link = $(this);
    var $iframe = $('#preview iframe');
    $iframe.stop().animate({ width: $link.data('width') }, 300, function() {
      resizeWithDelay($iframe);
      $link.addClass('selected').parent().siblings().find('a').removeClass('selected');
    });
  });

  // Prevent page jump & select one size by default
  $('#preview ul.sizes a[data-width]').click(false).eq(2).mouseover();

});
