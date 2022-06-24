$(document).ready(function(){
    $("#search_word").keypress(function(e){
        if(e.keyCode==13){
            searchByWord();
        }
    });
    $(".scroll-basket-items").load("/index/basket-items/");
    $("#basket_item_count").html($("#count_hidden").val());
    $("#mobile_basket_item_count").html($("#count_hidden").val());
    globalTimer = setInterval(function(){
        nextSlide();
    },12000);

    var height=0;var width=0;
    if (self.screen) {
        width = screen.width
        height = screen.height
    }
    if(width < 500 && height < 500){
        $(".slide-block").css("padding-left","55px");
    }
    else if(width < 500 && height < 700){
        $(".slide-block").css("padding-left","55px");
    }
    else if(width < 700){
        $(".slide-block").css("padding-left","55px");
    }

    if(width < 500 && height < 500){
        $(".basket-block").css("margin-left","280px");
    }

    if(width > 1366 && height > 768){
        $(".scroll-basket").css("right","180px");
    }
    else if(width < 500 && height < 700){
        $(".scroll-basket").css("right","2px");
    }
    else if(width < 700){
        $(".scroll-basket").css("right","2px");
    }
    else{
        $(".scroll-basket").css("right","58px");
    }
//    $(".screen-width").attr("value",width);
//    var myVar = setInterval(myTimer, 100);
});

function myTimer() {
    width = $(".screen-width").val();
    margin_left = parseInt($(".santa").css("margin-left"));
    margin_left += 5;
    if(margin_left - 10 >= width){
        margin_left = -80;
    }
    $(".santa").css("margin-left",margin_left);
}
$(document).mouseover(function (e){
    var a = $(e.target).closest(".b-product-desc").length;
    var b = $(e.target).closest(".scroll-basket").length;
    var c = $(e.target).closest(".scroll-basket-items").length;

    if(a == 0){
        $(".b-product-desc").css("opacity",0);
    }
    if(b == 0 && c == 0){
        $(".scroll-basket-items").css("display","none");
    }

});
$(document).mouseup(function (e){
    //var d = $(e.target).closest(".city-block").length;
    //if(d == 0){
    //    $(".city-block").fadeOut(200);
    //}
});
function searchByWord(){
    search_word = encodeURIComponent($("#search_word").val());
    window.location.href = "/?search_word=" + search_word;
}
function ajaxLoader(isShow){
    if (isShow){
        $(".ajax-loader").show();
    } else {
        $(".ajax-loader").hide();

    }
}
function showProductDescription(ob){
    $(".b-product-desc").css("opacity",0);
    $(ob).find(".b-product-desc").css("opacity",1);
}
function showBasketItems(){
    var height=0;var width=0;
    if (self.screen) {
        width = screen.width
        height = screen.height
    }

    if(width > 1366 && height > 768){
        $(".scroll-basket-items").css("right","180px");
    }
    else if(width < 500 && height < 700){
        $(".scroll-basket-items").css("right","2px");
    }
    else{
        $(".scroll-basket-items").css("right","68px");
    }
    $(".scroll-basket-items").css("display","block");
}
function changeCityCookie(ob){
    selected_city = $(ob).val();
    var expires = "";
    document.cookie = "city="+selected_city+expires+"; path=/";

    city_name = $(".select-city-main option:selected").attr("data-city");

    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/delete-all-users-products/",
        success: function(data){
            window.location.href = "<?=getHttpHost()?>/" + city_name + "-p100/";
        }
    });
}
function nextSlide(id){
    if(id > 0){
        cur_slide = id;
    }
    else{
        cur_slide = $("#current_slide").val();
        max_slide = $(".slide-class").length;
        cur_slide++;
        if(cur_slide > max_slide){
            cur_slide = 1;
        }
    }

    $(".slide-class").css("display","none");
    $(".slide-btn").attr("src","/css/image/not_selected_slide.png");
    $("#slide_btn_"+cur_slide).attr("src","/css/image/selected_slide.png");
    $("#slide_"+cur_slide).css("display","block");
    $("#current_slide").attr("value",cur_slide);
}

