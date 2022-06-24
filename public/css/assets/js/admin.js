//отображение сплывающей ошибки
function showError(err_msg){
    if (err_msg == ""){
        return;
    }
    var n = noty({
        text: err_msg,
        type: 'alert',
        template: '<div class="noty_message"><div style="margin-top: 10px;color:red;"><span class="noty_text"></span><div class="noty_close"></div></div></div>',
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

jQuery(document).ready(function($) {
    var modal = $(".modal");
    var blur = $(".ui-widget-overlay");

    modal.hide();
    blur.hide();

    blur.click(function(e){
        e.preventDefault();
        blur.fadeOut(200);
        modal.fadeOut(200);
        $(".modal-form").fadeOut(200);
        $(".my-modal").fadeOut(200);
    });
});
function ajaxLoader(isShow){
    if (isShow){
        $(".ajax-loader").show();
    } else {
        $(".ajax-loader").hide();

    }
}

function showloader(obs, class_list, loader_class, what){
    if(what == 1){
        $(obs).each(function(i, ob){
            $(class_list).each(function(i, item){
                $(ob).removeClass(item).addClass(loader_class);
            });
        });
    }
    if(what == 0){
        $(obs).each(function(i, ob){
            $(class_list).each(function(i, item){
                $(ob).removeClass(loader_class).addClass(item);
            });
        });
    }
}