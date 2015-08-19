<!--
var isSiteJSAvailable = true;
var ie = document.all ? 1 : 0
var ns = document.layers ? 1 : 0

var ie4=document.all&&navigator.userAgent.indexOf("Opera")==-1;
var ns6=document.getElementById&&!document.all;
var ns4=document.layers;

if(ns){doc = "document."; sty = ""}
if(ie){doc = "document.all."; sty = ".style"}

var initialize = 0
var tooltipID = "x";
var Ex, Ey, topColor, subColor, ContentInfo,browserWidth,browserHeight;

try{
	onload=new function(){
		top.document.title = document.title;
	}
}catch(e){}

if(ie){
	browserWidth = screen.width-10;
	browserHeight = screen.height-100;

	Ex = "event.x"
	Ey = "event.y"

	topColor = "#808080"
	subColor = "#C0C0C0"
}

if(ns){
	browserWidth = window.innerWidth;
	browserHeight = window.innerHeight;

	Ex = "e.pageX"
	Ey = "e.pageY"
	window.captureEvents(Event.MOUSEMOVE)
	window.onmousemove=overhere

	topColor = "#808080"
	subColor = "#C0C0C0"
}

function loadIFrame(iframeName,url){
	if ( window.frames[iframeName] ) {
	    window.frames[iframeName].location = url;   
	}
}

function MoveToolTip(layerName, FromTop, FromLeft, e){
	if(ie){eval(doc + layerName + sty + ".top = "  + (eval(FromTop) + document.body.scrollTop))}
	if(ns){eval(doc + layerName + sty + ".top = "  +  eval(FromTop))}
	if ((browserWidth-250)<eval(FromLeft)){ 
		eval(doc + layerName + sty + ".left = " + (eval(FromLeft) -30 -eval("window.document.all." + layerName + ".clientWidth")));
	}else{
		eval(doc + layerName + sty + ".left = " + (eval(FromLeft) + 15))
	}
	//alert(doc + layerName + sty + ".left = " + (eval(FromLeft) + 15));
}

function ActivateTT(){initialize=1}
function deActivateTT(){
	eval(doc + tooltipID + sty + ".visibility = 'hidden'")
	tooltipID = "x";
	initialize=0;
}
function overhere(e){
	if(tooltipID!="x"){
		if(ie && initialize){
			MoveToolTip(tooltipID, Ey, Ex, e)
			eval(doc + tooltipID + sty + ".visibility = 'visible'")
			//alert('show');
		}else{
			//alert('hide');
			MoveToolTip(tooltipID, 0, 0)
			eval(doc + tooltipID + sty + ".visibility = 'hidden'")
		}
	}
}

//<?=SITE_URL."templates/flash/tt/"?>ntt_tooltip.swf
function drawTT(swfURL,TTNAME,params,stageWidth,stageHeight,textTitle,textContent,textSize,curveSize,textColor,backColor,borderColor,borderSize,backAlpha,curveSize){
	var html = "";
	html += "<div id='div"+TTNAME+"' style='visibility:hidden;position:absolute'>";
	html += "<OBJECT name=tooltip"+TTNAME+" classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' WIDTH='"+stageWidth+"' HEIGHT='"+stageHeight+"' ALIGN=''>";
	html += "<PARAM NAME=movie VALUE='"+swfURL+params+"'>";
	html += "<PARAM NAME=quality VALUE=high>";
	html += "<PARAM NAME=scale VALUE=noscale>";
	html += "<PARAM NAME=salign VALUE=LT>";
	html += "<PARAM NAME=wmode VALUE=transparent>";
	html += "<PARAM NAME=bgcolor VALUE=#"+backColor+">";
	html += "<EMBED src='"+swfURL+params+"' loop=false menu=false quality=high scale=noborder wmode=transparent bgcolor=#"+backColor+" name=tooltip"+TTNAME+"  WIDTH='"+stageWidth+"' HEIGHT='"+stageHeight+"' TYPE='application/x-shockwave-flash' PLUGINSPAGE='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash'></EMBED>";
	html += "</OBJECT>";
	html += "</div>";
	window.document.write(html);
}

////////////////////////////////////////////////////////////////////
//    HOT BUTTONS
////////////////////////////////////////////////////////////////////
function LmOver(elem, clr, color){
if ((clr!="")&&(clr!="#")) elem.style.backgroundColor = clr;
else elem.style.backgroundColor = "transparent";
if ((color!="")&&(color!="#")) elem.children.tags('A')[0].style.color = color;
elem.style.cursor = 'hand';
}

function LmOut(elem, clr, color){
if ((clr!="")&&(clr!="#")) elem.style.backgroundColor = clr;
else elem.style.backgroundColor = "transparent";
if ((color!="")&&(color!="#")) elem.children.tags('A')[0].style.color = color;
}

function LmDown(elem, clr, color){
if ((clr!="")&&(clr!="#")) elem.style.backgroundColor = clr;
else elem.style.backgroundColor =  "transparent";
if ((color!="")&&(color!="#")) elem.children.tags('A')[0].style.color = color;
}

function LmUp(path)
{location.href = path;}

function mypreload(src){
	var tmp = new Image();
	tmp.src = src;
}

////////////////////////////////////////////////////////////////////
//    TT MENU
////////////////////////////////////////////////////////////////////
var showMenuID="hide";

