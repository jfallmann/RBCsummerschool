function toggleOffcanvas() {
    $('.row-offcanvas').toggleClass('active')
    $('.offcanvas_on').toggleClass('hidden');
    $('.offcanvas_off').toggleClass('hidden');
}

$(document).ready(function () {
  $('[data-toggle="offcanvas"]').click( function (){toggleOffcanvas();});

  /* toggle canvas on click of any link in it, if we are in dropdown-mode */
  $('aside a').click( function (){
    if( ! $('[data-toggle="offcanvas"]').hasClass('active')){
      toggleOffcanvas();
    }
  });
});
