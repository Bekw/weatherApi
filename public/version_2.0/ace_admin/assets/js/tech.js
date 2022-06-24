$(document).ready(function () {
    autosize($('textarea[class*=autosize]'));

    $('.clamp').each(function(index, element) {
        $clamp(element, { clamp: 2, useNativeClamp: false});
    });

    /*$(".item-content").on("hide.bs.collapse", function(){
        $(this).prev('.item-header').find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    });
    $(".item-content").on("show.bs.collapse", function(){
        $(this).prev('.item-header').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    });*/

    var lastPos = 0;
    $('.scrollmenu').scroll(function() {
        var currPos = $('.scrollmenu').scrollLeft();

        if (lastPos < currPos) {
            $('.scrollmenu i').css('color', '#8493a8');
            $('.scrollmenu i').css('color', '#c1c9d3');
        }
        if (lastPos > currPos) {
            $('.scrollmenu i').css('color', '#8493a8');
            $('.scrollmenu i').css('color', '#c1c9d3');
        }

        lastPos = currPos;
    });

    $(".left-arrow").click(function () {
        var leftPos = $('.scrollmenu').scrollLeft();
        $(".scrollmenu").animate({scrollLeft: leftPos - 200}, 800);
    });

    $(".right-arrow").click(function () {
        var leftPos = $('.scrollmenu').scrollLeft();
        $(".scrollmenu").animate({scrollLeft: leftPos + 200}, 800);
    });
});

$.fn.extend({
    toggleText: function(a, b){
        return this.text(this.text() == b ? a : b);
    }
});