var map, markerA, markerB, markerC, markerD;
var defaultA, defaultB, latlng;
var geoAddress = "hello world";
var isSelectA = false, isSelectB = false;
var InfoWindowA, InfoWindowB;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

ymaps.ready();

$(document).ready(function(){
    console.log("map load...");
    initialize();

    //присоединяем автозаполнение для адресов
    $(".map-search-list").autocomplete({
        source: function(req, add){
            vl = req.term;
            console.log(vl);
            $(".ui-tooltip").fadeOut("slow");
            if ($("#address-a").is(":focus")){
                isSelectA = false;
            }
            if ($("#address-b").is(":focus")){
                isSelectB = false;
            }

            $.getJSON(
                "http://geocode-maps.yandex.ru/1.x/?results=15&&format=json",
                {geocode: vl},
                function(data) {
                    var suggestions = [];
                    cnt = data.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found;
                    if (cnt > 15) cnt = 14;
                    if (cnt > 0){
                        for (i=0; i<cnt;i++){
                            suggestions.push(data.response.GeoObjectCollection.featureMember[i].GeoObject.metaDataProperty.GeocoderMetaData.text);
                        }
                    }
                    add(suggestions);
                });
        },

        select: function(e, ui) {
            var addr = ui.item.value;
            setPoint(addr);
        },
        open: function(){
            $(this).autocomplete('widget').css('z-index', 1000);
            return false;
        }
    });

    //Просмотр точки A (если после перемещения ее стало не видно, то можно щелкнув по кнопке увидеть место
    $("#btn-address-a").click(function(){
        //map.setZoom(13);
        map.setCenter(markerA.getPosition());
    });
    //Просмотр точки B
    $("#btn-address-b").click(function(){
        //map.setZoom(13);
        map.setCenter(markerB.getPosition());
    });
    //Делаем невидимой кнопку А
    $("#btn-address-a-hide").toggle(function(){
        markerA.setVisible(false);
        $("#address-a").val("");
    }, function(){
        markerA.setVisible(true);
    });
    //Делаем невидимой кнопку Б
    $("#btn-address-b-hide").toggle(function(){
        markerB.setVisible(false);
        $("#address-b").val("");
    }, function(){
        markerB.setVisible(true);
    });
    //При нажатии на Enter переносимся во второй инпут
    $('#address-a').bind("keydown", function(e) {
        if (e.which == 13 || e.which == 9){
            e.preventDefault();
            $('#address-b').focus();
        }
    });
    //При нажатии на Enter переносимся во второй инпут
    $('#address-b').bind("keydown", function(e) {
        if (e.which == 13 || e.which == 9){
            e.preventDefault();
            $('.btn').focus();
        }
    });


    //при изменении фокуса вводимого адреса, проверяем, выбрали ли адрес из списка
    $(".map-search-list").focusout(function(){
        console.log(isSelectA);
        console.log(isSelectB);

    });

}) //document ready

//инициализация карты
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer({draggable: false, suppressMarkers: true});
    latlng = new google.maps.LatLng(43.2823, 76.9003);
    var myOptions = {
        zoom: 13,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    directionsDisplay.setMap(map);
    defaultA = new google.maps.LatLng(43.258556969321184, 76.95314969311517);
    defaultB = new google.maps.LatLng(43.25748902587104, 76.91077134399416);

    InfoWindowA = new google.maps.InfoWindow({
        content: 'Алматы, пункт А'
    });

    InfoWindowB = new google.maps.InfoWindow({
        content: 'Алматы, пункт Б'
    });
    markerA = new google.maps.Marker({
        position: defaultA,
        draggable: true,
        map: map,
        title: "Пункт отправки",
        icon: "/css/image/red_MarkerA.png"

    });

    markerB = new google.maps.Marker({
        position: defaultB,
        draggable: true,
        map: map,
        title: "Пункт назначения",
        icon: "/css/image/red_MarkerB.png"
    });

    setMapScale();

    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(markerA, 'dragend', function(evt){
        //получить название объекта по координатам (Яндекс геокодирование)
        setNameByCoord(InfoWindowA, $("#address-a"), evt.latLng.lat(), evt.latLng.lng());
        console.log(evt.latLng);
        isSelectA = true;
        //drawRoute(markerA, markerB);
        setMapScale();

    });
    google.maps.event.addListener(markerA, 'click', function() {
        InfoWindowA.open(map, markerA);
    });

    google.maps.event.addListener(markerB, 'dragend', function(evt){
        //получить название объекта по координатам (Яндекс геокодирование)
        setNameByCoord(InfoWindowB, $("#address-b"), evt.latLng.lat(), evt.latLng.lng());
        console.log(evt.latLng);
        isSelectB = true;
        //drawRoute(markerA, markerB);
        setMapScale();

    });
    google.maps.event.addListener(markerB, 'click', function() {
        InfoWindowB.open(map, markerB);
    });


} //initial map

