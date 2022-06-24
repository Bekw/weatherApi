$(document).ready(function(){
        jQuery(".master-file-fancybox").fancybox();
	});

    function addToBasket(product_id,product_name,imageToFlyId, l, t, timeout,ob){
        $.ajax({
            type: 'POST',
            url: "/admin/index-json/mode/add-to-basket/product_id/" + product_id + "/",
            success: function(data){
                if(data.result == false){
                    showError(data.exception);
                }
                if(data.result == "IS_EXIST"){
                    showInfo("Продукт уже есть в корзине");
                }
                else{
                    mixpanel.track("Add To Basket 2");
                    mixpanel.track("Product ID " + product_id);
                    fbq('track', 'Add To Basket 2');
                    $("#basket_item_count").html(data.result);
                    $("#mobile_basket_item_count").html(data.result);
                    $(".success-added-text").html("Товар " + product_name + " добавлен в Вашу корзину!");
                    $(".added-to-cart-block").fadeIn(1000).delay(2000).fadeOut(1500);
                    $(".scroll-basket-items").empty();
                    $(".scroll-basket-items").load("/index/basket-items");
                }
            }
        });
        if ( document.readyState === "complete" ) {
        }
        analytic.productAddCart(product_id);
        return false;
    }
    function sendProductComment(){
        if (!$("#comment_form").valid()){
            return false;
        }

        $.ajax({
            type: 'POST',
            url: "/admin/index-json/mode/send-product-comment/",
            data: $("#comment_form").serialize(),
            success: function(data){
                if(data.result == "false_text"){
                    alert('Не указан текст комментарии');
                    return false;
                }
                else if(data.result == "false_product"){
                    alert('Не указан продукт');
                    return false;
                }
                else if(data.result == false){
                    $("#send_error").html("");
                    showError(data.exception);
                }
                else if(data.result == "NOT_AUTH"){
                    $("#send_error").html('Необходима авторизация');
                    return false;
                }
                else{
                    $("#send_error").html("");
                    alert("Благодарим Вас за оставленный отзыв. После модерации отзыв будет опубликован на данной странице.");
                    document.getElementById("comment_form").reset();
                }
            }
        });
    }
    function showAuthForm(ob){
        if($(ob).prop("checked") == true){
            $("#auth_by_login_form").fadeIn(200);
            $("#send_comment_btn").attr("onclick","authCheck()");
        }
        else{
            $("#auth_by_login_form").fadeOut(200);
            $("#send_comment_btn").attr("onclick","sendProductComment()");
        }
    }
    function setProductCookie(product_id){
        var expires = "";
        document.cookie = "session_product="+product_id +expires+"; path=/";
    }
    function authCheck(){
        if (!$("#comment_form").valid()){
            return false;
        }
        $.ajax({
            type: 'POST',
            url: "/admin/index-json/mode/auth-check/",
            data: $("#comment_form").serialize(),
            success: function(data){
                if(data.result == false){
                    alert("Неправильный логин или пароль");
                    return false;
                }
                else if(data.result == "NOT_AUTH"){
                    alert("Необходимо авторизация");
                    return false;
                }
                else{
                    user_name = data.result;
                    sendProductComment2(user_name);
                }
            }
        });
    }
    function sendProductComment2(user_name){
        if (!$("#comment_form").valid()){
            return false;
        }

        $.ajax({
            type: 'POST',
            url: "/admin/index-json/mode/send-product-comment-by-login/",
            data: $("#comment_form").serialize(),
            success: function(data){
                if(data.result == "false_text"){
                    alert('Не указан текст комментарии');
                    return false;
                }
                else if(data.result == "false_product"){
                    alert('Не указан продукт');
                    return false;
                }
                else if(data.result == false){
                    $("#send_error").html("");
                    alert(data.exception);
                }
                else{
                    $("#send_error").html("");
                    $("#auth_by_login_form").css("display","none");
                    alert("Благодарим Вас за оставленный отзыв. После модерации отзыв будет опубликован на данной странице.");
//                                window.location.href = "/index/product-info?product_id=" + $("#product_id").val();
                    document.getElementById("comment_form").reset();
                    $(".logout-btn-comment").css("display","block");
                    $(".user-login-p").html(user_name);
                    $(".auth-type-block").css("display","none");
                    $("#send_comment_btn").attr("onclick","sendProductComment2()");
                }
            }
        });
    }
    function logOut(){
        $.ajax({
            type: 'POST',
            url: "/admin/index-json/mode/logout/",
            success: function(data){
                window.location.href = "/index/product-info?product_id=" + $("#product_id").val();
            }
        });
    }
    function authorizeNeeded(){
        alert("Необходимо авторизоваться");
        return false;
    }
    $("#search_word").autocomplete({
        source: function( request, response ) {
            city_id = $("#hidden_city_id").val();
            $.ajax({
                url: "/admin/index-json/mode/get-products-by-search/city_id/" + city_id + "/",
                data: {
                    product_name: request.term
                },
                success: function( data ) {
                    response( $.map( data.product_list, function( item ) {
                        return {
                            label: item.name,
                            value: item.name,
                            key: item.product_id,
                            price: item.price,
                            price_by_city : item.price_by_city
                        }
                    }));
                }
            });
        },
        minLength: 2,
        select: function( event, ui ) {
            $(this).val(ui.item.value);
            searchByWord();
            return false;
        }
    });