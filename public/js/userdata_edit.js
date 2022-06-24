$(document).ready(function(){
    $('select').styler();
	$("#mm").val(parseInt($("#date_birth_mm").val(), 10));
    $("#mm").trigger('refresh');
	populateDays();
	$("#dd").val(parseInt($("#date_birth_dd").val(), 10));
    $("#dd").trigger('refresh');

	$("#mm").change(populateDays);
	$("#yyyy").change(populateDays);
	$("#country").change(populateCity);
	$("#car_brand").change(populateCarModel);
    /*
    jQuery.propHooks.checked = {
        set: function (el, value) {
            el.checked = value;
            $(el).trigger('change');
        }
    };*/
    /*
    $("#a-is-driver").change(function(){
        setDriver();
    });*/

    console.log('edit ready');
	
});

function populateDays(){
	var mm=$("#mm").val();
	var yyyy=$("#yyyy").val();
	var dd=daysInMonth(mm,yyyy);
	var tmp = $("#dd").val();
	console.log(tmp);
    $("#dd").empty();
	for (i=1;i<=dd;i++){
		$("#dd").append('<option value="'+i+'">'+i+'</option>');
	}    
	$("#dd").val(tmp);
    $("#dd").trigger('refresh');
}

function setSex(id){
	$('#gender').val(id);
	if (id == 1){
		$('#man').removeClass("a-doted").addClass("a-selected");
		$('#woman').removeClass("a-selected").addClass("a-doted");
	}else{
		$('#woman').removeClass("a-doted").addClass("a-selected");
		$('#man').removeClass("a-selected").addClass("a-doted");
	}
		
}

function setDriver(){
    if ($("#a-is-driver").attr("checked") == "checked"){
        $('#is_driver').val(1);
        $('#auto-content').show();
    } else {
        $('#is_driver').val(0);
        $('#auto-content').hide();
    }
    /*
	isDriver = $('#is_driver').val();
	if (isDriver == 1){ 
		$('#is_driver').val(0);
		$('#auto-content').hide();
	}
	else{
		$('#is_driver').val(1);
		$('#auto-content').show();
	}*/
}

function setPassenger(){
    if ($("#a-is-passenger").attr("checked") == "checked"){
        $('#is_passenger').val(1);
    } else {
        $('#is_passenger').val(0);
    }
    /*
	ispassenger = $('#is_passenger').val();
	if (ispassenger == 1) {
		$('#is_passenger').val(0);
		$('#a-is-passenger').removeClass("a-selected").addClass("a-doted");
	}	
	else{
		$('#is_passenger').val(1);
		$('#a-is-passenger').removeClass("a-doted").addClass("a-selected");
	}*/
	    
}

function getCountry(id){
	$.getJSON(
			'/userdata/index-json/mode/get-country',
			{ id: id},
			function(data) {
				 $.each(data.country, function(i,item){
					 if (id == item.region_id)
						 $("#country").append('<option selected value="'+item.region_id+'">'+item.region_name+'</option>');
					 else
						 $("#country").append('<option value="'+item.region_id+'">'+item.region_name+'</option>');
				 });
				 populateCity($("#city_hidden").val());
			}
	);
	//populateCity(0);
}
function populateCity(id){
	region_id=$("#country").val();
	/*
	if (region_id == null)
		region_id = 1;
	*/	
	$("#city").empty();
	$.getJSON(
			'/userdata/index-json/mode/get-city',
			{ id: region_id},
			function(data) {
				 $.each(data.country, function(i,item){
					if (id == item.region_id)
						$("#city").append('<option selected value="'+item.region_id+'">'+item.region_name+'</option>');
					else
						$("#city").append('<option value="'+item.region_id+'">'+item.region_name+'</option>');
				 });
                 $("#city").trigger('refresh');
			}
	);

}

function populateCarBrand(){
	$.getJSON(
			'/userdata/index-json/mode/get-car-brand',
			{ id: 0},
			function(data) {
				 $.each(data.carbrand, function(i,item){
					 $("#car_brand").append('<option value="'+item.car_brand_id+'">'+item.car_brand_name+'</option>');
				 });
				 $("#car_brand").val($("#car_brand_id").val());
                 $("#car_brand").trigger('refresh');
                 populateCarModel();
				 
			}
	);

	//populateCity(0);
}

function populateCarModel(){  
	$("#car_model").empty();
	car_brand_id = $("#car_brand").val();
	$.getJSON(
			'/userdata/index-json/mode/get-car-model',
			{ id: car_brand_id},
			function(data) {
				 $.each(data.carmodel, function(i,item){
					 $("#car_model").append('<option value="'+item.car_model_id+'">'+item.car_model_name+'</option>');
				 });
				 $("#car_model").val($("#car_model_id").val());
                 $("#car_model").trigger('refresh');
			}
	);

	//populateCity(0);
}

function setDriveLicense(id){
	p = $('#is' + id).val();
	if (p == 1){ 
		$('#is' + id).val(0);
		$('#a-is' + id).removeClass("a-selected").addClass("a-doted");
	}	
	else{
		$('#is' + id).val(1);
		$('#a-is' + id).removeClass("a-doted").addClass("a-selected");
	}	
}