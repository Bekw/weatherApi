$(document).ready(function(){
    $("#tbody_basket_table").load("/index/basket-items-table/");
    calculateSum();
    $("#telephone").mask("+7(999) 999 99 99");
    $("#data_form").validate({
        rules : {
            name : {required : true},
            email : {required : true,email:true},
            address : {required : true},
            telephone : {required : true},
            'city_id' : {min:1}
        },
        messages:{
            name: {required: "Укажите Имя и Фамилию (обязательно)"},
            email: {required: "Укажите Email",email:"Неправильный формат"},
            address: {required: "Укажите Адрес"},
            telephone: {required: "Укажите Телефон"},
            'city_id' : {min: "Выберите город"}
        }
    });
    mixpanel.track("Basket Page");
    fbq('track', "Basket Page");
    setProductsToCookie();
});
function calculateSum(){
    $.ajax({
        type: 'POST',
        url: "/index/index-json/mode/calculate-sum/",
        success: function(data){
            $(".total_sum").html(data.sum);
            $(".bonus_sum").html(parseInt(data.bonus_sum));
//                $(".bonus-count").attr("value",data.bonus_count);
        }
    });
}
function incrementCount(product_id,ob){
    count = $(ob).closest("td").find("input").val();
    count++;
    $(ob).closest("td").find("input").attr("value",count);
    price = $(ob).closest("tr").find(".product_price").find("span").html();
    summa = count*price;
//        $(ob).closest("tr").find(".sum").html(summa);
    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/change-product-unit/product_id/" + product_id + "/unit/" + count + "/",
        success: function(data){
            if(data.result == false){
                showError(data.exception);
            }
            else{
                //$(".scroll-basket-items").empty;
                //$(".scroll-basket-items").load("/index/basket-items/");
                $('#tbody_basket_table').fadeOut('normal');
                $("#tbody_basket_table").load("/index/basket-items-table/");
                $('#tbody_basket_table').fadeIn('normal');
                calculateSum();
                gtag_basket();
                if ( document.readyState === "complete" ) {
                }
            }
        }
    });
}
function decrementCount(product_id,ob){
    count = $(ob).closest("td").find("input").val();
    count--;
    if(count < 1){
        $(ob).closest("td").find("input").attr("value",1);
        count = 1;
        price = $(ob).closest("tr").find(".product_price").find("span").html();
        summa = count*price;
//            $(ob).closest("tr").find(".sum").html(summa);
    }
    else{
        $(ob).closest("td").find("input").attr("value",count);
        price = $(ob).closest("tr").find(".product_price").find("span").html();
        summa = count*price;
//            $(ob).closest("tr").find(".sum").html(summa);
    }

    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/change-product-unit/product_id/" + product_id + "/unit/" + count + "/",
        success: function(data){
            if(data.result == false){
                showError(data.exception);
            }
            else{
                //$(".scroll-basket-items").empty;
                //$(".scroll-basket-items").load("/index/basket-items/");
                $('#tbody_basket_table').fadeOut('normal');
                $("#tbody_basket_table").load("/index/basket-items-table/");
                $('#tbody_basket_table').fadeIn('normal');
                calculateSum();
                gtag_basket();
                if ( document.readyState === "complete" ) {
                }
            }
        }
    });
}
function removeItemFromBasket(product_id,ob){
    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/delete-product-from-basket/product_id/" + product_id + "/",
        success: function(data){
            if(data.result != false || data.result == 0 ){
                $(ob).closest("tr").remove();
                //$(".scroll-basket-items").empty;
                //$(".scroll-basket-items").load("/index/basket-items/");
                $('#tbody_basket_table').fadeOut('normal');
                $("#tbody_basket_table").load("/index/basket-items-table/");
                $('#tbody_basket_table').fadeIn('normal');
                $("#basket_item_count").html(data.result);
                $("#mobile_basket_item_count").html(data.result);
                calculateSum();
                if ( document.readyState === "complete" ) {
                }
            }
            else{
                showError(data.exception);
            }
        }
    });
}
function changeSum(product_id,ob){
    count = $(ob).val();
    if(count > 0){
        price = $(ob).closest("tr").find(".product_price").find("span").html();
        summa = count*price;
//            $(ob).closest("tr").find(".sum").html(summa);
    }
    else{
        $(ob).val(1);
        count = $(ob).val();
        price = $(ob).closest("tr").find(".product_price").find("span").html();
//            $(ob).closest("tr").find(".sum").html(price);
    }

    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/change-product-unit/product_id/" + product_id + "/unit/" + count + "/",
        success: function(data){
            if(data.result == false){
                showError(data.exception);
            }
            else{
                //$(".scroll-basket-items").empty;
                //$(".scroll-basket-items").load("/index/basket-items/");
                $('#tbody_basket_table').fadeOut('normal');
                $("#tbody_basket_table").load("/index/basket-items-table/");
                $('#tbody_basket_table').fadeIn('normal');
                calculateSum();
            }
        }
    });
}
function saveRequest(){
    if (!$("#data_form").valid()){
        return false;
    }
    if($(".total_sum").html() == 0){
        showInfo("Ваша корзина пуста");
        return false;
    }

    if($("#is_evening_courier").val() == 1 && $(".evening-courier-select").val() == 0){
        showInfo("Выберите время");
        return false;
    }
    $(".blur").fadeIn(200);
    ajaxLoader(true);

    current_request_id = null;
    current_all_sum = $(".total_sum").html();
    email_form = $("#email_form").val();
    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/get-request-id/",
        success: function(data){
            if(data.result == false){
                showError(data.exception);
            }
            else{
                current_request_id = data.result['request_id'];
            }
        }
    });
    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/make-request/",
        data: $("#data_form").serialize(),
        success: function(data){
            analytic.makeRequestStepTwo();
            if(data.result['status'] == "NOT_PRODUCTS"){
                $(".blur").fadeOut(200);
                ajaxLoader(false);
                alert("У вас корзина пуста. Обновите страницу");
                return false;
            }
            else if(data.result['status'] == "PRODUCT_CHANGES"){
                ajaxLoader(false);
                $(".price-changed-products-block").css("display","none");
                $(".deleted-products-block").css("display","none");
                if(data.result['price_changed_products'].length > 0){
                    $(".price-changed-products-block").css("display","block");
                    $(".price-changed-products-block").find(".price-changed-products-p").html(data.result['price_changed_products']);
                }

                if(data.result['deleted_products'].length > 0){
                    $(".deleted-products-block").css("display","block");
                    $(".deleted-products-block").find(".deleted-products-p").html(data.result['deleted_products']);
                }
                $(".modal-basket-product-price-changes").fadeIn(200);
            }
            else if(data.result['status'] == true){
                $(".blur").fadeOut(200);
                ajaxLoader(false);
                //mixpanel.track("Purchase");
                //fbq('track', 'Purchase', {value: current_all_sum, currency: 'USD'});
//                    mixpanel.identify(email_form);
                /* _kmq.push(['identify', email_form]);

                 cur_id = "'"+current_request_id+"'";
                 email_f = "'"+email_form+"'";
                 cur_a_s = "'"+current_all_sum+"'";
                 ga('ecommerce:addTransaction', {
                 'id': cur_id,        		  // Transaction ID. Required.
                 'affiliation': email_f,       // Email
                 'revenue': cur_a_s,      	  // Grand Total.
                 'currency': 'KZT'
                 });
                 ga('ecommerce:send');
                 */
                window.location.href = "/index/success-order/";
            }
            else{
                showInfo("Ошибка при отправке");
            }
        }
    });
}

