$(document).ready(function() {
	$("#frmReg").validate({
	        rules : {
					username : {required : true, minlength: 3},
					login : {required : true, minlength: 5, remote: "/ajax/checkemail"},
					password : {required : true, minlength: 6},
					passwordto: {equalTo: "#password"}
	        },
	        messages : {
	        		username : {
		            	required : "Введите пользователя",
		                minlength : "Введите не менее 3 символов"
		            },
	        		login : {
	        				required : "Введите почту",
	                        minlength : "Введите не менее 5 символов",
	                        remote : "Такой email уже зарегистрирован"
	                        
	                },
	                password : {
	                	required : "Введите пароль",
	                    minlength : "Введите не менее 6 символов"
	                },
	                passwordto: {
	                	equalTo: "Пароль несовпадает"
	                }
	                
	        }
		});
		$("#username").focus();
	
});