$(document).ready(function(){
	$( "#start_datetime" ).datepicker({
		showOn: "button",
		buttonImage: "/css/image/calendar.gif",
		buttonImageOnly: true,
		buttonText:"Выберите дату выезда",
		onSelect: function(dateText, inst)
				  {
						$("#a_start_date").html(dateText);
						$("#start_date").val(dateText);
						$('#start_datetime').css('display', 'none');
		 		  }
		
		
	});
	
	$( "#search_action" ).buttonset();
	$( "#points" ).buttonset();
	$( "#names" ).buttonset();
	$( "#search_extend" ).buttonset();
	$( "#is_period" ).buttonset();
	$( "#week_days" ).buttonset();
	
	//поиск по карте, названию, маршруту
	$( "#search_action input:radio" ).click(function() {
		if ($(this).val() == "map"){
			$('#search_param').css('display', 'block');
			$('#points').css('display', 'block');
			$('#names').css('display', 'none');
		}
		if ($(this).val() == "name"){
			$('#search_param').css('display', 'block');
			$('#points').css('display', 'none');
			$('#names').css('display', 'block');
		}
	})
	
	//чекбокс выбора поиск по маршруту либо по точкам
	$( "#chselectroute" ).click(function() {
		if ($("#chselectroute").prop("checked")){
			disableSearch(true);
			showRouteForm();
		} 
		else{
			disableSearch(false);
		}
			
	})
	
	//нажатие на Пункт А, Пункт Б
	$( "#points input:radio" ).click(function() {
		//alert($('input:radio[name=points]:checked').val());
		//alert($(this).val());
		if ($(this).val() == "point_a")
			setPoint(1, true);
		if ($(this).val() == "point_b")
			setPoint(2, true);
	})

	
	//расширенный поиск
	$( "#search_extend input:radio" ).click(function() {
		if ($(this).val() == "simple")
			$('#extend_box').css('display', 'none');
		else
			$('#extend_box').css('display', 'block');
	})
	
	//периодичный или однаразовый маршрут
	$( "#is_period input:radio" ).click(function() {
		if ($(this).val() == "0"){
			$('#week_days').css('display', 'none');
			$('#start_date_box').css('display', 'block');
		}	
		else{
			$('#week_days').css('display', 'block');
			$('#start_date_box').css('display', 'none');

		}	
	})
	
	//если ищем по маршруту то подгружаем маршрут
	//if ($('input:radio[name=search_action]:checked').val() == "route"){
	
	if ($("#chselectroute").prop("checked")){
		if ($("#route_id").val() > 0 ){
			getRouteData($("#route_id").val());
		}	
	}
	
	//Присоединяем автозаполнение для точки А
	$("#i_start_point_a").autocomplete({
		source: function(req, add){
			vl = $('#i_start_point_a').val();
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
			setPoint(1, false);
			setMyPoint(addr, 0, 0, true);
	        
		},
	});
	//Присоединяем автозаполнение для точки B
	$("#i_start_point_b").autocomplete({
		source: function(req, add){
			vl = $('#i_start_point_b').val();
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
			setPoint(2, false);
			setMyPoint(addr, 0, 0, true);
		},
	});			
	
});

ymaps.ready(init);
var myMap, myMapModal, 
    myPlacemarkA,
    myPlacemarkB,
    myPlacemarkModalA,
    myPlacemarkModalB;

function init(){ 
    myMap = new ymaps.Map ("map", {
        center: [76.911648, 43.279807],
        zoom:11,
        behaviors: ['default', 'scrollZoom']
    });
    
    var cursor = myMap.cursors.push("arrow");
    myMap.controls.add('zoomControl', {right: '0px', top: '35px'});
    myMap.controls.add('typeSelector');

    myMap.events.add('click', function (e) {
    	var coords = e.get('coordPosition');
    	x = coords[0].toPrecision(6);
    	y = coords[1].toPrecision(6);
    	getNameByCoord(x, y);
	});
    
    
    myMapModal = new ymaps.Map ("modal_map", {
        center: [76.911648, 43.279807],
        zoom:11,
        behaviors: ['default', 'scrollZoom']
    });
    
	//если мы ищем по карте, то устанавливаем точки
	if ($('input:radio[name=search_action]:checked').val() == "map"){
		if ($("#start_point_x").val() > 0){
			setPoint(2, false);
			setMyPoint(
					$("#i_start_point_b").val(),
					$("#end_point_x").val(),
					$("#end_point_y").val(),
					false
			)
		}	
		
		if ($("#end_point_x").val() > 0){
			setPoint(1, true);
			setMyPoint(
					$("#i_start_point_a").val(),
					$("#start_point_x").val(),
					$("#start_point_y").val(),
					true
			)
		}	
	}


}