function setStatusSubCategoryBlock(category_id){
    if($(".sub" + category_id).css("display") == "block"){
        $(".sub" + category_id).slideUp(300);
    }
    else{
        $(".subcategory-block").slideUp(300);
        $(".sub" + category_id).slideDown(300);
    }

}

function showCityBlock(){
    if($(".city-block").css("display") == "block"){
        $(".city-block").fadeOut(200);
    }
    else{
        $(".city-block").fadeIn(200);
    }
}

jQuery(document).ready(function($){
    $("#menu-icon").on("click", function(){
        $("#nav").slideToggle();
        $(this).toggleClass("active");
    });
    //$("iframe").css("display","none");
});

function animateToCategoryBlock(){
    $("html, body").animate({ scrollTop: $('#category-list-block-nav').offset().top }, 1200);
}

$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });
    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });
});

function setMobilePrevSlide(){
    cur_slide = $("#current_slide").val();
    max_slide = $(".slide-class").length;
    cur_slide--;
    if(cur_slide < 1){
        cur_slide = max_slide;
    }

    $(".slide-class").css("display","none");
    $("#slide_"+cur_slide).css("display","block");
    $("#current_slide").attr("value",cur_slide);

}

function setMobileNextSlide(){
    cur_slide = $("#current_slide").val();
    max_slide = $(".slide-class").length;
    cur_slide++;
    if(cur_slide > max_slide){
        cur_slide = 1;
    }

    $(".slide-class").css("display","none");
    $("#slide_"+cur_slide).css("display","block");
    $("#current_slide").attr("value",cur_slide);

}

$( document ).ready(function() {
    $('.single-item').slick({
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        nextArrow: '<i class="glyphicon glyphicon-chevron-right next-arrow"></i>',
        prevArrow: '<i class="glyphicon glyphicon-chevron-left prev-arrow"></i>',
        slidesToScroll: 1,
        lazyLoad: 'ondemand',
        responsive: [
            {
                breakpoint: 1366,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                    dots: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true,
                    infinite: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true,
                    infinite: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                    dots: true,
                    infinite: true,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]

    });

    $('.popular-products-slick').slick({
        dots: false,
        arrows: true,
        nextArrow: '<i class="glyphicon glyphicon-chevron-right next-arrow-popular"></i>',
        prevArrow: '<i class="glyphicon glyphicon-chevron-left prev-arrow-popular"></i>',
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    infinite: true,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    dots: true,
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 320,
                settings: {
                    arrows: false,
                    dots: true,
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
    if($(document).width() > 768){
        brandSlick();
    }

    $(window).on('resize',resizeWindowBlock);

    $(".mobile-menu-btn").click(function(){
        $(".mobile-menu").show('slide', { direction: 'left' }, 200);
        $('.mobile-blur').css('display', 'block');
        $('.mobile-blur-white').css('display', 'block');
        $('body').css('position', 'fixed');

    });

    $(".mobile-blur").click(function(){
        $('body').css('position', 'inherit');
        $('.single-item').slick('setPosition');
        $(".mobile-menu").hide('slide', { direction: 'left' }, 200);
        $('.mobile-blur').css('display', 'none');
        $('.mobile-blur-white').css('display', 'none');
    });


    $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
    });


    $(".mobile-search-btn").click(function(){
        $(".navbar-mobile-search").show('slide', { direction: 'right' }, 200);
    });

    $(document).bind( "mouseup touchend", function (e){
        var d = $(e.target).closest(".navbar-mobile-search").length;
        var e = $(e.target).closest(".mobile-search-btn").length;
        if(d == 0 && e == 0){
            $(".navbar-mobile-search").hide('slide', { direction: 'right' });
        }
    });
});


function resizeWindowBlock() {
    if($(document).width() < 769){
        $('.brand-slick').slick('unslick');
    }
    else{
        brandSlick();
    }
}

function brandSlick(){
    $('.brand-slick').slick({
        dots: false,
        arrows: true,
        nextArrow: '<i class="glyphicon glyphicon-chevron-right next-arrow-brand"></i>',
        prevArrow: '<i class="glyphicon glyphicon-chevron-left prev-arrow-brand"></i>',
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: false
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
}
