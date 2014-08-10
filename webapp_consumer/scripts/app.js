/**
 * App
 */

var App = (function (App, $) {

    /**
     * App.init()
     */
	App.payout = 200
	App.maxAmount = 987.47
	App.contactObj = [{
		"user":"Eric Cartman",
		"text": "true",
		"phone": "true",
		"email":"true"
	},
	{
		"user":"Peter Griffin",
		"text": "true",
		"phone": "false",
		"email":"false"
	},
	{
		"user":"Marge Simpson",
		"text": "false",
		"phone": "false",
		"email":"true"
	}]
    App.init = function () {
		App.setMenu()
		App.displayPayout()
		App.setButtons()
		App.displayModes($("contact_name")[0].html())
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
			$(".hk_payoutValue").html("$" + (App.payout+"").split(".")[0])
			$(".hk_payoutDecimal").html("."+(App.payout+"").split(".")[1])
		}
	}
	App.setWallet = function(){
		$(".all_body").hide()
		$(".wallet_body").fadeIn()
		$(".menu_option.hidden_option").removeClass("hidden_option")
		$(".wallet_option").addClass("hidden_option")
		App.setButtons()
		App.displayPayout()
		$(".hk_slider").slider({
			max:App.maxAmount,
			min:0,
			value:App.payout,
			change: function(event,ui){
				App.payout = ui.value
				App.displayPayout()
			}
		})
		$( ".hk_slider" ).slider( "value", App.payout );
		$(".hk_slider_high").html(App.maxAmount)
	}
	App.setSummary = function(){
		$(".all_body").hide()
		$(".summary_body").fadeIn()
		App.displayPayout()
		App.displayModes($("contact_name")[0].html())
		$(".menu_option.hidden_option").removeClass("hidden_option")
		$(".summary_option").addClass("hidden_option")
	}
	App.setButtons = function(){
		$(".take_to_payload, .wallet_option").off("click.take_to_payload").on("click.take_to_payload", function(e){
			e.preventDefault()
			App.setWallet()
		})
		$(".summary_option").off("click.take_to_payload").on("click.take_to_payload", function(e){
			e.preventDefault()
			App.setSummary()
		})
		var lastScrollTop=0
		$(window).scroll(function(){
			var $now=$(this)
            var st = $now.scrollTop();
               if (st > lastScrollTop){
                   $(".hk_header").addClass("scrolled")
				   $(".user_menu").addClass("scrolled")
               }
               if(st<=20){
                   $(".hk_header").removeClass("scrolled")
				   $(".user_menu").removeClass("scrolled")
               }
            lastScrollTop = st;	
		})
	}
	App.displayModes = function(name){
		var relJSON = App.contactObj.filter(function(a){return a.user==name})[0]
		if(relJSON.phone == "true") $(".phoneMode").addClass("enabled")
		else $(".phoneMode").removeClass("enabled")
		if(relJSON.text == "true") $(".textMode").addClass("enabled")
		else $(".textMode").removeClass("enabled")
		if(relJSON.email == "true") $(".emailMode").addClass("enabled")
		else $(".emailMode").removeClass("enabled")
	}
    return App;
}(App || {}, jQuery));