//установить по коодинатам адрес точки в input ob
function setNameByCoord(InfoWindowob, ob, y, x){
    var myGeocoder = ymaps.geocode([x, y]);
    myGeocoder.then(
        function (res) {
            var nearest = res.geoObjects.get(0);
            var myname = nearest.properties.get('name');
            $(ob).val(myname);
            InfoWindowob.setContent(myname);

        },
        function (err) {
            alert('Ошибка при определении места');
        }
    );
    /* google геокодирование для будущего
     geocoder.geocode({'latLng': evt.latLng}, function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
     if (results[0]) {
     $('#address-a').val(results[0].formatted_address);
     getNameByCoord(evt.latLng.lat(), evt.latLng.lng());
     console.log(geoAddress);
     }
     }
     });
     */
}

//установка маркера ob на выбранный адрес
function setCoordByName(ob, addr){
    var myGeocoder = ymaps.geocode(addr);
    var point;
    myGeocoder.then(
        function (res) {
            //console.log('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());
            //var nearest = res.geoObjects.get(0);
            //console.log(nearest.properties.get('name'));

            point = res.geoObjects.get(0).geometry.getCoordinates();
            latlng = new google.maps.LatLng(point[1], point[0]);
            ob.setPosition(latlng);
            ob.setVisible(true);
            setMapScale();
            setMarkerInfo(ob, addr);
            //drawRoute(markerA, markerB);
        },
        function (err) {
            alert('Ошибка при определении координат по адресу');
        }
    );

}

//установка точки по адресу
function setPoint(addr){
    if ($("#address-a").is(":focus")){
        setCoordByName(markerA, addr);
        isSelectA = true;
    }
    if ($("#address-b").is(":focus")){
        setCoordByName(markerB, addr);
        isSelectB = true;
    }

}

//масштабировать карту и отображать 2 точки
function setMapScale(){
    var latlngbounds = new google.maps.LatLngBounds();
    latlngbounds.extend(markerA.getPosition());
    latlngbounds.extend(markerB.getPosition());
    if (!(markerC===undefined)){
        latlngbounds.extend(markerC.getPosition());
    }
    if (!(markerD===undefined)){
        latlngbounds.extend(markerD.getPosition());
    }
    map.setCenter( latlngbounds.getCenter(), map.fitBounds(latlngbounds));
}

//установка маркера по координатам
function setMarkerPosition(ob, lat, lng, title){
    if (lat == "" || lng == ""){
        return;
    }
    latlng = new google.maps.LatLng(lat, lng);
    ob.setPosition(latlng);
    ob.setVisible(true);
    setMarkerInfo(ob, title);
    //drawRoute(markerA, markerB);
    setMapScale();
}

//установка информации по маркеру ob
function setMarkerInfo(ob, msg){
    if (ob == markerA) InfoWindowA.setContent(msg);
    if (ob == markerB) InfoWindowB.setContent(msg);
}

//нарисовать маршрут
function drawRoute(start, end){
    console.log('drawRoute');
    var waypts = [];
    if (!(markerC === undefined)) {
        waypts.push({location:markerC.getPosition(), stopover:false});
    }
    if (!(markerD === undefined)) {
        waypts.push({location:markerD.getPosition(), stopover:false});
    }
    var request = {
        origin:start.getPosition(),
        destination:end.getPosition(),
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            showError("Не могу нарисовать маршрут");
        }
    });


}

