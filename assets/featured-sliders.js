$(document).ready(function(){
  let slide = $('.slick-custom-slider').data('slide');
  let slider = $('.slick-custom-slider').attr('id');
  let fade = $('.slick-custom-slider').data('fade');
  console.log(fade);
  let responsive = []
  if(slide > 1){
    responsive = [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
    ]
  }
  $(`#${slider}`).slick({
    arrows: true,
    dots:false,
    infinite: false,
    fade:fade == 1 ? true: false,
    slidesToShow: slide,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive:responsive
  });
  
});