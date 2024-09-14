$(document).ready(function(){
  let slide = $('.slick-custom-slider').data('slide');
  let slider = $('.slick-custom-slider').attr('id');
  console.log('dd');
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
    slidesToShow: slide,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive:responsive
  });
  
});