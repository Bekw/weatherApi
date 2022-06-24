$(document).ready(function(){
	//alert('a');
});

ymaps.ready(init);
var myMapModal, 
    myPlacemarkModalA,
    myPlacemarkModalB;

function init(){ 
    myMapModal = new ymaps.Map ("global_modal_map", {
        center: [76.911648, 43.279807],
        zoom:11,
        behaviors: ['default', 'scrollZoom']
    });
    x = $("#x1").val();
    y = $("#y1").val();
    x2 = $("#x2").val();
    y2 = $("#y2").val();
    myname = $("#myname1").val();
    myname2 = $("#myname2").val();
    
	if (x <= 0 || y <= 0 || x2 <= 0 || y2 <= 0 )  { 
		return;
	} 
	if (!(myPlacemarkModalA===undefined))
		myMapModal.geoObjects.remove(myPlacemarkModalA);
	myPlacemarkModalA = new ymaps.Placemark([x, y], {
        content: 'Алматы',
        balloonContent: myname,
        iconContent: "<b>A</b>",
    	}, {draggable: false});
	
   	myMapModal.setCenter([x, y], 16, {checkZoomRange: true})
    myMapModal.geoObjects.add(myPlacemarkModalA);
	
	if (!(myPlacemarkModalB===undefined))
		myMapModal.geoObjects.remove(myPlacemarkModalB);
	myPlacemarkModalB = new ymaps.Placemark([x2, y2], {
        content: 'Алматы',
        balloonContent: myname2,
        iconContent: "<b>Б</b>",
    	}, {draggable: false});
	
    myMapModal.geoObjects.add(myPlacemarkModalB);
}

