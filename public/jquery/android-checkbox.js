/*
 * jQuery android styler checkbox addon
 * By: Akshabayev Aidar
 * Version 1.0.0
 * Last Modified: 14.04.2013
 * Вызывать только один раз в коде, так как несколько
 * вызовов дублируют функции и происходит ошибка (надо разобраться)
 */

(function($) {
    jQuery.fn.androidCheckbox = function(options){
        // настройки по умолчанию
        var options = jQuery.extend({
            isDisabled: true,
            bgColor2: 2
        },options);

        /*
        jQuery(this).click(function(){
            setChanges(jQuery(this));
        })*/

        $('.slideTwo > label').live('mouseover',function(){
            var pos;
            $('label').draggable({
                axis: "x",
                containment: "parent",
                start: function() {
                    pos = $(this).offset().left;
                },
                drag: function() {
                },
                stop: function() {
                    pos2 = $(this).offset().left;
                    if (pos2 > pos){
                        ob = $(this).siblings("input");
                        ob.prop("checked", true);
                        setChanges(ob);
                    } else {
                        ob = $(this).siblings("input");
                        ob.prop("checked", false);
                        setChanges(ob);
                    }
                }
            });;
        });

        $('.slideTwo').live('click',function(){
            ob = $(this).children('input');
            console.log("slideTwo " + ob.prop("checked"));
            if (ob.prop("checked")==true){
                ob.prop("checked", false);
                console.log("slideTwo true click");
            } else {
                ob.prop("checked", true);
                console.log("slideTwo false click");
            }
            setChanges(ob);
        });

        return this.each(function() {

            jQuery(this).wrap("<div class='slideTwo'></div>");
            id = jQuery(this).attr('id');
            jQuery(this).hide();
            jQuery(this).after("<label for='"+id+"' style='left:28px;' ></label>");
            setChanges(jQuery(this));


        });

        function setChanges(obj){
            if (obj.prop("checked")==true){
                ob = obj.siblings("label");
                ob.css("left", "28px");
                ob = obj.closest(".slideTwo");
                if (options.isDisabled){
                    ob.removeClass("disabled-checkbox");
                }

            } else {
                ob = obj.siblings("label");
                ob.css("left", "0");
                ob = obj.closest(".slideTwo");
                if (options.isDisabled){
                    ob.addClass("disabled-checkbox");
                }
            }

        }
    };



})(jQuery);
