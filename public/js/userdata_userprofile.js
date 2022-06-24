$(document).ready(function() {
	$("#gallery a").fancybox();


//    $(".rating-form").hover(function() {
//       $(this).find('.rating-read-block').hide();
//       $(this).find('.rating-block').show();
//    }, function() {
//        $(this).find('.rating-read-block').show();
//        $(this).find('.rating-block').hide();
//    });

    $(".rating-item").hover(function() {
        x = $(this).position()['left'];
        x = ~~(((x - 11) / (191 - 11)) * 10);
        x = 215 - (20*x);
        ob = $(this).closest('.rating-panel');
        $(ob).css('backgroundPosition','-'+ x +'px');

    }, function() {
        $(ob).css('backgroundPosition','-334px');
    });

});



//показать форму выставление рейтинга (модальная)
//function showRatingForm(user_id){
//    $("#modal_rating").empty();
//    $("#modal_rating").load("/userdata/modal-rating-form/user_id/"+user_id, function(){
//        $('#ratingModal').modal();
//    });
//}

//выпадающее меню при нажатии на gps доступ
function showRatingForm(ob){
    ob = $(ob).closest(".access-level-wrapper");
    ob = $(ob).find(".access-level-block");
    $(ob).toggleClass('hidden');

    //мой gps доступ информация
    ob1 = $(ob).find(".access-level-data-wrapper");
    ajx1 = $(ob1).find(".ajax-loader");
    $(ajx1).show();
    ob1 = $(ob1).find(".access-level-data");
    $(ob1).empty();
    $(ob1).load("/request/index-ajax-content/mode/gps-access-data/request_id/" + $(ob1).attr("data-request-id") + "/route_id/" + $(ob1).attr("data-route-id"), function(){
        $(ajx1).hide();
    });
}

function setRating(ob,val){
    ob = $(ob).closest('.rating-block');
    rtcategory_code = $(ob).find('.mode').val();
    recipient_user_id = $('#recipient_user_id').val();
    ob1 =  $(ob).closest('.rating-form').find('.rating-read-block');

    $.ajax({
        type: 'POST',
        url: "/userdata/index-json/mode/set-rating",
        data: {recipient_user_id: recipient_user_id, rtcategory_code: rtcategory_code, grade: val},
        success: function(data){
            $(ob).find('.rating_grade').html(data.result);
            x = 215 - (20*data.result);
            $(ob1).css('backgroundPosition','-'+ x +'px');
        }
    });
}

$(document).mouseup(function (e)
{
    var container = $("#rating-form!");

    if (container.has(e.target).length === 0)
    {
        container.hide();
    }
});