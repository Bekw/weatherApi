$(document).ready(function() {
	$("#frmLogin").validate({
	        rules : {
					login : {required : true},
					password : {required : true}
	        },
	        messages : {
	        		login : {
	        				required : "Введите почту"	                        
	                },
	                password : {
	                	required : "Введите пароль"
	                }	                
	        }
		});
		$("#login").focus();
		
	
	
});

