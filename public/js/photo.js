$(document).ready(function() {
    //ЗАГРУЗКА ФОТОГРАФИИ ПРОФИЛЯ КНОПКА
	$('.fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {

        }
    });
    $('#fileupload').fileupload(
    	    'option',
    	    {
    	        sequentialUploads: true,
    	    }
   	);
    
    //просмотр фотографии в модальном окне
//	$("#gallery a").fancybox({'titlePosition':'inside','type':'image'});
});



