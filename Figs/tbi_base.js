/* name     TBI initialize basic js functionality
 * author   Richard Neuboeck <hawk@tbi.univie.ac.at>
 * web      http://www.tbi.univie.ac.at/~hawk
 */

// minimum employee slider height
var slidermin = "50px";

// employee slider animation
function teamSlider(onoff) {
  if ($(".slider").length == 0) { return; }
  if (onoff === "on") {
    $(".slider").each(function() {
      var cur = $(this);
      if (!cur.attr("employee_h")) {
        cur.attr("employee_h", cur.height());
      }
      cur.css("height", slidermin);
      cur.css("border-bottom", "1px solid rgb(210,210,210)");
      cur.unbind('mouseenter mouseleave');
      
      // WAI fix to focus the surrounding div
      cur.attr("tabindex", "0");
      cur.focus(function() {
        $(this).css("background-image", "url('/images/base/down_gry.png')");
        $(this).css("border-bottom", "none");
        $(this).animate({ height: $(this).attr("employee_h") }, { duration: "fast" });
      });
      
      var hoverConfig = {
        over: function() {
          $(this).css("background-image", "url('/images/base/down_gry.png')");
          $(this).css("border-bottom", "none");
          $(this).animate({ height: $(this).attr("employee_h") }, { duration: "fast" });
        },
        timeout: 500,
        out: function() {
          $(this).delay(200).animate({ height: slidermin }, { duration: "fast", complete: 
            function() {
              $(this).css("background-image", "url('/images/base/down_red.png')");
              $(this).css("border-bottom", "1px solid rgb(210,210,210)");
            }
          }
        )}
      }
      
      cur.hoverIntent(hoverConfig);
    });
  } else {
    $(".slider").each(function() {
      $(this).css("height", "auto"); 
      $(this).css("border-bottom", "none");
      $(this).unbind("mouseenter mouseleave");
    });
  }
}

// google map stuff for TBI location
function gmapTBIInit() {
  if ($("#gmapTBI").length == 0 || $("script[src*='maps.googleapis']").length == 0) { return; }
  try {
    var latlngTBI = new google.maps.LatLng(48.2185350, 16.35781820);
    var mapOptions = {
      center: latlngTBI,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("gmapTBI"), mapOptions);
    
    var markerTBI = new google.maps.Marker({
      position: latlngTBI,
      title: "Institute for Theoretical Chemistry"
    });
    markerTBI.setMap(map);
    
    var infoStr = "<b>Institute for Theoretical Chemistry</b><br><small>Währingerstraße 17<br/>1090 Wien";
    var infoWindow = new google.maps.InfoWindow({ 
      content: infoStr,
      position: latlngTBI
    });
    google.maps.event.addListener(markerTBI, 'click', function() { infoWindow.open(map, markerTBI); });
    infoWindow.open(map);
  } catch(err) {
    console.log("gmapTBI initialization failed! (" + err + ")");
  }
}

