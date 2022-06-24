var srch= [];
$(window).resize(function(){
    setResize();
});

$(document).ready(function(){
    //начальные установки
    //both -  в оба конца
    //periodic - периодичный маршрут
    //single - одноразовый маршрут
    //srch - параметры запроса

    setResize();

    setMarkerPosition(markerA, "", "", "Пункт отправки");
    setMarkerPosition(markerB, "", "", "Пункт назначения");

    if ($("#route-type").val() == 0){
        $(".single").show();
        $(".periodic").hide();
        console.log(1);
    } else {
        $(".periodic").show();
        $(".single").hide();
        console.log(2);
    }

    //$(".android").androidCheckbox({isDisabled: false});
    //конец начальных установок

    $("#route-type").change(function(){
        console.log(5);
        routeTypeChange();
    });

    $("#simple-search").click(function(){
        $(".route-detail-block").toggle();
        if ( $('.route-detail-block').is(':hidden')){
            $(this).html("Расширенный");
        } else {
            $(this).html("Обычный");
        }
    })
    $('#search-hide-button').toggle(function() {
        $(".search-left-wrapper").hide();
        $("#search-hide-button").css('left',0+'px');
        $(".search-map-wrapper").css('left',0+'px');
        w = $(".search-map-wrapper").width();
        $(".search-map-wrapper").css('width',w + 400 +'px');

    }, function() {
        $(".search-left-wrapper").show();
        $("#search-hide-button").css('left',400+'px');
        $(".search-map-wrapper").css('left',400+'px');
        $(".search-map-wrapper").css('width',$(".search-map-wrapper").width() - 400+'px');
    });

});

function setResize(){
    //Размеры для карты
    $w = document.body.clientWidth;
    $h = window.innerHeight;
    $('.full-container').css('min-height',$h - 60 + 'px');
    $('.search-map-wrapper').css('width',$w - 383 + 'px');
    $('.search-map-wrapper').css('height',$h - 50 + 'px');
    $('#route-search-block').css('height',$h - 297 + 'px');
    $('#tab2').css('height',$h-130 + 'px');
    $('#tab3').css('height',$h-130 + 'px');
}

function routeTypeChange(){
    if ($("#route-type").val() == 0){
        $(".single").show();
        $(".periodic").hide();
    } else {
        $(".periodic").show();
        $(".single").hide();
    }
}
//клик в один конец
/*
function setSingleWay(){
    $("#btn-single-way").addClass("active");
    $("#btn-both-way").removeClass("active");
    $(".both").hide();
    console.log(6);
}*/
//клик в оба конца
/*
function setBothWay(){
    $("#btn-single-way").removeClass("active");
    $("#btn-both-way").addClass("active");
    $(".both").show();
    console.log(7);
}
*/
//Формирование массива поиска
function srchForm(){
    if (isSelectA == false){
        showInfo("Координаты точки А возможно определены неверно");
    }
    if (isSelectB == false){
        showInfo("Координаты точки Б возможно определены неверно");
    }

    srch.length=0;

    week_days = getWeekString();
    if ($("#route-type").val() == 0){
        start_time = $("#start-time-a").val();
    } else {
        start_time = $("#start-time").val();
    }

    if ( $('.route-detail-block').is(':hidden')){
        extend = "simple";
    } else {
        extend = "extend";
    }

    srch.push({name: 'week_days', value: week_days});
    srch.push({name: 'user_type', value: $("#user-type").val()});
    srch.push({name: 'is_driver', value: $("#is-driver").val()});
    if (markerA.visible){
        srch.push({name: 'startpointx', value: markerA.getPosition().lat()});
        srch.push({name: 'startpointy', value: markerA.getPosition().lng()});
    } else {
        srch.push({name: 'startpointx', value: 0});
        srch.push({name: 'startpointy', value: 0});
    }
    if (markerB.visible){
        srch.push({name: 'endpointx', value: markerB.getPosition().lat()});
        srch.push({name: 'endpointy', value: markerB.getPosition().lng()});
    } else {
        srch.push({name: 'endpointx', value: 0});
        srch.push({name: 'endpointy', value: 0});
    }
    srch.push({name: 'startpoint_name', value: $("#address-a").val()});
    srch.push({name: 'endpoint_name', value: $("#address-b").val()});
    srch.push({name: 'extend', value: extend});
    srch.push({name: 'is_period', value: $("#route-type").val()});
    srch.push({name: 'start_time', value: start_time});
    srch.push({name: 'week_days', value: week_days});
    srch.push({name: 'start_date', value: $("#start-date-a").val()});
    srch.push({name:'sort_mode',value:'default'});
}

function formSearch(){
    //$(".ajax-loader").show();
    //showInfo("Идет поиск...");
    $.blockUI({message:null});
    if (!(markerC === undefined)){
        markerC.setMap(null);
        markerC = undefined;
        console.log("delete marker");
    }
    if (!(markerD === undefined)){
        markerD.setMap(null);
        markerD = undefined;
        console.log("delete marker");
    }

    $.ajax({
        type: 'POST',
        url: "/route/index-ajax-content/mode/search-list/tab/2",
        data: srch,
        success: function(data){
            //$(".ajax-loader").hide();
            $.unblockUI();
            $("#tab2 > ul").html(data);
            $('.search-tabs #tab-2').tab('show');
        }
    });

    $.ajax({
        type: 'POST',
        url: "/route/index-ajax-content/mode/search-list/tab/3",
        data: srch,
        success: function(data){
            //$(".ajax-loader").hide();
            $.unblockUI();
            $("#tab3 > ul").html(data);
        }
    });

}
function btnSearch(){
    srchForm();
  //  console.log(srch);
    formSearch();
}

