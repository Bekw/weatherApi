var socket;
$(document).ready(function() {
	socket = io.connect('http://tezway.kz:8883?user_id=' + $("#user_id").val() + '&hash_id=' + $("#hash_id").val());
	socket.on("private", function(data) {	
		if (data.from == $("#user_id").val() || data.from == $("#s_user_id").val())  
			addRow(data.from, data.msg, data.msgTime);
	});			
	socket.on("typing", function(data) {	
		$("#typing").empty();
		if (data.from == $("#s_user_id").val()) 
			$("#typing").html("<img src='/css/image/typing.gif' style='padding-right: 10px;'>" + $("#s_user_name").val() + " печатает...");
	});			
	

	$("#message_text").keypress(function(event) {
	  socket.emit("typing", { msg: 'typing', to: $("#s_user_id").val() });
	  if (!event.ctrlKey && event.which == 13 ) {
	     //socket.emit("private", { msg: $("#message_text").val(), to: $("#s_user_id").val() });
	     //writeToDB();
          sendMessage();
	   }

      if (event.ctrlKey && event.which == 13 ) {
        t = $("#message_text").val();
        $("#message_text").val(t + "<br>" + "\n");
      }

	});
	
	var Timer = setInterval(function(){
		$("#typing").empty();
	},5000);
	
	$("#btnok").click(function() {
		//alert( $("#msg_table tr:last").hasClass("new"));
	});
    setResize();

});

$(window).resize(function(){
    setResize();
});

function addRow(from, msg, msgTime){
	isOut = $("#msg_table tr:last").hasClass("out");
	//если последнее сообщение пользователя и текущее сообщение пользователя
	if (from == $("#user_id").val() && isOut){
		content = "<TR class='out old'>";
		content = content + getRow($("#user_id").val(), $("#user_name").val(), msg, msgTime);
		content = content + "</TR>";
		$("#msg_table tbody").append(content);
	}
	//если последнее сообщение собеседника и текущее сообщение собеседника
	if (from == $("#s_user_id").val() && !isOut){
		content = "<TR class='in old'>";
        content = content + getRow($("#s_user_id").val(), $("#s_user_name").val(), msg, msgTime);
		content = content + "</TR>";
		$("#msg_table tbody").append(content);
	}
	//если последнее сообщение пользователя и текущее собеседника
	if (from == $("#s_user_id").val() && isOut){
		content = "<TR><td colspan='3'>&nbsp;</td></TR><TR class='in new'>";
        content = content + getRow($("#s_user_id").val(), $("#s_user_name").val(), msg, msgTime);
		content = content + "</TR>";
		$("#msg_table tbody").append(content);
	}
	//если последнее сообщение собеседника и текущее сообщение пользователя
	if (from == $("#user_id").val() && !isOut){
		content = "<TR><td colspan='3'>&nbsp;</td></TR><TR class='out new'>";
        content = content + getRow($("#user_id").val(), $("#user_name").val(), msg, msgTime);
		content = content + "</TR>";
		$("#msg_table tbody").append(content);
	}
    $(window).scrollTop($(document).height());
	
}

function getRow(user_id, user_name, msgText, msgTime){
    if ($('#s_user_id').val() == user_id) {
            img=$('#image_sender').val();
    } else
    {
        img=$('#image_user').val();
    }
    content = "";
    content = content + "<TD><DIV class='image_box'><IMG SRC='"+img+ "'><DIV></DIV></DIV></TD>";
    content = content + "<TD style='vertical-align:top; '>"+
                            "<DIV class='text_box message-body' >"+
                                "<div class='message-info'>"+
                                    "<p class='message-author'>"+user_name+"</p>"+
                                "</div>"+
                                "<div class='message-text'>"+
                                    msgText+
                                "</div>"+
                            "</DIV>"+
                        "</TD>";

    content = content + "<TD style='vertical-align: top; width: 100px;'><div class='time_box'><p class='message-date'>"+msgTime+"</p></div></TD>";
    return content;
}


function sendMessage(){
    socket.emit("private", { msg: $("#message_text").val(), to: $("#s_user_id").val() });
    writeToDB();
    $("#message_text").val("");
    $(window).scrollTop($(document).height());
}

function writeToDB(){
	msg = $("#message_text").val();
	s_user_id = $("#s_user_id").val();
	
	$.ajax({
		type: 'POST',
		url: "/dialog/index-json/mode/insert-msg",
		data: {s_user_id: s_user_id, msg: msg},
		success: function(data){
		     $("#message_text").val("");
		}
	});

}

function setResize(){
    //Размеры для карты
    $w = document.body.clientWidth;
    $h = window.innerHeight;
    $('.dialog-content-container .content-block').css('min-height',$h + 'px');
    
}