function setPoint(p, isCenter){
	if (p == 1){ 
		$('#point_a').attr("checked", "checked");
		$("#point_b").removeAttr("checked");
		$( "#point_a" ).button( "refresh" );
		$( "#point_b" ).button( "refresh" );
		if (!(myPlacemarkA===undefined)){
			point = myPlacemarkA.geometry.getCoordinates();
			if (isCenter) myMap.setCenter([point[0], point[1]], 16, {checkZoomRange: true});
		}	
	}	
	else{
		$('#point_b').attr("checked", "checked");
		$("#point_a").removeAttr("checked");
		$( "#point_a" ).button( "refresh" );
		$( "#point_b" ).button( "refresh" );
		if (!(myPlacemarkB===undefined)){
			point = myPlacemarkB.geometry.getCoordinates();
			if (isCenter) myMap.setCenter([point[0], point[1]], 16, {checkZoomRange: true});
		}
		
	}
}

function getNameByCoord(x, y){
	var myGeocoder = ymaps.geocode([x,y]);

	myGeocoder.then(
		    function (res) {
		    	var nearest = res.geoObjects.get(0);
		        var myname = nearest.properties.get('name');
		    	setMyPoint(myname, x, y, false);
		    },
		    function (err) {
		        alert('Ошибка при определении места');
		    }
		);
	
}

function setMyPoint(myname, x, y, isCenter){
	//если есть название местности, но нет координат
	if (x==0 && y==0){
		var myGeocoder = ymaps.geocode(myname);
		var point;
		myGeocoder.then(
		    function (res) {
		        //alert('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());
		    	point = res.geoObjects.get(0).geometry.getCoordinates();
		    	if ($('input:radio[name=points]:checked').val() == "point_b")
		    		setPointB(myname, point[0], point[1], isCenter);
		    	else
		    		setPointA(myname, point[0], point[1], isCenter);
		    	
		    },
		    function (err) {
		        alert('Ошибка');
		    }
		);
	}
	else{
		if ($('input:radio[name=points]:checked').val() == "point_b")
			setPointB(myname, x, y, isCenter);
		else
			setPointA(myname, x, y, isCenter);
	}
}

function setPointA(myname, x, y, isCenter){
	if (x <= 0 || y <= 0) return;
	
	if (!(myPlacemarkA===undefined))
		myMap.geoObjects.remove(myPlacemarkA);
	myPlacemarkA = new ymaps.Placemark([x, y], {
        content: 'Алматы',
        balloonContent: myname,
        iconContent: "<b>A</b>",
    	}, {draggable: true});
	myPlacemarkA.events.add('dragend', function (e) {
    	mypoint = myPlacemarkA.geometry.getCoordinates();
    	setPoint(1, false);
    	getNameByCoord(mypoint[0], mypoint[1]);

	});
    $("#i_start_point_a").val(myname);	
    if (isCenter){ 
    	myMap.setCenter([x, y], 16, {checkZoomRange: true})
    };

    myMap.geoObjects.add(myPlacemarkA);
    //делаем кнопку Пункт А активной
    $('#point_a').attr("checked", "checked");
	$("#point_b").removeAttr("checked");
	$( "#point_a" ).button( "refresh" );
	$( "#point_b" ).button( "refresh" );
	//устанавливаем координаты
	$( "#start_point_x" ).val(x);
	$( "#start_point_y" ).val(y);
    //alert(myPlacemarkA.geometry.getCoordinates());
}

function setPointB(myname, x, y, isCenter){
	if (x <= 0 || y <= 0) return;
	if (!(myPlacemarkB===undefined))
		myMap.geoObjects.remove(myPlacemarkB);
	myPlacemarkB = new ymaps.Placemark([x, y], {
        content: 'Алматы',
        balloonContent: myname,
        iconContent: "<b>Б</b>"
    }, {draggable: true});
	
	myPlacemarkB.events.add('dragend', function (e) {
    	mypoint = myPlacemarkB.geometry.getCoordinates();
    	setPoint(2, false);
    	getNameByCoord(mypoint[0], mypoint[1]);
	});
    $("#i_start_point_b").val(myname);	
	if (isCenter){ 
    	myMap.setCenter([x, y], 16, {checkZoomRange: true})
    };
    myMap.geoObjects.add(myPlacemarkB);
    //делаем кнопку Пункт Б активной
    $('#point_b').attr("checked", "checked");
	$("#point_a").removeAttr("checked");
	$( "#point_a" ).button( "refresh" );
	$( "#point_b" ).button( "refresh" );
	//устанавливаем координаты
	$( "#end_point_x" ).val(x);
	$( "#end_point_y" ).val(y);
    //alert(myPlacemarkA.geometry.getCoordinates());
}


function showDate(){
	if ($("#start_datetime").css("display") == "none")
		$('#start_datetime').css('display', 'block');
	else
		$('#start_datetime').css('display', 'none');
}