function setSearchType(id, ob){
    $('#search-type').val(id);
    $(".gender-btn").removeClass("active");
    $(ob).addClass("active");
    if (id == 1){
        $("#simple-search-block").show();
        $("#route-search-block").hide();

    }else{
        $("#simple-search-block").hide();
        $("#route-search-block").show();
        $(".ajax-loader").show();
        $('#route-search-block').load('/route/index-ajax-content/mode/my-route-list', function(){
            $(".ajax-loader").hide();
            //Скроллбар для просмотра результатов поиска
            $(".scrollbar").tinyscrollbar({
                prefix: "",
                updateTime: 200
            });

        });

    }

}

function SortBy(mode){
    srch.pop();
    srch.push({name:'sort_mode',value:mode});
   // console.log(srch);

    formSearch();
}


//получение данных маршрута и заполнение формы поиска по данным маршрута
function getRouteData(route_id){
    $(".ajax-loader").show();
    $.ajax({
        type: 'POST',
        url: "/route/index-json/mode/get-route-data",
        data: {route_id:route_id},
        success: function(data){
            $(".ajax-loader").hide();
            if (data.result == true) {
                $("#route-id").val(route_id);
                //указываем точки на карте и выводим адреса
                setMarkerPosition(markerA, data.data.startpointx, data.data.startpointy, data.data.startpoint_name);
                setMarkerPosition(markerB, data.data.endpointx, data.data.endpointy, data.data.endpoint_name);
                $("#address-a").val(data.data.startpoint_name);
                $("#address-b").val(data.data.endpoint_name);
                //устанавливаем атрибуты периодичного или одноразового маршрута
                //если периодичный
                if (data.data.is_period == "1"){
                    setWeekString(data.data.week_days);
                    if (data.data.start_time_hour != null){
                        $("#start-time").val(data.data.start_time_hour + ":" + data.data.start_time_min);
                    } else {
                        $("#start-time").val("");
                    }
                    $("#route-type").val(1);
                    $("#route-type").trigger('refresh');
                    routeTypeChange();
                }
                else{
                    if (data.data.start_time_hour_single != null){
                        $("#start-time-a").val(data.data.start_time_hour_single + ":" + data.data.start_time_min_single);
                    } else {
                        $("#start-time-a").val("");
                    }
                    if (data.data.start_datetime_date != null){
                        $("#start-date-a").val(data.data.start_datetime_date);
                    } else {
                        $("#start-date-a").val("");
                    }
                    $("#route-type").val(0);
                    $("#route-type").trigger('refresh');
                    routeTypeChange();
                }

                srchForm();
                formSearch();
                //drawRoute(markerA, markerB);
            }
            else {
                showError("Ошибка при получении данных маршрута");
            }
        }
    });
}

//показать форму отправки запроса
function showRequestForm(route_id){
    //если поиск по маршруту, передаем маршрут отправителя и получателя
    $("#modal_request").empty();
    //если поиск был по маршруту
    if ($("#search-type").val() == 0 && $("#route-id").val() > 0){
        $("#modal_request").load("/route/modal-request-form/recipient_route_id/"+route_id+"/sender_route_id/"+$("#route-id").val() + "/is_driver/" + $("#user-type").val(), function(){
            $('#newRequestModal').modal();
        });
    } else {
        $("#modal_request").load("/route/modal-request-form/recipient_route_id/"+route_id+"/sender_route_id/0" + "/is_driver/" + $("#user-type").val(), function(){
            $('#newRequestModal').modal();
        });
    }
}

function showOnMap(ob){
    ob = $(ob).closest(".search-user-block");
    start_point_x = $(ob).find(".start_point_x").val();
    start_point_y = $(ob).find(".start_point_y").val();
    end_point_x = $(ob).find(".end_point_x").val();
    end_point_y = $(ob).find(".end_point_y").val();
    defaultC = new google.maps.LatLng(start_point_x, start_point_y);
    defaultD = new google.maps.LatLng(end_point_x, end_point_y);
    createMarkerC('Пункт С', defaultC);
    createMarkerD('Пункт D', defaultD);
    //drawRoute(markerA, markerB);
    setMapScale();

}

//создание дополнительного маркера C
function createMarkerC(obj_title, latlng2){
    if (!(markerC === undefined)){
        markerC.setMap(null);
        markerC = undefined;
        console.log("delete marker");
    }
    console.log("crate marker");
    console.log(latlng);
    markerC = new google.maps.Marker({
        position: latlng2,
        draggable: false,
        map: map,
        title: obj_title,
        icon: "/css/image/blue_MarkerA.png"
    });

}

//создание дополнительного маркера D
function createMarkerD(obj_title, latlng2){
    if (!(markerD === undefined)){
        markerD.setMap(null);
        markerD = undefined;
        console.log("delete marker");
    }
    console.log("crate marker");
    console.log(latlng);
    markerD = new google.maps.Marker({
        position: latlng2,
        draggable: false,
        map: map,
        title: obj_title,
        icon: "/css/image/blue_MarkerB.png"
    });
}

//поменять местами точки
function changePoints(){
    var ax = markerA.getPosition().lat();
    var ay = markerA.getPosition().lng();
    setMarkerPosition(markerA, markerB.getPosition().lat(), markerB.getPosition().lng());
    setMarkerPosition(markerB, ax, ay);
    var atxt = $("#address-a").val();
    var btxt = $("#address-b").val();
    $("#address-a").val(btxt);
    $("#address-b").val(atxt);
    InfoWindowA.setContent(btxt);
    InfoWindowB.setContent(atxt);
}
