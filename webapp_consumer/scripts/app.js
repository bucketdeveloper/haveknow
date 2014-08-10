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
    App.haveKnowObject = [{
        "q":"What street were you living on in Dec 2010?",
        "a":"Grimauld Place"
    },
    {
        "q":"Which of the following pitcures shows your brother when he was a kid?",
        "a":"images/brother.png"
    },
    {
        "q":"What is your favorite uncle's name?",
        "a":"Uncle Mats"
    },
    {
        "q":"Who is your favorite fictional Character",
        "a":"Tyrion Lannister"
    }]
    App.init = function () {
		App.setMenu()
		App.displayPayout()
		App.setButtons()
		App.displayModes($(".contact_name").eq(0).html())
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
		setTimeout(function(){App.displayModes($("contact_name").eq(0).html())},300)
		$(".hidden_option").removeClass("hidden_option")
		$(".summary_option").addClass("hidden_option")
        $(".contact").off("click.getModes").on("click.getModes", function(e){
            e.preventDefault()
            $(this).addClass("selected")
            $(this).siblings().removeClass("selected")
            App.displayModes($(this).find(".contact_name").html())
        })
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
        $(".contact").off("click.getModes").on("click.getModes", function(e){
            e.preventDefault()
            $(this).addClass("selected")
            $(this).siblings().removeClass("selected")
            App.displayModes($(this).find(".contact_name").html())
        })
        $(".haveknows_option").off("click.getHaveKnow").on("click.getHaveKnow", function(e){
            e.preventDefault()
            App.setHaveKnow()
        })
	}
	App.displayModes = function(name){
		var relJSON = App.contactObj.filter(function(a){return a.user==name})[0]
        console.log(relJSON)
		if(relJSON.phone == "true") $(".phoneMode").addClass("enabled").removeClass("disabled")
		else $(".phoneMode").removeClass("enabled").addClass("disabled")
		if(relJSON.text == "true") $(".textMode").addClass("enabled").removeClass("disabled")
		else $(".textMode").removeClass("enabled").addClass("disabled")
		if(relJSON.email == "true") $(".emailMode").addClass("enabled").removeClass("disabled")
		else $(".emailMode").removeClass("enabled").addClass("disabled")
	}
    App.setHaveKnow = function(){
        $(".all_body").hide()
        $(".haveKnow_body").fadeIn()
        $(".menu_option.hidden_option").removeClass("hidden_option")
		$(".haveknows_option").addClass("hidden_option")
        var html = ""
        $(".knowCont").html("")
        $.each(App.haveKnowObject, function(i){
            html = '<div class="know"><span class="knowIcon fa fa-question"></span><span class="knowText">'+App.haveKnowObject[i].q+'</span><span class="knowPoints points">+5</span></div>'
            $(".knowCont").append(html)
            if($(".knowText").eq(i).height()<$(".know").height()) $(".knowText").eq(i).css("top", ($(".know").height()-$(".knowText").eq(i).height())/2)
        })
        $(window).resize(function(){
            $.each(App.haveKnowObject, function(i){
                $(".knowText").eq(i).css("top", 0)
                if($(".knowText").eq(i).height()<$(".know").height()) $(".knowText").eq(i).css("top", ($(".know").height()-$(".knowText").eq(i).height())/2)
            })
        })
        $(".pointDial").knob({
            min:0,
            max:60,
            readOnly:true,
            angleArc:180,
            angleOffset: -90,
            width:"90%",
            fgColor:"#ffc140",
            font:"chunk"
        })
        setTimeout(function(){App.updateDial()},300)
    }
    App.updateDial = function(){
        var score = 0
        var color = "#e54d42"
        $.each($(".points"), function(i){
            score += parseInt($(".points").eq(i).html().split("+")[1])    
        })
        if(score>=30) color = "#ffc140"
        if(score>=50) color = "#1abc9c"
        $(".pointDial").val(score).trigger("change")
        $(".pointDial").trigger("configure", {"fgColor":color, "inputColor":color})
    }
    return App;
}(App || {}, jQuery));