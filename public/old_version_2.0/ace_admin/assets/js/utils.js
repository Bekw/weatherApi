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

});