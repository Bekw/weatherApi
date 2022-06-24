/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-Search2': '&#xe948;',
		'icon-Accessories': '&#xe906;',
		'icon-Arrow': '&#xe911;',
		'icon-Arrow_small': '&#xe912;',
		'icon-Baby-food': '&#xe913;',
		'icon-Basket': '&#xe914;',
		'icon-Basket_2': '&#xe915;',
		'icon-Check-box': '&#xe916;',
		'icon-Chek-box_active': '&#xe917;',
		'icon-Close': '&#xe91a;',
		'icon-Close_red': '&#xe91b;',
		'icon-Close_white': '&#xe91c;',
		'icon-Diapers-mature': '&#xe91d;',
		'icon-Diapers': '&#xe91e;',
		'icon-Facebook': '&#xe91f;',
		'icon-Feeding': '&#xe920;',
		'icon-Filters': '&#xe921;',
		'icon-Furniture': '&#xe923;',
		'icon-Games': '&#xe924;',
		'icon-Goods-for-moms': '&#xe925;',
		'icon-Household-chemicals': '&#xe926;',
		'icon-Instagram': '&#xe927;',
		'icon-Leaven-vivo': '&#xe928;',
		'icon-Location': '&#xe929;',
		'icon-Logo-babek': '&#xe92a;',
		'icon-Made-in-kazahstan': '&#xe92b;',
		'icon-Mark': '&#xe92c;',
		'icon-masrecard_white': '&#xe92d;',
		'icon-Menu': '&#xe92e;',
		'icon-menu_black': '&#xe92f;',
		'icon-Message': '&#xe930;',
		'icon-Oral-cavity': '&#xe931;',
		'icon-Phone': '&#xe932;',
		'icon-Phone_green': '&#xe933;',
		'icon-Phone_grey': '&#xe934;',
		'icon-Qiwi': '&#xe935;',
		'icon-Radio_active': '&#xe936;',
		'icon-Radio_normal': '&#xe937;',
		'icon-Search': '&#xe938;',
		'icon-Settings': '&#xe939;',
		'icon-Strollers-and-car-seats': '&#xe93a;',
		'icon-Swim': '&#xe944;',
		'icon-Things': '&#xe945;',
		'icon-Visa': '&#xe946;',
		'icon-Wear': '&#xe947;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
