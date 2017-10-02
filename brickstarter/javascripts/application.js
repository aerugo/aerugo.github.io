$(function() {

  $('body').addClass('js');

  function initialize(content, zoomLevel, coordinates) {
    var myOptions = {
      zoom: zoomLevel,
      center: new google.maps.LatLng(coordinates[0], coordinates[1]),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    setMarkers(map, content, content);
  }

  var projects = [
    ['1', 60.174306, 24.993896, 1],
    ['2', 60.228903, 25.125732, 2],
    ['3', 60.179770, 25.136719, 3],
    ['4', 60.223447, 25.070801, 4],
    ['5', 60.228903, 25.158691, 5],
    ['6', 60.370429, 24.653320, 6],
    ['7', 60.348696, 23.862305, 7],
    ['8', 60.247990, 23.021851, 8],
    ['9', 60.215262, 23.774414, 9],
    ['10', 60.217991, 24.708252, 10],
    ['11', 60.237084, 24.845581, 11],
    ['12', 60.242538, 24.938965, 12],
    ['13', 60.174306, 24.669800, 13],
    ['14', 60.177038, 24.889526, 14],
    ['15', 61.454521, 23.939209, 15],
    ['16', 61.433515, 23.807373, 16],
    ['17', 60.457218, 22.324219, 17],
    ['18', 60.576175, 21.895752, 18],
    ['19', 60.326948, 22.412109, 19],
    ['20', 60.217991, 20.236816, 20]
  ];

  var projectDetails = [
    ['1', 60.168617, 24.949393, 1],
    ['2', 60.169450, 24.943643, 2],
    ['4', 60.170122, 24.939909, 4],
    ['5', 60.166696, 24.938900, 5],
    ['3', 60.16629, 24.943643, 3, '/images/layout/icons/yn_focused.png']
  ];

  function setMarkers(map, locations, content) {
    var image = new google.maps.MarkerImage('/images/layout/icons/yn.png',
        new google.maps.Size(33, 32),
        new google.maps.Point(0,0),
        new google.maps.Point(0, 32));

    for (var i = 0; i < content.length; i++) {
      var project = content[i];
      var myLatLng = new google.maps.LatLng(project[1], project[2]);
      if(project[4] !== undefined) {
        image = new google.maps.MarkerImage(project[4],
            new google.maps.Size(54, 54),
            new google.maps.Point(0,0),
            new google.maps.Point(0, 54));
      }
      var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: image,
          title: project[0],
          zIndex: project[3]
      });
    }
  }

  if($('body').hasClass('index')) {
    initialize(projects, 7, [61.106098, 24.301758]);
  }

  if($('body').hasClass('project-details')) {
    initialize(projectDetails, 16, [60.168297, 24.943160]);
  }

  var originalDescriptionHeight = $('p.truncate').outerHeight(),
      truncatedDescriptionHeight = 4;
  
  $('p.truncate').css({ 'height': truncatedDescriptionHeight + 'em' });

  $('p.truncate').dotdotdot({
    watch: true
  });

  $('a.grow-truncated').on('click', function(e) {
    if(!$(this).hasClass('open')) {
      $('p.truncate').animate({
        height: parseInt(originalDescriptionHeight*1, 10)+'px'
      }, 250, 'easeInOutExpo', function() {
        $('p.truncate').trigger('update');
        $('a.grow-truncated').addClass('open');
        console.log('oh: ' + $('p.truncate').outerHeight() + ' - th: ' + originalDescriptionHeight);
      });
    } else {
      $('p.truncate').animate({
        height: truncatedDescriptionHeight + 'em'
      }, 250, 'easeInOutExpo', function() {
        $('p.truncate').trigger('update');
        $('a.grow-truncated').removeClass('open');
      });
    }
    e.preventDefault();
  });

  $('section.page-navigation').stickyNavigation();
  
  // Kill some links
  $('section.get-involved').on('click', 'a', function(e) {
    e.preventDefault();
  })
  
  $('ul.social-media').on('click', 'li a', function(e) {
    e.preventDefault();
  })
  
  // Show/hide the notification

  var notificationHeight = $('section.notification').outerHeight();
  $('section.notification').css({ 'height': '0' });

  if($.cookie('notification') != 'closed') {
    $('section.notification').delay(1500).animate({ 'height': notificationHeight }, 250, 'easeInOutQuart');
  }

  $('section.notification').on('click', 'a.close', function(event) {
    $('section.notification').animate({ 'height': '0' }, 250, 'easeInOutQuart', function() {
      $('section.notification').remove();
      $.cookie('notification', 'closed');
    });
    event.preventDefault();
  });

  // Project list progress animation
  $('section.project-list > .wrapper > ul > li').each(function() {
    //console.log($(this).find('.funding-info > ul > li:first-child > span').not('.new').html());
    $(this).find('.visuals .progress').stop().animate({ 'width': $(this).find('.funding-info > ul > li:first-child > em').not('.new').html() }, 7500, 'easeInOutQuart');
  });

  // Project details funding status animations
  var growthSimulationInterval;
  $('section.funding-status .wrapper .money .current').css({ 'width': '5.125em' }).stop().animate({ 'width': '44%' }, 7500, 'easeInOutQuart',
    function() {
      console.log('animation done, going into simulation');
      growthSimulationInterval = setInterval(function() {
        simulateFunding();
      }, 2000);
    });
  $('section.funding-status .wrapper .time').css({ 'width': '7em' }).stop().animate({ 'width': '40%' }, 7500, 'easeInOutQuart');

  $.fn.digits = function(){
  return this.each(function(){
    $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
  });
  };

  var currentWidth = parseInt(44, 10);
  var maxWidth = parseInt(75, 10);
  var growth;
  var i = 1;
  var currentDays = parseInt(24, 10);
  var currentMoney = parseInt(22145, 10);

  function simulateFunding() {
    i++;
    growth = Math.floor(1 + Math.floor(Math.random() * 9));
    currentWidth += parseInt(growth, 10);
    currentMoney += parseInt(Math.floor(growth*200), 10);
    currentDays -= parseInt(Math.floor(growth/4), 10);

    if(currentWidth > maxWidth) {
      clearInterval(growthSimulationInterval);
    } else {
      $('section.funding-status .wrapper .money .current').stop().animate({ 'width': '+=' + growth + '%' });
      $('section.funding-status .wrapper .money .label span.amount').html(currentMoney);
      $('section.funding-status .wrapper .money .label span.amount').digits();
      if(i === 3) {
        $('section.funding-status .wrapper .time').stop().animate({ 'width': '+=' + growth + '%' });
        $('section.funding-status .wrapper .time .label span.amount').html(currentDays);
        $('section.funding-status .wrapper .time .label span.amount').digits();
        i = 1;
      }
    }
  }

  // Language toggle
  $('header').on('click', 'a.language', function(event) {
    $('ul#languages').toggle();
    event.preventDefault();
  });

  $('header').on('click', 'ul#languages > li > a', function(event) {
    $('ul#languages').toggle();
    event.preventDefault();
  });

  // Hover interactions
  $('div.actions, h1').on('mouseenter', 'a', function() {
    $(this).transition({
        scale: '0.9'
    }, 175, 'in-out');
  }).on('mouseleave', 'a', function() {
    $(this).transition({
        scale: '1'
    }, 175, 'in-out');
  });

  $('li.action').on('mouseenter', 'a', function() {
    $(this).find('span').transition({
        scale: '1.2'
    }, 175, 'in-out');
  }).on('mouseleave', 'a', function() {
    $(this).find('span').transition({
        scale: '1'
    }, 175, 'in-out');
  });

  // Masonry
  $('section.project-list > .wrapper > ul').delay(2000).masonry({
    // options
    itemSelector : 'li.on-going, li.new',
    columnWidth: function( containerWidth ) {
      if($(window).width()<1024) {
        return containerWidth / 2;
      } else {
        return containerWidth / 3;
      }
    }
  });
  // Force masonry on, web font loading via JS seems to cause a delay in height calculations
  // this making masonry work only after the first resize or with a small delay
  $(window).resize();
});