function printMenu(swfURL,menuID,btnID,menu_align,popWidth,popHeight,param,factor){
	var menuHTML ="";
	if (ie||ns6)
	{
		menuHTML += "<div id='"+menuID+"' name='"+menuID+"' WIDTH='"+popWidth+"' HEIGHT='"+popHeight+"' onmouseover=\"showMenu('"+menuID+"','"+btnID+"','"+menu_align+"',"+popWidth+","+popHeight+","+factor+");\" onmouseout=\"hideMenu('"+menuID+"');\" style=\"position:absolute;z-index:100;visibility:hidden;top=-1000\">";
		menuHTML += "	<table cellpadding=4 cellspacing=0 border=0><tr><Td>";
		menuHTML += "	<OBJECT classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0\"	WIDTH=\""+popWidth+"\" HEIGHT=\""+popHeight+"\" id=\"image\" ALIGN=\"\">";
		menuHTML += "	<PARAM NAME=movie VALUE=\""+swfURL+param+"\">";
		menuHTML += "	<PARAM NAME=quality VALUE=high> <PARAM NAME=scale VALUE=noscale> <PARAM NAME=salign VALUE=LT> <PARAM NAME=wmode VALUE=transparent> <PARAM NAME=bgcolor VALUE=#FFFFFF> <EMBED src=\""+swfURL+param+"\" quality=high scale=noscale salign=LT wmode=transparent bgcolor=#FFFFFF  WIDTH='"+popWidth+"' HEIGHT='"+popHeight+"' NAME=\"image2\" ALIGN=\"\" TYPE=\"application/x-shockwave-flash\" PLUGINSPAGE=\"http://www.macromedia.com/go/getflashplayer\"></EMBED>";
		menuHTML += "	</OBJECT>";
		menuHTML += "	</td></tr></table>";
		menuHTML += "</div>";
	}
	document.writeln(menuHTML);
}

function showMenu(menuID,btnID,menu_align,popWidth,popHeight,factor)
{
	showMenuID=menuID;
	factor = 5;
	var btnMenu;
	var menuPop;

	if (ie||ns6) {
		if(eval(btnID))btnMenu = document.getElementById(btnID);
		if(eval(menuID))menuPop = document.getElementById(menuID);
		if (eval('menuPop.style')&&eval(btnMenu)){
			menuPop.style.visibility = 'visible';
			switch(menu_align){
				case "right_top":
					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft')+btnMenu.offsetWidth-factor;
					menuPop.style.top = calcMenu(btnMenu,'offsetTop')-Math.abs(popHeight-btnMenu.offsetHeight);
					break;
				case "right_bottom":
					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft')+btnMenu.offsetWidth-factor;
					menuPop.style.top = calcMenu(btnMenu,'offsetTop');
					break;
				case "left_top":
					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft')-popWidth;
					menuPop.style.top = calcMenu(btnMenu,'offsetTop')-Math.abs(popHeight-btnMenu.offsetHeight);
					break;
				case "left_bottom":
					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft')-popWidth;
					menuPop.style.top = calcMenu(btnMenu,'offsetTop');
					break;
				case "top_right":
					//alert(calcMenu(btnMenu, 'offsetLeft'));
					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft');
					menuPop.style.top = calcMenu(btnMenu,'offsetTop')-popHeight+factor;
					break;
				case "top_left":
					//alert(calcMenu(btnMenu, 'offsetLeft')-Math.abs(btnMenu.offsetWidth-popWidth));
					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft')-Math.abs(btnMenu.offsetWidth-popWidth);
					menuPop.style.top = calcMenu(btnMenu,'offsetTop')-popHeight+factor;
					break;
				case "bottom_right":
					//alert(calcMenu(btnMenu, 'offsetLeft'));
					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft');
					menuPop.style.top = btnMenu.offsetHeight+calcMenu(btnMenu,'offsetTop')-factor;
//					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft');
//					menuPop.style.top = btnMenu.offsetHeight+calcMenu(btnMenu,'offsetTop')-factor;
					break;
				default:
					//alert(calcMenu(btnMenu, 'offsetLeft'));
					menuPop.style.left = calcMenu(btnMenu, 'offsetLeft')-Math.abs(btnMenu.offsetWidth-popWidth);
					menuPop.style.top = btnMenu.offsetHeight+calcMenu(btnMenu,'offsetTop')-factor;
					break;
			}
		}
	}
}

function hideMenu(menuID){
	showMenuID = menuID+"hide";
	if (eval(menuID)) {
		setTimeout("if(showMenuID!='"+menuID+"'){menuPop = document.getElementById('"+menuID+"');menuPop.style.visibility = 'hidden'};",200);
	}
}

function calcMenu(idItem, offsetName)
{
	var totalOffset = 0;
	var item = eval('idItem');
	do
	{
		totalOffset += eval('item.'+offsetName);
		item = eval('item.offsetParent');
	} while (item != null);
	return totalOffset;
}

function showImagePopup(imgSrc,width,height,title){
	width = width+2;
	height = height+53;
	this.args = new Array();
	var space = "&nbsp;";
	for (i=0;i<8;i++){space = space+space;}
	var picHTML = "<html><head><title>לחץ על החלון לסגירה - Click on window to close "+space+"</title></head><body topmargin=0 leftmargin=0 scroll=no status:yes onclick=self.close();><center><img src="+imgSrc+" border=0></body></html>";
	var newwin = showModelessDialog(imgSrc,args, "dialogWidth:"+width+"px; dialogHeight:"+height+"px; scroll:no; status:yes; help:no; resizable:yes;" );
	//var newwin=window.open('','','width='+width+',height='+height+',top=20,left=20,resizable=yes,scrollbars=yes,menubar=no,toolbar=no,status=no,location=no');
	newwin.document.write(picHTML);
	newwin.focus();
}
//-->
