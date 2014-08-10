/**
 * App
 */
 
 var service = {
	host:"http://www.haveknow.com/hkapp/webresources",
	call: function(method, data, path, success){
		console.log(this.host + "/" + path)
		method = method ? method : "GET"
		data = data ? data : {}
		$.ajax({
			url: this.host + "/" + path,
			  data: data,
			  success: success
		
		})
		
	}
 }

var App = (function (App, $) {

	App.global = function(){
		return {
			done: [],
			keys: [],
			appjson : null,
			transferjson: null,
			current: 0,
			user: null,
			haveidex: 0,
			pin: ""
		}
	
	}
	
	App.init = function(){
		App.global = App.global()
		$.get("userData.json", function(json){
			App.global.appjson = json
		})

	}
	
	App.doNext = function(){

		var idex = App.global.current
		App.global.current++
		return App.methods[idex]()
		
	}
	
	App.methods = [
		function(){
			var name = $("#username").val()
			var user = App.global.appjson.users.filter(function(p){
				return p.username == name.toLowerCase()
			})
			if (user.length > 0){
				App.global.user = user[0]
				$("#backbtn").toggle()
				$("#userinfo").toggle()
				$("#theuser").toggle()
				$("#starter").toggleClass("push_left")
				App.doNext()
			} else {
				App.noUser()
			}
		},
		function(){
			$("#starter").text("RESCUING")
			$("#theuser").text(App.global.user.full_name)
			var html = '<span  ><img src="' + App.global.user.have[App.global.haveidex].img + '" /><span class="desccontain"><span class="desc">' + App.global.user.have[App.global.haveidex].desc + '</span><input type="button" value="NO, DOES NOT HAVE" id="denybtn" class="button answer_go" onclick="App.deny()" /><input type="button" value="YES,&nbsp;DOES&nbsp;HAVE" id="approvebtn" class="button_color button answer_go" onclick="App.doNext()" /></span></span></span>'
			var html_after = '<span >Does the person have this?<br />'
			$(".result").html(html_after)
			$(".result-after").html(html)
			App.global.haveidex++
		},
		function(){
			$("#starter").text("RESCUING")
			$("#theuser").text(App.global.user.full_name)
			var html = '<span  ><img src="' + App.global.user.have[App.global.haveidex].img + '" /><span class="desccontain"><span class="desc">' + App.global.user.have[App.global.haveidex].desc + '</span><input type="button" value="NO, DOES NOT HAVE" id="denybtn" class="button answer_go" onclick="App.deny()" /><input type="button" value="YES,&nbsp;DOES&nbsp;HAVE" id="approvebtn" class="button_color button answer_go" onclick="App.doNext()" /></span></span></span>'
			var html_after = '<span >Does the person have this?<br />'
			$(".result").html(html_after)
			$(".result-after").html(html)
			App.global.haveidex = 0
		},
		function(){
			var html = "Please pass to the person ..."
			var html_after = '<input type="button" value="I&nbsp;AM&nbsp;THE&nbsp;PERSON" class="button_color button answer_go pull_right" id="am_person" onclick="App.doNext()" />'
			$(".result").html(html)
			$(".result-after").html(html_after)
		},
		function(){
			var html = App.global.user.know.question + "?"
			var html_after = '<br /><br /><span class="know_input"><input type="password" id="know_answer" /></span>' + 
			'<br /><span class="maskcontain"><input type="checkbox" id="togglemask" class="thecheck" onchange="App.togglemask()"/><span id="togglemasklabel">Unmask</span><input type="button" value="GO" id="unmaskbtn" class="button_color button answer_go" onclick="App.doNext()" /></span>'
			$(".result").html(html)
			$(".result-after").html(html_after)
		},
		function(){
			var html_starter = "APPROVED"
			var html = '<div class="numrow"><span input type="text" id="num_1" class="nums">1</span>' + 
			'<span input type="text" id="num_2" class="nums">2</span>' + 
			'<span input type="text" id="num_3" class="nums">3</span></div>' + 
			'<div class="numrow"><span input type="text" id="num_4" class="nums">4</span>' + 
			'<span input type="text" id="num_5" class="nums">5</span>' + 
			'<span input type="text" id="num_6" class="nums">6</span></div>' +
			'<div class="numrow"><span input type="text" id="num_7" class="nums">7</span>' +			
			'<span input type="text" id="num_8" class="nums">8</span>' + 
			'<span input type="text" id="num_9" class="nums">9</span></div>' +
			'<div class="numrow"><span input type="text" id="num_0" class="nums zero">0</span></div>' 
			var html_after = "Please enter your Paypal pin<br /><input type='password' id='numinput'/><br /><input type='button' id='clearbtn' class='answer_go button' value='CLEAR'/><input type='button' id='numbtn' class='answer_go button button_color' value='GO' onclick='App.doNext()'/>"
			$("#starter").html(html_starter)
			$(".result").html(html)
			$(".result-after").html(html_after)
			$(".nums").off("click.in").on("click.in", function(e){
				if (App.global.pin.length <=4){
					App.global.pin += $(e.target).text()
					$("#numinput").val(App.global.pin)
				}
			}).off("mouseover.in").on("mouseover.in", function(e){
				$(e.target).toggleClass("highlight")
			}).off("mouseout.in").on("mouseout.in", function(e){
				$(e.target).toggleClass("highlight")
			})
			$("#clearbtn").off("click.clear").on("click.clear", function(e){
				$("#numinput").val("")
				App.global.pin = ""
			})
			
		},
		function(){
			$("#spinner").show()
			service.call("GET", {}, "transfer", function(json){
				$("#spinner").hide()
				App.global.transferjson = json
				var html = "<span class='transferid'>Processing:<br /><br />" + App.global.transferjson.response + "</span>"
				$(".result").html(html)
				$(".result-after").html("")
				
				setTimeout(function(){
					service.call("GET", {}, "notification", function(){
						
						App.approve()
					})
				}, 3000)
			})
			
		/*	var val = $("#know_answer").val()
			if (val.toLowerCase() == App.global.user.know.answer.toLowerCase()){
				App.approve()
			} else {
				App.deny()
			}
			*/
		}
	]
	
	App.approve = function(){
		var html = ""
		var html_after = ""
		var html_success = "<span class='emergency'>Your emergency contact list has been notified</span><br />"
		html += "You've got cash!<br />"
		html_after += "<span class='huge center' id='cash'><span class='dollar'>$</span>" + App.global.user.amount + "</span><br /><div class='emergency'>Please pass back to vendor</div>" + '<input type="button" value="RETURN" id="returnbtn" class="pull_right button_color button answer_go" onclick="App.reset()" /><input type="button" value="Contact AMICA Insurance" id="insbtn" class="pull_left button_color button answer_go"  />'
		$(".result").html(html)
		$(".result-after").html(html_after)
		$("#starter").text("RESCUED")
		$(".result-after").html(html_success + html_after )
		
	}
	
	App.back = function(){
		App.global.current = App.global.current > 0 ? App.global.current -= 2 : 0
		App.global.haveidex = App.global.haveidex > 0 ? App.global.haveidex-- : 0
		if (App.global.current == 0){
			App.reset()
		} else {
			App.doNext()
		}
		
	}
	
	App.deny = function(){
			var html = "<span class='push_right' id='access_denied'>ACCESS DENIED</span>"
			var html_after = '<input type="button" value="RETURN" id="returnbtn" class="pull_right button_color button answer_go" onclick="App.reset()" />'
			var html_before = "<span class='notify'>This incident has been reported</span>"
			$("#starter").text("GOODBYE")
			$(".result").html(html)
			$(".result-after").html(html_after)
			$("#username").val("")
			App.global.current = 0
			service.call("GET", {}, "failednotification", function(){
				$(".result-after").html(html_before + html_after)
			})
	}
	
	App.noUser = function(){
		var none = $("#username").val() ? $("#username").val() : "Blank"
		var html = "NO USER FOUND FOR " + none.toUpperCase()
		var html_after = ''
		$(".result").html(html)
		$(".result-after").html(html_after)
		App.global.current = 0
	}
	
	App.reset = function(){
		var html = '<span class="huge">?</span>'
		var html_after = ""
		App.global.current = 0
		$(".result").html(html)
		$(".result-after").html(html_after)
		$("#theuser").text(App.global.user.full_name)
		$("#starter").text("RESCUE")
		$("#starter").toggleClass("push_left")
		$("#username").val("")
		$("#backbtn").toggle()
		$("#userinfo").toggle()
		$("#theuser").toggle()
		App.global.haveidex = 0
	}
	
	App.togglemask = function(){
		var type = $("#know_answer").attr("type")
		var newtype = type == "password" ? "text" : "password"
		$("#know_answer").attr("type", newtype)
	}
	
	App.urlparamize = function(obj){
			// takes an array of one string
			var params = obj.split("&")

			var map = {}
			for (var i=0; i < params.length; i++){
				var item = params[i]
				var key = item.match(/^.*\=/)[0].replace(/\=/,"")
				var value = item.match(/\=.*$/)[0].replace(/\=/,"")
				map[key] = value
			}
			// returns a map of key value pairs - username=myuser&password=mypassword, access map.username and map.password
			return map
		}

    return App;
}(App || {}, jQuery));