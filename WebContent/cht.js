var smilyMap = {':)':'happy', ':((':'<span class="cry">&nbsp;</span>', ':(':'sad', ';)':'<span class="wink">&nbsp;</span>',':D':'grin',':o':'gasp',':*':'kiss','<3':'love'};
var t = setInterval(function(){get_chat_msg()}, 2500);
var tAlert = setInterval(function(){showNewMessageAlert()}, 250);		
var isToToggleAlert = false;
var commonTitle = "Anything";
var forFirstTime = true;
var isHasFocus = true;

$(document).ready(function() {
	$(window).focus(function(){
		isHasFocus = true;
		isToToggleAlert = false;
	});
	$(window).blur(function(){
		isHasFocus = false;				
	});
	

	$('#txtmsg').keyup(function(event) {
		if (event.keyCode == 13) {
			set_chat_msg();
			return false;
		 }
	});
	
	if(checkCookie('chtUnm')){
		jQuery("#txtname").val(getCookie('chtUnm'));
		makeReadOnly();
	}
	
	if(checkCookie("showTimeStamp") && getCookie("showTimeStamp") == "true"){		
		jQuery("#showTimeStamp").attr("checked", getCookie("showTimeStamp"));
	}
	
	if(checkCookie("showNotification") && getCookie("showNotification") == "true"){		
		jQuery("#showNotification").attr("checked", getCookie("showNotification"));
	}
});//end of document ready

function showNewMessageAlert(){
	if(jQuery("#showNotification").is(":checked") == false){
		document.title = commonTitle;
		return;
	}
	
	if(isToToggleAlert == false){
		document.title = commonTitle;
		return;
	}
	//$("#log").append("<br /> isToToggleAlert : " + isToToggleAlert);
	if(isHasFocus == true){
		isToToggleAlert = false;
		document.title = commonTitle;
		return;
	}
	//$("#log").append("<br /> isHasFocus : " + isHasFocus);
	var currentTitle = document.title;
	if(currentTitle == commonTitle){
		document.title = "New Message!";
	}else{
		document.title = commonTitle;
	}
}

function injectSmily(a_sourceText){
	var returnText = a_sourceText;
	$.each(smilyMap, function(a_key, a_val){
		//$("#log").append("<br /> index : " + returnText.indexOf(a_key));
		
		//$("#log").append("<br /> "+a_key+" : " + a_val);
		//var regex = new RegExp('{'+a_key+'}', "igm");
		returnText = returnText.replace(a_key, a_val);
	});
	return returnText;
}

function showTimeStamp(a_isToShow){
	setCookie('showTimeStamp', a_isToShow, 20*365);
	jQuery("#DIV_CHAT").empty();
	forFirstTime = true;
	get_chat_msg();
}

function showNotification(a_isToShow){
	setCookie('showNotification', a_isToShow, 20*365);
}
	 
function get_chat_msg(){
	if(checkCookie('chtUnm') == false){
		jQuery("#DIV_CHAT").html("<center><h4 style='color: red'>Please introduce your self to join, send introductory message</h4></center>");		
		return;
	}
	var cLength = 0;			
	var maxID = 0;
	
	if(jQuery("#DIV_CHAT table tr:last input").size() > 0){
		maxID = jQuery("#DIV_CHAT table tr:last input").val();
	}
	//$("#log").append("<br /> " + jQuery("#DIV_CHAT table tr:last input").val());
	//$("#log").append("<br /> ================= <br />");
	//$("#log").append("<br /> maxID: " + maxID);
	
	jQuery.ajax({
		
		method: "GET",
		url: "/cht/chat_recv_ajax.jsp?maxID=" + maxID + "&showTime=" + jQuery("#showTimeStamp").is(":checked") + "&d="+new Date().getTime(),		
		success: function(response){
			cLength = $.trim(response).length;
			
			//jQuery("#DIV_CHAT").html(injectSmily(response));	
			if(forFirstTime){
				jQuery("#DIV_CHAT").html(response);
				
			}else{
				jQuery("#DIV_CHAT table").append(response);
			}

				
			
			if(cLength > 0){
				jQuery("#DIV_CHAT").scrollTop(jQuery("#DIV_CHAT").prop('scrollHeight'));
				
				jQuery("#DIV_CHAT table tr:odd").css("background-color", "lightgray");	
				jQuery("#DIV_CHAT table tr:even").css("background-color", "white");				
			}	
			
			//$("#log").append("<br /> cLength: " + cLength);
			//$("#log").append("<br /> lastMessageTxtLength: " + lastMessageTxtLength);
			//$("#log").append("<br /> isHasFocus: " + isHasFocus);
			if(forFirstTime == false && cLength > 0 && isHasFocus == false){							
				//$("#log").append("<br /> showNewMessageAlert called " );
				isToToggleAlert = true;
				showNewMessageAlert();						
			}
			forFirstTime = false;					
		}//end of success
	});
}     

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
	}
	return "";
}

function checkCookie(cname) {
	var user = getCookie(cname);
	if (user != "") {
		return true;
	} else {
		return false;
	}
}

function makeReadOnly(){
	jQuery("#txtname").attr('readonly', 'readonly');
	jQuery('#txtname').css('background-color' , '#DEDEDE');
}

	  
function set_chat_msg(){			
	if(!jQuery("#txtname").val()){
		alert("Please put some name");
		jQuery("#txtname").focus();
		return;
	}
	if(!jQuery("#txtmsg").val()){
		alert("Please type your message");
		jQuery("#txtmsg").focus();
		return;
	}
	
	if(checkCookie("chtUnm") == false){
		makeReadOnly();	
		setCookie('chtUnm', jQuery("#txtname").val(), 20*365);
	}
		
	var strname=jQuery("#txtname").val();
	var strmsg= encodeURIComponent(jQuery("#txtmsg").val());
	
	var url = "chat_send_ajax.jsp?d="+new Date().getTime()+"&name=" + strname + "&msg="+ strmsg;
	
	jQuery.ajax({
		method: "GET",
		url: url,		
		success: function(response){
			jQuery("#txtmsg").val("");			
			//do nothing, just ignore..			
		}
	});
}