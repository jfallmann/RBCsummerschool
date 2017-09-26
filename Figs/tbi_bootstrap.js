$(document).ready(function(){
  $('nav.navbar-tbi-main').affix({
    offset: {
      top: 140
    }
  });

  $('body').scrollspy({
      target: "#sidebarNav",
      offset: 50
  });

  $("#sidebarNavList").affix({
    offset: { top: 130, bottom: function () { return -$('footer').outerHeight(true)}}
  });

  $('#sidebarNav').on('activate.bs.scrollspy', function () {

    /* hide all subnavs */
    $(this).find('ul.subnav')
      .addClass('hide');

    /* unhide currently active subnav */
    $(this).find('.active ul.subnav')
      .removeClass('hide');

  });

  $("#sidebarNav").find('li.has-subnav')
    .children("a")
    .append('<span class="caret"></span>');
/*
    .on('mouseover', function(){
      if(! $(this).hasClass("active")){
        $(this)
        .find('ul.subnav.hide')
        .removeClass('hide');
      }
    })
    .on('mouseout', function(){
      if(! $(this).hasClass("active")){
        $(this)
        .find('ul.subnav')
        .addClass('hide');
      }
    });
*/

  /* unhide active subnav in sidemenu (if any) */
  $("#sidebarNav").find('li.has-subnav.active')
    .find("ul.subnav")
    .removeClass("hide");

  /*
      remove origininally assigned 'hidden' class from topwrap div and a element
      and assign Bootstrap affix plugin
  */
  $(".topwrap a")
    .removeClass('hidden');
  $(".topwrap")
    .removeClass('hidden')
    .affix({
      offset: { top: 500, bottom: function () { return $('footer').outerHeight(true)}}
    });

  $("#sidebarNav ul li a[href^='#']").on('click', function(e) {

       // prevent default anchor click behavior
       e.preventDefault();
       h = this.hash;
       // animate
       $('html, body').animate({
           scrollTop: $(this.hash).offset().top - 29
         }, 300, function(){
           // when done, add hash to url
           // (default click behaviour)
           window.location.hash = h;
         });

    });
});


