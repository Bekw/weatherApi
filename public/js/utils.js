$(document).ready(function(){
    $(".blur").fadeOut(200);
	$.datepicker.regional['ru'] = {
					closeText: 'Закрыть',
					prevText: '&#x3c;Пред',
					nextText: 'След&#x3e;',
					currentText: 'Сегодня',
					monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
					'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
					monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
					'Июл','Авг','Сен','Окт','Ноя','Дек'],
					dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
					dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
					dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
					weekHeader: 'Нед',
					dateFormat: 'dd.mm.yy',
					firstDay: 1,
					isRTL: false,
					showMonthAfterYear: false,
					yearSuffix: ''
				};
	$.datepicker.setDefaults($.datepicker.regional['ru']);

//    $('select').styler();
//
//    $('.time-picker').timepicker({
//        hourGrid: 5,
//        minuteGrid: 10,
//        stepMinute: 10
//    });
//
    $( ".date-picker" ).datepicker({});
//    setTooltip();

    //$(".app-title").tooltip('disable');
});

/*
$(document).ajaxError(function(){
    showError('Ошибка при выполнении скрипта');
});
*/

function daysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

function strpos(haystack, needle, offset) {
    var i = (haystack+'').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}


//отображение сплывающей ошибки
function showError(err_msg){
    if (err_msg == ""){
        return;
    }
    var n = noty({
        text: err_msg,
        type: 'alert',
        template: '<div class="noty_message"><div class="error-sign"></div><div style="margin-top: 10px;color:red;"><span class="noty_text"></span><div class="noty_close"></div></div></div>',
        dismissQueue: true,
        layout: 'topRight',
        theme: 'defaultTheme',
        timeout: 5000
    });
}

//отображение сплывающего сообщения
function showInfo(err_msg){
    if (err_msg == ""){
        return;
    }
    var n = noty({
        text: err_msg,
        type: 'alert',
        template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        dismissQueue: true,
        layout: 'topRight',
        theme: 'defaultTheme',
        timeout: 2000
    });
}

//проверка времени
function validateTime(ob) {
    var value = ob.val();
    var re = /^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$/i;
    if(re.test(value)) {
        ob.removeClass("error");
        return true;
    }
    else {
        ob.focus();
        ob.addClass("error");
        return false;
    }
}

function setTooltip(){
    //$(document).tooltip();
    //$('#menu *[title]').tooltip('disable');
}

function goodIsAwaitingAlert(){
    showInfo("Поступление товара ожидается");
    return false;
}

function set_request_status(options, reason){
    $.ajax({
        type: 'POST',
        url: "/admin/cp-response/mode/fail_js/",
        data: {"options" : options, "reason" : reason},
        async: true,
        success: function(data){
            window.location.href = window.location.href;
        },
        error: function() {
            alert('Error occured');
        }
    });
}