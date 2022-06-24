$(document).ready(function() {
    //ЗАГРУЗКА ФОТОГРАФИИ ПРОФИЛЯ КНОПКА
	$('#fileupload').fileupload({
        dataType: 'json',
        add: function (e, data){
            if (data.files[0].size/1024 > 10000){
                showError("Нельзя загружать файл больше 10 мб");
            }else{
                data.submit();
            }
        },
        done: function (e, data) {
            if (data.result.result == false){
                showError(data.result.error);
                $("#ajax-loader-photo").hide();
                return;
            }
            $("#ajax-loader-photo").hide();
        	$.ajax({
    			type: 'POST',
    			url: "/photo/index-ajax-content/mode/photo-list",
    			success: function(data){
    				//alert(data);
    				$("#photolist").html(data);
    				$("#gallery a").fancybox();
    				
    		   }
    		});
        },
        progressall: function (e, data) {
            $("#ajax-loader-photo").show();
        },

    });
    $('#fileupload').fileupload(
    	    'option',
    	    {
    	        sequentialUploads: true,
    	    }
   	);
    
    //ЗАГРУЗКА ФОТОГРАФИИ АВТО КНОПКА
    $('#fileuploadauto').fileupload({
        dataType: 'json',
        add: function (e, data){
            if (data.files[0].size/1024 > 10000){
                showError("Нельзя загружать файл больше 10 мб");
            }else{
                data.submit();
            }
        },
        done: function (e, data) {
            if (data.result.result == false){
                showError(data.result.error);
                $("#ajax-loader-auto").hide();
                return;
            }
            $("#ajax-loader-auto").hide();
            $.ajax({
                type: 'POST',
                url: "/photo/index-ajax-content/mode/auto-photo-list",
                success: function(data){
                    //alert(data);
                    $("#photolist-auto").html(data);
                    $("#gallery a").fancybox();

                }
            });
        },
        progressall: function (e, data) {
            $("#ajax-loader-auto").show();
        },

    });
    $('#fileuploadauto').fileupload(
        'option',
        {
            sequentialUploads: true,
        }
    );


    //просмотр фотографии в модальном окне
	$("#gallery a").fancybox({'titlePosition':'inside','type':'image'});

    $("#preview").bind('load', function() {
        $('.img-circle').show('slow');
    });

    $(document).ajaxError(function(){
        $("#ajax-loader-line").hide();
    });
    $(document).ajaxComplete(function(){
        $("#ajax-loader-line").hide();
    });


});

//СДЕЛАТЬ ОСНОВНЫМ
function setMain(is_profile){
	$.ajax({
		type: 'POST',
		url: "/photo/set-profile-photo-main",
		data: {id: $("#main-photo-id").val(),is_profile: is_profile, x1: $("#x1").val(), x2: $("#x2").val(), y1: $("#y1").val(), y2: $("#y2").val()},
		success: function(data){
			$("#photolist").html(data);
			if (is_profile=='1')
				getMainPhoto();
	   }
	});
}
//УДАЛИТЬ ФОТО
function delPhoto(id,is_profile){
	$.ajax({
		type: 'POST',
		url: "/photo/delete",
		data: {id: id,is_profile: is_profile},
		success: function(data){
            if (is_profile=='1') {
				$("#photolist").html(data);
				$("#gallery a").fancybox();
            } else {
                $("#photolist-auto").html(data);
                $("#gallery a").fancybox();
            }
		}
	});
}
//ОБНОВИТЬ ГЛАВНУЮ ФОТОГРАФИЮ АВАТАРКУ
function getMainPhoto(){
	$.ajax({
		type: 'POST',
		url: "/photo/index-json/mode/get-main-photo",
		success: function(data){
			$("#profile_logo_img").attr("src",data.photourl);
	   }
	});

}

//ПОКАЗАТЬ МОДАЛЬНОЕ ОКНО СДЕЛАТЬ ФОТО ОСНОВНЫМ
function showPhotoMainForm(photo_id){
    $("#main-photo-id").val(photo_id);
    url = "/photo/index-ajax-content/mode/photo-main-img/photo_id/" + photo_id;
    $('#photo-main-form-body').empty();
    $('.img-circle').hide();
    $('#photo-set-main-ajax').show();
    $('#photo-main-form-body').load(url, function(){
        $('#photo-set-main-ajax').hide();
        $.ajax({
            type: 'POST',
            url: "/photo/index-json/mode/get-photo-url",
            data: {photo_id: photo_id},
            success: function(data){
                $('#preview').attr('src', data.photourl);
            }
        });
    });
    $('#photoSettingsModal').modal();
    //для обрезки фото



}



