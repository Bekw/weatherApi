$(document).ready(function(){
	$("#frmRouteEdit").formwizard({
	 	formPluginEnabled: false,
	 	validationEnabled: true,
	 	focusFirstInput : true,
	 	formOptions :{
			success: function(data){$("#status").fadeTo(500,1,function(){ $(this).html("You are now registered!").fadeTo(5000, 0); })},
			beforeSubmit: function(data){$("#data").html("data sent to the server: " + $.param(data));},
			dataType: 'json',
			resetForm: false
	 	}, 
	 	disableUIStyles : true,
	 	textSubmit: 'Сохранить',
	 	textNext: 'Далее',
	 	textBack: 'Назад',
	 	validationOptions : {
	 		rules: {
				startpoint_name: "required",
				endpoint_name: "required"
			},
			messages: {
				startpoint_name: "Введите пункт отправки",
				endpoint_name: "Введите пункт назначения"
			}
	 	}
	 	
	 }
	);
	
	$("#frmRouteEdit").bind("step_shown", function(event,data){
		if (data.previousStep  == "first"){
			$("#yPointA").html( $("#i_start_point_a").val() );
			$("#yPointB").html( $("#i_start_point_b").val() );
			$("#startpoint_name").val( $("#i_start_point_a").val() );
			$("#endpoint_name").val( $("#i_start_point_b").val() );
		}
		if (data.previousStep  == "second"){
			$("#info_startpoint_name").html($("#startpoint_name").val());
			$("#info_endpoint_name").html($("#endpoint_name").val());
			
			//указать координаты из карты Яндекс
			if (!(myPlacemarkA===undefined)){
				mypoint = myPlacemarkA.geometry.getCoordinates();
				$("#startpointx").val(mypoint[0]);
				$("#startpointy").val(mypoint[1]);
			}
			if (!(myPlacemarkB===undefined)){
				mypoint = myPlacemarkB.geometry.getCoordinates();
				$("#endpointx").val(mypoint[0]);
				$("#endpointy").val(mypoint[1]);
			}

		}
		
	})	
	
	if ($("#is_period").val()==1){
		$('#d_is_period').css('display', 'block');
		$('#d_isnot_period').css('display', 'none');	
	}else
	{
		$('#d_is_period').css('display', 'none');
		$('#d_isnot_period').css('display', 'block');
	}
	
	if ($("#is_twoway").val()==1){
		$('#d_is_twoway_single').css('display', 'block');
		$('#d_is_twoway_multy').css('display', 'block');
	}else
	{
		$('#d_is_twoway_single').css('display', 'none');
		$('#d_is_twoway_multy').css('display', 'none');
	}	
	
	$( "#start_datetime" ).datepicker({
		showOn: "button",
		buttonImage: "/css/image/calendar.gif",
		buttonImageOnly: true
	});
	$( "#end_datetime" ).datepicker({
		showOn: "button",
		buttonImage: "/css/image/calendar.gif",
		buttonImageOnly: true
	});
	
	$("#reward").keypress(function (evt) {
		evt = (evt) ? evt : window.event;
    	var charCode = (evt.which) ? evt.which : evt.keyCode;
    	if (charCode != 8 && charCode != 46 && charCode != 37 && charCode != 39 && (charCode < 48 || charCode > 57)) {
        	status = "This field accepts numbers only.";
        	return false;
    	}
    	status = "";
    	return true;
	});	
	
});

function setPeriod(id){
	$('#is_period').val(id);
	if (id == 1){
		$('#a_is_period').removeClass("a-doted").addClass("a-selected");
		$('#a_isnot_period').removeClass("a-selected").addClass("a-doted");
		$('#d_is_period').show('blind');
		$('#d_isnot_period').hide('blind');
	}else{
		$('#a_isnot_period').removeClass("a-doted").addClass("a-selected");
		$('#a_is_period').removeClass("a-selected").addClass("a-doted");
		$('#d_is_period').hide('blind');
		$('#d_isnot_period').show('blind');
		
	}
		
}

function getCountry(id){
	$.getJSON(
			'/userdata/getcountry',
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

function setWeek(id){
	p = $('#is' + id).val();
	if (p == 1){ 
		$('#is' + id).val(0);
		$('#a_is' + id).removeClass("weekselect").addClass("week");
	}	
	else{
		$('#is' + id).val(1);
		$('#a_is' + id).removeClass("week").addClass("weekselect");
	}	
}

function setCancel(id){
	if (id == 'start_time'){
		$('#start_time_hour').val(0);
		$('#start_time_min').val(0);
	} else if (id == 'end_time'){
		$('#end_time_hour').val(0);
		$('#end_time_min').val(0);
	} else if (id == 'start_time_single'){
		$('#start_time_hour_single').val(0);
		$('#start_time_min_single').val(0);
		$('#start_datetime').val('');
	} else if (id == 'end_time_single'){
		$('#end_time_hour_single').val(0);
		$('#end_time_min_single').val(0);
		$('#end_datetime').val('');
	}
}

function setTwoWay(){
	p = $('#is_twoway').val();
	
	if (p == 1){ 
		$('#is_twoway').val(0);
		$('#a_is_twoway').removeClass("a-selected").addClass("a-doted");
		$('#d_is_twoway_single').hide('blind');
		$('#d_is_twoway_multy').hide('blind');
	}	
	else{
		$('#is_twoway').val(1);
		$('#a_is_twoway').removeClass("a-doted").addClass("a-selected");
		$('#d_is_twoway_single').show('blind');
		$('#d_is_twoway_multy').show('blind');
		
	}
}