//показать форму карту маршрута
function showModalForm(x, y, myname, x2, y2, myname2){
	if (x <= 0 || y <= 0 || x2 <= 0 || y2 <= 0 )  { 
		return;
	} 
	if (!(myPlacemarkModalA===undefined))
		myMap.geoObjects.remove(myPlacemarkModalA);
	myPlacemarkModalA = new ymaps.Placemark([x, y], {
        content: 'Алматы',
        balloonContent: myname,
        iconContent: "<b>A1</b>",
    	}, {draggable: false});
	
   	myMap.setCenter([x, y], 16, {checkZoomRange: true})
    myMap.geoObjects.add(myPlacemarkModalA);
	
	if (!(myPlacemarkModalB===undefined))
		myMap.geoObjects.remove(myPlacemarkModalB);
	myPlacemarkModalB = new ymaps.Placemark([x2, y2], {
        content: 'Алматы',
        balloonContent: myname2,
        iconContent: "<b>Б1</b>",
    	}, {draggable: false});
	
    myMap.geoObjects.add(myPlacemarkModalB);
	/*
	$('#modal_map').reveal({
	     animation: 'none',                   
	     animationspeed: 300, 
	     closeonbackgroundclick: true,              
	     dismissmodalclass: 'close-reveal-modal'    
	});*/

}
//показать на форме карты маршрута точку А либо Б
function showModalPoint(p){

	if (p == 1){ 
		if (!(myPlacemarkModalA===undefined)){
			point = myPlacemarkModalA.geometry.getCoordinates();
			myMapModal.setCenter([point[0], point[1]], 16, {checkZoomRange: true});
		}	
	}	
	else{
		if (!(myPlacemarkModalB===undefined)){
			point = myPlacemarkModalB.geometry.getCoordinates();
			myMapModal.setCenter([point[0], point[1]], 16, {checkZoomRange: true});
		}	
		
	}
}
//показать форму отправки запроса
function showRequestForm(route_id){
	//если поиск по маршруту, передаем маршрут отправителя и получателя
	if ($("#chselectroute").prop("checked") && $("#route_id").val() > 0)		
		$("#modal_request_content").load("/route/modal-request-form/recipient_route_id/"+route_id+"/sender_route_id/"+$("#route_id").val());
	else
		$("#modal_request_content").load("/route/modal-request-form/recipient_route_id/"+route_id+"/sender_route_id/0");

	$('#modal_request').reveal({
	    animation: 'none',                   
	    animationspeed: 300, 
	    closeonbackgroundclick: true,              
	    dismissmodalclass: 'close-reveal-modal'    
	});

}
//показать форму просмотра маршрутов
function showRouteForm(){

	$("#modal_route_content").load("/route/index-ajax-content/mode/my-route-list");
	$('#modal_route').reveal({
	    animation: 'none',                   
	    animationspeed: 300, 
	    closeonbackgroundclick: true,              
	    dismissmodalclass: 'close-reveal-modal'    
	});

}

//по результатам выбора маршрута ставим чеки на днях недели
function refreshWeek(a){
	for (i=1; i<=7; i++)
		$("#chb" + i).removeAttr("checked");
	for (i=1; i<=7; i++)
		if (a.indexOf(i) != -1 )
			$('#chb' + i).attr("checked", "checked");
	for (i=1; i<=7; i++)
		$("#chb" + i).button( "refresh" );
}

//получение данных маршрута и заполнение формы поиска по данным маршрута
function getRouteData(route_id){
	$.ajax({
		type: 'POST',
		url: "/route/index-json/mode/get-route-data",
		data: {route_id:route_id},
		success: function(data){
			if (data.result == true) {
				
				$('#modal_route').trigger('reveal:close');
				$("#extend").trigger('click');
				//указываем точки на карте и выводим адреса
				setPointB(data.data.endpoint_name, data.data.endpointx, data.data.endpointy, false);
				setPointA(data.data.startpoint_name, data.data.startpointx, data.data.startpointy, true);
				//устанавливаем атрибуты периодичного или одноразового маршрута
				//если периодичный
				if (data.data.is_period == "1"){
					$("#is_period_1").trigger('click');
					$("#hour").val(data.data.start_time_hour);
					$("#minute").val(data.data.start_time_min);
					refreshWeek(data.data.week_days);
				}	
				else{
					$("#is_period_2").trigger('click');
					$("#a_start_date").html(data.data.start_datetime_date);
					$("#start_date").val(data.data.start_datetime_date);
					
					$("#hour").val(data.data.start_time_hour_single);
					$("#minute").val(data.data.start_time_min_single);
				}	
				
			} 
			else {
				alert("Ошибка при получении данных маршрута");
			}	
	   }
	});
	$("#route_param").load("/route/index-ajax-content/mode/my-route-list/route_id/"+route_id);
	$("#route_id").val(route_id);
}

function disableSearch(isactive){
	if (isactive)
		isdis = "disable";
	else
		isdis = "enable";
	
	$("#i_start_point_a").prop('disabled', isactive);
	$("#i_start_point_b").prop('disabled', isactive);
	$("#extend").button(isdis);
	$("#simple").button(isdis);
	$("#is_period_1").button(isdis);
	$("#is_period_2").button(isdis);
	$("#hour").prop('disabled', isactive);
	$("#minute").prop('disabled', isactive);
	$("#chb1").button(isdis);
	$("#chb2").button(isdis);
	$("#chb3").button(isdis);
	$("#chb4").button(isdis);
	$("#chb5").button(isdis);
	$("#chb6").button(isdis);
	$("#chb7").button(isdis);
	
	if (!isactive)
		$("#i_start_point_a").focus();
}

function formSubmit(){
	disableSearch(false);
	$('#frmSearch').submit();
}