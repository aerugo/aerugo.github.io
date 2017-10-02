$(function() {

  var $helper = $('<div/>').appendTo($('body')), active = readCookie('active-dev-helper');

  function createCookie(name, value, days) {
    var date = new Date(), expires = '';
    if (days) {
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    createCookie(name,'',-1);
  }

  function show(what) {

    if (!$helper.is(':empty') && what == active) {
      $helper.empty();
      what = null;
      $(window).off('.dev-helper');
      eraseCookie('active-dev-helper');
    }

    active = what;
    createCookie('active-dev-helper', what, 1);

    if (what == 'shortcuts') {
      $helper.load('/_sandbox/page_list/index.html', function() {
        $helper
          .find('ul')
          .css({
            'position'   : 'fixed',
            'width'      : '100%',
            'top'        : 0,
            'bottom'     : 0,
            'overflow'   : 'auto',
            'margin'     : 0,
            'background' : 'rgba(0, 0, 0, 0.8)',
            'padding'    : 0,
            'z-index'    : 9999,
            'list-style' : 'none'
          })
          .addClass('go-to')
          .find('li')
          .css({
            'border-bottom' : '1px solid #aaa',
            'padding'       : '0 15px 1.5em 15px'
          })
          .find('a')
          .css({
            'color'           : '#fff',
            'text-decoration' : 'none',
            'background'      : 'none',
            'outline'         : 'none'
          })
          .end()
          .find('strong')
          .css({
            'white-space'   : 'nowrap',
            'overflow'      : 'hidden',
            'float'         : 'left',
            'text-overflow' : 'ellipsis',
            'width'         : '85%',
            'direction'     : 'rtl',
            'text-align'    : 'left'
          })
          .end()
          .find('input[type=search]')
          .css({
            'margin'     : '1.5em 0 0',
            'padding'    : '0.3em 0 0.3em 8px',
            'background' : 'rgba(0, 0, 0, 0.75)',
            'width'      : '325px',
            'color'      : 'white'
          })
          .bind('keyup click', function() {
            var needle = $(this).val(),
            $pages = $helper.find('li').show();
            if (needle.length > 0) {
              $pages.not(':first').find('a:not(:contains(' + needle + '))').parent().hide();
            }
          })
          .focus();
      });
    } else if (what == 'info') {
      var onResize = function() {
        var breakpoint = window.getComputedStyle(document.body,':after').getPropertyValue('content');
        var size = $(window).width() + 'x' + $(window).height();
        $helper.find('div').html(breakpoint + '<br/><small>' + size + '</small>');
      };
      $helper.html('<div></div>').find('div').css({
        'background' : 'rgba(0, 0, 0, 0.8)',
        'position'   : 'fixed',
        'top'        : 0,
        'left'       : 0,
        'padding'    : '0.5em',
        'z-index'    : 9999,
        'color'      : '#fff',
        'font-size'  : '0.8em',
        'text-align' : 'center'
      });
      $(window).on('resize.dev-helper', $.debounce(onResize, 10)).trigger('resize');
    }
  }

  // Toggle file list
  $(document).bind('keyup', function(event) {
    if (event.which == 73 && event.altKey) {
      show('shortcuts');
    } else if (event.which == 79 && event.altKey) {
      show('info');
    }
  });

  if (active == 'info') {
    show(active);
  }

});

