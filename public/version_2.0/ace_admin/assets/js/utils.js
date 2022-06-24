$(document).ready(function() {
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
    $(".date-picker").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+0"
    });

    $('#span_year').html(new Date().getFullYear());

    Notify = {
        TYPE_INFO: 0,
        TYPE_SUCCESS: 1,
        TYPE_WARNING: 2,
        TYPE_DANGER: 3,

        generate: function (aText, aOptHeader, aOptType_int) {
            var lTypeIndexes = [this.TYPE_INFO, this.TYPE_SUCCESS, this.TYPE_WARNING, this.TYPE_DANGER];
            var ltypes = ['alert-info', 'alert-success', 'alert-warning', 'alert-danger'];
            var ltype = ltypes[this.TYPE_INFO];

            if (aOptType_int !== undefined && lTypeIndexes.indexOf(aOptType_int) !== -1) {
                ltype = ltypes[aOptType_int];
            }

            var lText = '';
            if (aOptHeader) {
                lText += "<h4>"+aOptHeader+"</h4>";
            }
            lText += "<p>"+aText+"</p>";
            var lNotify_e = $("<div class='alert "+ltype+"'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>"+lText+"</div>");

            setTimeout(function () {
                lNotify_e.alert('close');
            }, 3000);
            lNotify_e.appendTo($("#notifies"));
        }
    };

    $('#modal-container').on('hidden.bs.modal', function () {
        $(this).find('.modal-dialog').removeClass('modal-sm').removeClass('modal-md').removeClass('modal-lg').removeClass('modal-scroll');
        $(this).find('.modal-body').removeClass('modal-scroll');
    })
});

function colorLog(message, color) {

    color = color || "black";

    switch (color) {
        case "success":
            color = "Green";
            break;
        case "info":
            color = "DodgerBlue";
            break;
        case "error":
            color = "Red";
            break;
        case "warning":
            color = "Orange";
            break;
        default:
            color = color;
    }

    console.log("%c" + message, "color:" + color);
}
var WIDGET_MATERIAL_SET = {
    show_detail: function(material_set_id){
        $("#widget_material_set_info").load("/dict/material-set-widget-detail/material_set_id/" + material_set_id, function(){
            if (typeof widget_material_set_change === "function"){
                widget_material_set_change($("#widget_work_set_consumption").val(), $("#widget_work_set_formula").val());
            } else {
                console.log("function widget_material_set_change does not exists");
            }
        });
    }
}

function show_layout_notification_content(){
    $.ajax({
        type: 'POST',
        url: "/system/notification",
        global: false,
        success: function(data){
            $("#notification_block_layout").html(data);
        }
    });
}

function show_layout_notification() {
    $.ajax({
        type: 'POST',
        url: "/system/notification/mode/get-cnt",
        global: false,
        success: function(data){
            if(data.result['status']){
                if (data.result['value'] > 0){
                    $("#notification_block_cnt").html(data.result['value']).removeClass("icon-animated-bell").addClass("icon-animated-bell");
                    $('#email_cnt_not_reviewed').html(data.result['value']);
                    show_layout_notification_content();
                } else {
                    $("#notification_block_cnt").html("").removeClass("icon-animated-bell");
                    $("#notification_block_layout").html("<p class='text-center'>Нет сообщений</p>");
                    $('#email_cnt_not_reviewed').html('0');
                }
            }
            else{
                Notify.generate('Ошибка', data.result['error'], 3);
            }
        }
    });
}

function set_send_email_user_reviewed(send_email_user_id){
    $.ajax({
        type: 'POST',
        url: "/system/notification/mode/set-reviewed/",
        data: {send_email_user_id: send_email_user_id},
        success: function(data){
            if(data.result['status']){
                show_layout_notification();
            } else {
                Notify.generate('Ошибка', data.result['error'], 3);
            }

        }
    });
}

