/**
 * App
 */

var App = (function (App, $) {

	App.global = function(){
		return {
			done: [],
			keys: [],
			appjson : null,
			current: 0,
			user: null
		}
	
	}
	
	App.init = function(){
		App.global = App.global()
		$.when($.get("userData.json")).then(function(json){
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
			var html = '<span  ><img src="' + App.global.user.have + '" /><input type="button" value="NO, DOES NOT HAVE" id="denybtn" class="button answer_go" onclick="App.deny()" /><input type="button" value="YES,&nbsp;DOES&nbsp;HAVE" id="approvebtn" class="button_color button answer_go" onclick="App.doNext()" /></span></span>'
			var html_after = '<span >Does the person have this?<br />'
			$(".result").html(html_after)
			$(".result-after").html(html)
		},
		function(){
			var html = "Please pass to the person ..."
			var html_after = '<input type="button" value="I&nbsp;AM&nbsp;THE&nbsp;PERSON" class="button_color button answer_go pull_right" id="am_person" onclick="App.doNext()" />'
			$(".result").html(html)
			$(".result-after").html(html_after)
		},
		function(){
			var html = App.global.user.know.question + "?"
			var html_after = '<span class="know_input"><input type="password" id="know_answer" /></span>' + 
			'<br /><span class="maskcontain"><input type="checkbox" id="togglemask" class="thecheck" onchange="App.togglemask()"/><span id="togglemasklabel">Unmask</span><input type="button" value="GO" id="unmaskbtn" class="button_color button answer_go" onclick="App.doNext()" /></span>'
			$(".result").html(html)
			$(".result-after").html(html_after)
		},
		function(){
			var val = $("#know_answer").val()
			if (val == App.global.user.know.answer){
				App.approve()
			} else {
				App.deny()
			}
		}
	]
	
	App.approve = function(){
		var html = ""
		var html_after = ""
		html += "You've got cash!<br />"
		html_after += "<span class='huge center' id='cash'>$" + App.global.user.amount + "</span>" + '<input type="button" value="RETURN" id="returnbtn" class="pull_right button_color button answer_go" onclick="App.reset()" />'
		$(".result").html(html)
		$(".result-after").html(html_after)
		$("#starter").text("RESCUED")
		
	}
	
	App.back = function(){
		App.global.current = App.global.current > 0 ? App.global.current -= 2 : 0
		if (App.global.current == 0){
			App.reset()
		} else {
			App.doNext()
		}
	}
	
	App.deny = function(){
			var html = "<span class='push_right' id='access_denied'>ACCESS DENIED</span>"
			var html_after = '<input type="button" value="RETURN" id="returnbtn" class="pull_right button_color button answer_go" onclick="App.reset()" />'
			$("#starter").text("GOODBYE")
			$(".result").html(html)
			$(".result-after").html(html_after)
			$("#username").val("")
			App.global.current = 0
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
	}
	
	App.togglemask = function(){
		var type = $("#know_answer").attr("type")
		var newtype = type == "password" ? "text" : "password"
		var mask = type == "password" ? "Mask" : "Unmask"
		$("#togglemasklabel").text(mask)
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