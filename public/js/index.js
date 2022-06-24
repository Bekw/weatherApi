$(document).ready(function(){
    $("#search_word").keypress(function(e){
        if(e.keyCode==13){
            searchByWord();
        }
    });

});

function addToBasket(product_id,product_name,imageToFlyId, l, t, timeout,ob){
    console.log('product_id: ' + product_id);
    console.log('product_name: ' + product_name);
    console.log('imageToFlyId: ' + imageToFlyId);
    console.log('l: ' + l);
    console.log('t: ' + t);
    console.log('timeout: ' + timeout);
    console.log('ob: ' + ob);
    $.ajax({
        type: 'POST',
        url: "/admin/index-json/mode/add-to-basket/product_id/" + product_id + "/",
        success: function(data){
            if(data.result == false){
                showError(data.exception);
                console.log(data.exception);
            }
            if(data.result == "IS_EXIST"){
                showInfo("Продукт уже есть в корзине");
            }
            else{
                mixpanel.track("Add To Basket");
                mixpanel.track("Product ID " + product_id);
                //fbq('track', 'Add To Basket');
                $("#basket_item_count").html(data.result);
                $("#mobile_basket_item_count").html(data.result);
                $(".success-added-text").html("Товар " + product_name + " добавлен в Вашу корзину!");
                $(".added-to-cart-block").fadeIn(1000).delay(2000).fadeOut(1500);
                $(".scroll-basket-items").empty();
                $(".scroll-basket-items").load("/index/basket-items/");
            }
        }
    });

    if ( document.readyState === "complete" ) {
    }
    analytic.productAddCart(product_id);
    return false;
}
function searchByWord(){
    search_word = encodeURIComponent($("#search_word").val());
    window.location.href = "/?search_word=" + search_word;
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
$("#mobile_search_text").autocomplete({
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
        searchByWordMobile();
        return false;
    }
});