function saveRequestByBonus(){
    if (!$("#data_form").valid()){
        return false;
    }
    if($(".total_sum").html() == 0){
        showInfo("Ваша корзина пуста");
        return false;
    }
    $(".blur").fadeIn(200);
    ajaxLoader(true);

    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/compare-bonus-request-price/",
        data: $("#data_form").serialize(),
        success: function(data){
            if(data.result == "IS_ATYRAU"){
                $(".blur").fadeOut(200);
                ajaxLoader(false);
                alert("С 29 октября по 1 ноября (включительно) заявки по городу Атырау не принимаются.\n Приносим свои извинения за предоставленные неудобства!");
                return false;
            }
            else if(data.result == true){
                $(".blur").fadeOut(200);
                ajaxLoader(false);

                mixpanel.track("Purchase");
                fbq('track', "Purchase");
//                    mixpanel.identify(email_form);
                /* _kmq.push(['identify', email_form]);

                 cur_id = "'"+current_request_id+"'";
                 email_f = "'"+email_form+"'";
                 cur_a_s = "'"+current_all_sum+"'";
                 ga('ecommerce:addTransaction', {
                 'id': cur_id,        		  // Transaction ID. Required.
                 'affiliation': email_f,       // Email
                 'revenue': cur_a_s,      	  // Grand Total.
                 'currency': 'KZT'
                 });
                 ga('ecommerce:send');
                 */
                analytic.makeRequestStepTwo();
                window.location.href = "/index/success-order/";
            }
            else if(data.result == "SMALL_BONUS"){
                ajaxLoader(false);
                $(".blur").fadeOut(200);
                showInfo("Ваш баланс меньше суммы покупки");
                return false;
            }
            else{
                ajaxLoader(false);
                $(".blur").fadeOut(200);
                showError("Ошибка при отправке");
            }
        }
    });
}
function setProductsToCookie(){
    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/get-user-products-by-session/",
        success: function(data){
            if(data.result == false){
//                    showError(data.exception);
            }
            else{
                res = data.result;
                if(res != null){
                    var arr = new Array();
                    res.forEach(function(entry) {
                        arr.push(entry['product_id']);
                    });
                    console.log(arr);
                    var expires = "";
                    document.cookie = "session_products="+arr+expires+"; path=/";
                }
            }
        }
    });

    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/get-request-id/",
        success: function(data){
            if(data.result == false){
//                    showError(data.exception);
            }
            else{
                res2 = data.result;
                if(res2 != null){
                    var expires = "";
                    document.cookie = "r_id="+res2['request_id']+expires+"; path=/";
                }
            }
        }
    });
}
function saveToCookie(type,ob){
    document.cookie= type + "=" + $(ob).val();
    if(type == "address"){
        //$(".address-hint").fadeIn(200);
    }
}

$(document).on('focusin', '.count_text', function(){
    console.log("Saving value " + $(this).val());
    $('#old_cnt').data('val', $(this).val());
}).on('change','.count_text', function(){
        var prev = $('#old_cnt').data('val');
        var current = $(this).val();
        var product_id = $(this).attr('data-product-id');
        console.log("Prev value " + prev);
        console.log("New value " + current);
        if(prev > current){
            if ( document.readyState === "complete" ) {
            }
        }else{
            if ( document.readyState === "complete" ) {
            }
        }
        $('#old_cnt').data('val', '');
    });