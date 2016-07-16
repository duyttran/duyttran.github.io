var count = 0;
$(window).keydown(function(e) {
  key = String.fromCharCode(e.keyCode).toLowerCase();
  $('.zentext').append(
    '<span class="letter fade_once">' + key + '</span>');
  count++;
  if (count > 210) {
    allletters = $('.letter');
    for(var i = 0; i < 140; i++) {
      allletters.get(i).remove();
      count--;
    }
  }
});



