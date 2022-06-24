$(document).ready(function() {
		$("#btregistertop").click(function() {
			window.location = '/auth/register/';
		});
		
		$("#frmTopLogin").submit(function() {
			frmTopLogin.submit();
		});
		/*
		$('input[class="form-input-top"]').keypress(function (event) {
			if (event.which == '13') {
				event.preventDefault();
		        $("#btlogintop").click();
		    }
		});*/
		$("#logintop").focus();
});

