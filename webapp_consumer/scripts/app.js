/**
 * App
 */

var App = (function (App, $) {

    /**
     * App.init()
     */
    App.init = function () {
		App.setMenu()
    }
	App.setMenu = function(){
		$(".user_icon, .user_menu").mouseenter(function(e){
			e.preventDefault()
			$(".user_menu").show()
		}).mouseleave(function(e){
			e.preventDefault()
			$(".user_menu").hide()
		})
	}
    return App;
}(App || {}, jQuery));