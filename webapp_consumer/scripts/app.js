/**
 * App
 */

var App = (function (App, $) {

    /**
     * App.init()
     */
	App.payout = 200
    App.init = function () {
		App.setMenu()
		App.displayPayout()
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
	App.displayPayout = function(){
		if((App.payout+"").indexOf(".")<0){
			$(".hk_payoutValue").html("$" + App.payout)
			$(".hk_payoutDecimal").html(".00")
		}else{
			$(".hk_payoutValue").html("$" + App.payout.split(".")[0])
			$(".hk_payoutDecimal").html(App.payout.split(".")[1] + ".00")
		}
	}		
    return App;
}(App || {}, jQuery));