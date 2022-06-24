$(document).ready(function(){
	$('#a_type_map').data('val', 1);
	$('#a_type_name').data('val',0);
		
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
var myMap, myPlacemarkA, myPlacemarkB;

function init(){ 
    myMap = new ymaps.Map ("map", {
        center: [76.911648, 43.279807],
        zoom:11,
        behaviors: ['default', 'scrollZoom']
    });
    myMap.controls.add('typeSelector');
    
    var cursor = myMap.cursors.push("arrow");
    myMap.controls.add('zoomControl', {right: '0px', top: '35px'});
    //myMap.setType('yandex#publicMap');

    myMap.events.add('click', function (e) {
    	var coords = e.get('coordPosition');
    	x = coords[0].toPrecision(6);
    	y = coords[1].toPrecision(6);
    	getNameByCoord(x, y);
	});
    
	if ($("#startpointx").val() == "")
		setPointA("Алматы, 28 гвардейцев-панфиловцев парк", 76.954008, 43.258807, true);
	else {
		setPointA($("#startpoint_name").val(), $("#startpointx").val(), $("#startpointy").val(), true);
		$("#i_start_point_a").val( $("#startpoint_name").val() );   
	}	
	
	if ($("#startpointy").val() == "")
		setPointB("Алматы, улица Казыбек би, 41", 76.9578, 43.2584, false);
	else{
		setPointB($("#endpoint_name").val(), $("#endpointx").val(), $("#endpointy").val(), false);
		$("#i_start_point_b").val( $("#endpoint_name").val() );
	}	
	
	
	
}

function setPoint(p, isCenter){
	if (p == 1){ 
		$('#point_value').val(1);
		$('#a_point_a').removeClass("a-doted").addClass("a-selected");
		$('#a_point_b').removeClass("a-selected").addClass("a-doted");
		if (!(myPlacemarkA===undefined)){
			point = myPlacemarkA.geometry.getCoordinates();
			if (isCenter) {
				myMap.setCenter([point[0], point[1]], 16, {checkZoomRange: true});
			}	
			
		}	
	}	
	else{
		$('#point_value').val(2);
		$('#a_point_b').removeClass("a-doted").addClass("a-selected");
		$('#a_point_a').removeClass("a-selected").addClass("a-doted");
		if (!(myPlacemarkB===undefined)){
			point = myPlacemarkB.geometry.getCoordinates();
			if (isCenter) {
				myMap.setCenter([point[0], point[1]], 16, {checkZoomRange: true});
			}	

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
		    	id = $('#point_value').val();
		    	if (id == 1)
		    		setPointA(myname, point[0], point[1], isCenter);
		    	else
		    		setPointB(myname, point[0], point[1], isCenter);
		    	
		    },
		    function (err) {
		        alert('Ошибка');
		    }
		);
	}
	else{
		id = $('#point_value').val();
		if (id == 1)
			setPointA(myname, x, y, isCenter);
		else
			setPointB(myname, x, y, isCenter);
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

    if (isCenter) myMap.setCenter([x, y], 16, {checkZoomRange: true});
    
    myMap.geoObjects.add(myPlacemarkA);
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

    if (isCenter) myMap.setCenter([x, y], 16, {checkZoomRange: true});
    myMap.geoObjects.add(myPlacemarkB);
    //alert(myPlacemarkA.geometry.getCoordinates());
}