function gmapCollaborationInit() {
  if ($("#gmapCollaboration").length == 0 || $("script[src*='maps.googleapis']").length == 0) { return; }
  // position of the TBI
  var latlngTBI = new google.maps.LatLng(48.2185350, 16.35781820);

  // google map
  var map = {};

  // single global info window
  var info = new google.maps.InfoWindow({
    content: 'foo'
  });

  // initialize map
  google.maps.event.addDomListener(window, 'load', function() {
    var mapOptions = {
      center: latlngTBI,
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      //mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById("gmapCollaboration"), mapOptions);

    // create TBI marker
    var markerTBI = new google.maps.Marker({
      position: latlngTBI,
      title: "Institute for Theoretical Chemistry",
      //animation: google.maps.Animation.DROP
      map: map
    });

    // position marker after 2sec
    //setTimeout(function() { markerTBI.setMap(map); }, 2000);
  });

  // get google spread sheet data
  $.getJSON("https://spreadsheets.google.com/feeds/list/1cG9Pb8ioyR5fKh91usCnG2e_wIPCQFIdUe7AZPajsBI/od6/public/values?alt=json", function(data) {
    var markers = [];
    var count = 0;
    // process data
    $.each(data.feed.entry, function(key, val) {
      // select image according to group entry
      var tmpImage = '';
      switch (parseInt(val.gsx$group.$t)) {
        case 1:
          tmpImage = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
          break;
        case 2:
          tmpImage = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/yellow-dot.png';
          break;
        case 3:
          tmpImage = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png';
          break;
        default:
          tmpImage = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
      }
      // create marker array object
      markers.push({
        id: count,
        title: val.gsx$institution.$t,
        latitude: val.gsx$latitude.$t,
        longitude: val.gsx$longitude.$t,
        address: val.gsx$address.$t,
        description: val.gsx$description.$t,
        link: val.gsx$link.$t,
        group: parseInt(val.gsx$group.$t),
        mark: new google.maps.Marker({
          position: new google.maps.LatLng(parseFloat(val.gsx$latitude.$t), parseFloat(val.gsx$longitude.$t)),
          title: val.gsx$institution.$t,
          animation: google.maps.Animation.DROP,
          icon: tmpImage,
          //map: map
        }),
        path: new google.maps.Polyline({
          path: [ new google.maps.LatLng(parseFloat(val.gsx$latitude.$t), parseFloat(val.gsx$longitude.$t)), latlngTBI ],
          geodesic: true,
          strokeColor: '#960000',
          strokeOpacity: 0.5,
          strokeWeight: 2
        })
      });
      count++;
    });

    // sort markers alphabetically, position and create table
    $.each(markers.sort(function(a, b) {
      if (a.title > b.title)
        return 1;
      if (a.title < b.title)
        return -1;
      if (a.title = b.title)
        return 0;
    }), function(index, value) {
      // create pin and line with a nice effect (drop + pause)
      setTimeout(function() { 
        value.mark.setMap(map);
        setTimeout(function() { value.path.setMap(map); }, 300);
        // show info window on click
        google.maps.event.addListener(value.mark, 'click', function() {
          info.setContent('<div><a href="' + value.link + '">' + value.title + '</a><br/><small>' + value.description + '</small></div>');
          info.close();
          info.open(map, value.mark);
        });
        //console.log(value.mark.title + " " + value.latitude + " " + value.longitude);
      }, index * 200);

      // prepare and add table row
      var row = '<tr id="collab' + value.id + '"><td><a href="' + value.link + '">' + value.title + '</td><td><small>' + value.description + '</small></td></tr>';
      $(".collaboration").append(row);
      // make tables nicer
      $("table").each(function() {
        if ($("tr", this).length > 2) {
          $("tr:odd", this).addClass("odd");
        }
      });
      google.maps.event.addDomListener(document.getElementById("collab" + value.id), 'click', function() {
        info.setContent('<div><a href="' + value.link + '">' + value.title + '</a><br/><small>' + value.address + '</small></div>');
        info.close();
        info.open(map, value.mark);
        map.panTo(value.mark.getPosition());
        value.mark.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() { value.mark.setAnimation(null); }, 6000);
      })
    });
  });
}

$(document).ready(function() {        
  // initiate some stuff depending on the window size
  if ($(window).width() > 1000) {
    teamSlider("on");
  };
  
  // react on window resizes
  $(window).resize(function() {
    if ($(window).width() < 1000) {
      teamSlider("off");
    } else {
      if ($(window).width() < 1160) {
        teamSlider("on");
      } else {
        teamSlider("on");
      }
    }
  });
  
  // google map init
  gmapTBIInit();
  gmapCollaborationInit();
  
  // init colorbox 
  /*$(".gal1").colorbox({
    maxWidth: "100%",
    maxHeight: "100%",
    rel: "gal1"
  });*/
  
  // make tables nicer
  $("table").each(function() {
    if ($("tr", this).length > 2) {
      $("tr:odd", this).addClass("odd");
    }
  });
  
  // syntax highlight
  $("pre code").each(function(i, e) { hljs.highlightBlock(e); });

  // WAI fix (for mac only?)
  /*$("a").each(function() {
    $(this).attr("tabindex", "0");
  });*/
  
  // WAI stuff, increase or decrease or switch stylesheet and store info in cookie
  $(".incfont").click(function() {
    var fnt = parseFloat($('html').css('font-size'), 10) * 1.1;
    if (fnt <= 21) {
      $("html").css("font-size", fnt);
      $.cookie("TBIfont", fnt, { expires: 1, path: "/" });
    }
  });
  
  $(".decfont").click(function() {
    var fnt = parseFloat($('html').css('font-size'), 10) * 0.9;
    if (fnt >= 12) {
      $("html").css("font-size", fnt);
      $.cookie("TBIfont", fnt, { expires: 1, path: "/" });
    }
  });
  
  $(".highcontrast").click(function() {
    //$("link[title='TBIbase']").attr("href", "styles/tbi_contrast.css");
    if ($("link[href*='tbi_contrast']").length == 0) {
      $("head").append($('<link href="/styles/tbi_contrast.css" rel="stylesheet" type="text/css" media="screen" />'));
      $.cookie("TBIcontrast", "high", { expires: 7, path: "/" });
    } else {
      $("link[href*='tbi_contrast']").remove();
      $.cookie("TBIcontrast", null, { expires: 7, path: "/" });
    }
  });
  
  // restore font size if necessary          
  var cookieFnt = $.cookie("TBIfont");
  if (cookieFnt != null) {
    $("html").css("font-size", parseFloat(cookieFnt, 10));
  }
  
  // restore high contrast if necessary
  if ($.cookie("TBIcontrast") != null) {
    $("head").append($('<link href="/styles/tbi_contrast.css" rel="stylesheet" type="text/css" media="screen" />'));
  }
});
