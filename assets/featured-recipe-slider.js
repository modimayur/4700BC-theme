$(document).ready(function(){
  let slide = $('.featured-recipes-slider').data('slide');
  
  $('.featured-recipes-slider').slick({
    arrows: true,
    dots:false,
    infinite: false,
    slidesToShow: slide,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive:[
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
  });
});