var DHTMLMENU_SCRIPT_LOADED = true;

var ua		= navigator.userAgent;
var opera	= /opera [56789]|opera\/[56789]/i.test(ua);
var ie		= !opera && /msie [56789]/i.test(ua);
var ieBox = ie && (document.compatMode == null || document.compatMode != "CSS1Compat");
var moz		= !opera && /mozilla\/[56789]/i.test(ua);
var kon   = /Konqueror/i.test(ua);
var lin   = /Linux/i.test(ua);

// JS Constants
//var TMENU_IMAGES_PATH  = "images/"; // left in for v1.0 data files
//var TMENU_IMAGES_PATH  = myInfoImagesPath; // left in for v1.0 data files
var MENU_HOVER_MODE    = opera || kon ? true:false;
var ITEM_BORDER_SIZE   = 1;
var ITEM_MARGIN_SIZE   = 1;
var DEFAULT_ICON_SIZE  = opera ? 18:20;
var DEFAULT_MENU_WIDTH = 128;
var MENU_HIDE_TIMEOUT  = opera ? 1:10;
	MENU_HIDE_TIMEOUT = 3;

var _arrowD = null;
var _arrowR = null; // loaded later

// -

amt = (opera) ? 4:(moz && lin) ? -8:(moz) ? -11:(ie) ? -11:(kon) ? 14:0;
amr = (opera) ? 3:(moz) ? 3:(ie) ? 4:(kon) ? 2:0;
//amCSS = amt+"px "+amr+"px 0px 0px";

imt = (ie || moz) ? 1:0;
imr = (ie) ? 3:0;
iml = (ie || moz) ? 2:0;
imCSS = imt+"px "+imr+"px 0px "+iml+"px";

var MenuHandler = {
	all : [],
	// since 1.1:
	pid : "mMenu-",
	mbcntr : 0,
	item_prefix : "item-",
	frame_prefix : "box-",
	// ---
	_over : function(o) {
		Tthread.stop();
	},
	_out : function(o) {
		Tthread.stop();
		Tthread.start();
	},
	_blur : function(o) {
		window.menutimeout = setTimeout("MenuHandler.hideAllSubs();",0);
	},
	show_frame : function(id) {
		document.getElementById(id).style.visibility = "visible";
	},
	// displayes a sub menu - that is a menu inside a menu
	show_sub : function(menuName,id,y) {
		var offsetLeft;
		var menuButtonsAlign = eval("mn"+menuName+"mn"+".menuButtonsAlign");
		var menudir = eval("mn"+menuName+"mn"+".menudir");
		var btnHeight = (eval("mn"+menuName+"mn"+".btn.height")-0)+(eval("mn"+menuName+"mn"+".btn.borderSize")-0)+(eval("mn"+menuName+"mn"+".borderSize")-0);

		if (menuButtonsAlign == "horisontal"){
			if (menudir == "rtl"){
				offsetLeft = y.offsetParent.offsetLeft-y.offsetWidth - (ITEM_MARGIN_SIZE*2 + ITEM_BORDER_SIZE);
			}else{
				offsetLeft = y.offsetParent.offsetLeft+y.offsetWidth + (ITEM_MARGIN_SIZE*2 + ITEM_BORDER_SIZE);
			}
			this.show_submenu(menuName,id,offsetLeft,y.offsetParent.offsetTop+y.offsetTop);
		}else{ // VERTICAL BUTTON ALIGNMENT
			if (menudir == "rtl"){
				offsetLeft = y.offsetParent.offsetLeft+(eval("mn"+menuName+"mn"+".btn.width")-0)-(eval("mn"+menuName+"mn"+".menuWidth")-0);
			}else{
				offsetLeft = y.offsetParent.offsetLeft+y.offsetWidth + (ITEM_MARGIN_SIZE*2 + ITEM_BORDER_SIZE)-(eval("mn"+menuName+"mn"+".btn.width")-0);
			}
			this.show_submenu(menuName,id,offsetLeft,y.offsetParent.offsetTop+y.offsetTop+btnHeight);
		}

	},
	// 
	show_submenu : function(menuName,id,x,y)
	{
		var btnWidth = eval("mn"+menuName+"mn"+".btn.width")-0;
		var btnHeight = (eval("mn"+menuName+"mn"+".btn.height")-0)+(eval("mn"+menuName+"mn"+".btn.borderSize")-0)+(eval("mn"+menuName+"mn"+".borderSize")-0);
		var menuWidth = eval("mn"+menuName+"mn"+".menuWidth")-0;
		var menudir = eval("mn"+menuName+"mn"+".menudir");
		var menuButtonsAlign = eval("mn"+menuName+"mn"+".menuButtonsAlign");
		
		_bh = layout.getBrowserHeight()+layout.getScrollY();
		_bw = layout.getBrowserWidth()+layout.getScrollX();
		_wi = document.getElementById(id).offsetWidth;
		_hi = document.getElementById(id).offsetHeight;
		if (menuButtonsAlign == "horisontal"){
			document.getElementById(id).style.left = ( (x + _wi > _bw) ? ((x-(_wi*2)+10 > 0) ? x-(_wi*2)+10:0):x ) + "px";
			document.getElementById(id).style.top = ((_hi > _bh) ? 0:(y + _hi > _bh) ? _bh-_hi:y) + "px";
		}else{
			document.getElementById(id).style.left = ((menudir=="rtl")?(x-btnWidth-0):(x+btnWidth-0)) + "px";
			document.getElementById(id).style.top = ((_hi > _bh) ? 0:(y + _hi > _bh) ? _bh-_hi-btnHeight:y-btnHeight) + "px";
		}
		this.show_frame(id);
	},
	hide_frame : function(id) {
		document.getElementById(id).style.visibility = "hidden";
	},
	changeIcon : function(obj,src) {
		document.getElementById(obj.id+"-image").src = src;
	},
	hideAllSubs : function() {
		for(this.i=0;this.i<this.all.length;this.i++) {
			document.getElementById(this.all[this.i]).style.visibility = "hidden";
		}
	},
	sortIDs : function(obj,prefix) {
		for(this.i=0;this.i<obj.items.length;this.i++)
		{
			obj.items[this.i].id = prefix+"-"+this.i;
		}
		for(this.x=0;this.x<obj.submenus.length;this.x++)
		{
			obj.submenus[this.x].action.id = MenuHandler.frame_prefix+obj.submenus[this.x].id;
			MenuHandler.all[MenuHandler.all.length] = obj.submenus[this.x].action.id;
			new MenuHandler.sortIDs(obj.submenus[this.x].action,obj.submenus[this.x].id);
		}
	}
};
var layout = {
	getTop : function(el) {
		this.value = el.offsetTop;
		if(el.offsetParent)
		{
			this.value += layout.getTop(el.offsetParent);
		}
		return this.value;
	},
	getLeft : function(el) {
		this.value = 0;
		if(el.offsetParent)
		{
			this.value += layout.getLeft(el.offsetParent);
			return this.value + el.offsetParent.offsetLeft;
		}
		return 0;
	},
	getHeight : function(el) {
		return (moz) ? el.offsetHeight:el.offsetHeight;
	},
	getBrowserWidth : function() { return ie ? (ieBox ? document.body.clientWidth:document.documentElement.clientWidth):window.innerWidth; },
	getBrowserHeight : function() { return ie ? (ieBox ? document.body.clientHeight:document.documentElement.clientHeight):window.innerHeight; },
	getScrollY : function() { return ie ? (ieBox ? document.body.scrollTop:document.documentElement.scrollTop):window.pageYOffset; },
	getScrollX : function() { return ie ? (ieBox ? document.body.scrollLeft:document.documentElement.scrollLeft):window.pageXOffset; },
	
	// get the X position of the menu
	getX : function(obj) {
		var xpos = 0;
		if (menuInfo.menudir == "rtl"){
			xpos = obj.offsetLeft + layout.getLeft(obj) - (menuInfo.menuWidth-obj.offsetWidth);// - obj.width;
		}else{
			xpos = obj.offsetLeft + layout.getLeft(obj);
		}
		return xpos;
	},

	// get the Y position of the menu
	getY : function(obj) {
		if(kon) { return layout.getTop(obj) + obj.offsetHeight; }
		return layout.getTop(obj) + layout.getHeight(obj);
	}
};
var Tthread = {
	_tmr : 0,
	_tt : MENU_HIDE_TIMEOUT*10,
	start : function() {
		this._tmr++;
		window.menutimeout = setTimeout("Tthread.start()",4);
		if(this._tmr >= this._tt) {
			MenuHandler.hideAllSubs();
			this.stop();
		}
	},
	stop : function() {
		if(window.menutimeout != null) { window.clearTimeout(window.menutimeout); }
		this.reset();
	},
	reset : function() { this._tmr = 0; }
};

// a menu class
function Menu(M,t)
{
	this.image = false;
	this.label = false;
	if(M)
	{
		if(M.isImage) { this.image = M; }
		else { this.label = M; }
	}
	this.id = "";
	this.items = [];
	this.submenus = [];
	this.tooltip = (t!=null) ? t:false;
	this.isMenu = true;
	this.isSelected = false;
	this.href = null;
}

// handles a menu to string
Menu.prototype.toString = function() {
	this.s = "<div id='"+this.id+"' class='"+menuInfo.menuName+"mMenu' >";

	// prints all the options in a menu
	for(i=0;i<this.items.length;i++)
	{
		if(this.items[i].isSeparator)
		{
			this.s += "<div id='"+this.items[i].id+"' class='"+menuInfo.menuName+"mMenu-separator'></div>";
		}
		else
		{
			loc = (this.items[i].isSub) ? "javascript:void(0);":this.items[i].action;
			// this is one option in the menu
			this.s += "<a menuname='"+menuInfo.menuName+"' id='"+this.items[i].id+"' "+
						"href='"+loc+"' "+
						"unselectable='on' tabindex='-1' "+
						((this.items[i].tooltip) ? "title='"+this.items[i].tooltip+"' ":"")+
						"onMouseOver='window.status=2;"+this.getSubMenuCode()+
						(this.items[i].isSub ? "MenuHandler.show_sub(this.menuname,\""+this.items[i].action.id+"\",this);":"")+
						((this.items[i].iconImage) ? "MenuHandler.changeIcon(this,\""+this.items[i].iconImage.over_object.src+"\");":"")+
						"MenuHandler._over(this);' "+
						"onMouseOut='MenuHandler._out(this);"+
						((this.items[i].iconImage) ? "MenuHandler.changeIcon(this,\""+this.items[i].iconImage.object.src+"\");":"")+
						"' "+
						((this.items[i].iconImage) ? "onMouseUp='MenuHandler.changeIcon(this,\""+this.items[i].iconImage.object.src+"\");'":"")+
						((opera || this.items[i].iconImage) ?
						"onMouseDown='"+
						((opera) ? "window.location.href=\""+loc+"\";":"")+
						((this.items[i].iconImage) ? "MenuHandler.changeIcon(this,\""+this.items[i].iconImage.clicked_object.src+"\");":"")+
						"' ":"")
						+" class='"+menuInfo.menuName+"mMenu-mi'"+((!this.items[i].iconImage) ? " style='padding-left:"+DEFAULT_ICON_SIZE+"px;'":"")+">"
						+((this.items[i].iconImage) ? "<img id='"+this.items[i].id+"-image' src='"+this.items[i].iconImage.object.src+"' class='"+menuInfo.menuName+"mMenu-icon' style='margin:"+imCSS+";' alt=''>":"")
						+(this.items[i].isSub ? "<img src='"+_arrowR.object.src+"' class='"+menuInfo.menuName+"mMenu-arrow' alt=''>":"")
						+this.items[i].label
						+"</a>";
		}
	}
	this.s += "</div>";
	for(this.i=0;this.i<this.submenus.length;this.i++) { this.s += this.submenus[this.i].action; }
	return this.s;
};
Menu.prototype.getSubMenuCode = function() {
	this.str = "";
	for(this.i=0;this.i<this.submenus.length;this.i++)
	{
		this.str += "MenuHandler.hide_frame(\""+this.submenus[this.i].action.id+"\");";
		this.str += this.submenus[this.i].action.getSubMenuCode();
	}
	return this.str;
};
Menu.prototype.add = function(obj) {
	if(obj.isSub) { this.submenus[this.submenus.length] = obj; }
	this.items[this.items.length] = obj;
};
Menu.prototype.addSeparator = function() {
	tmp = new MenuItem("","","");
	tmp.isSeparator = true;
	this.items[this.items.length] = tmp;
};
function MenuItem(l,a,t)
{
	this.id = "";
	this.label = l;
	this.isSeparator = false;
	this.action = a;
	this.tooltip = (t == null) ? false:t;
	this.isSub = (a.isMenu) ? true:false;
	this.iconImage = false;
}
MenuItem.prototype.setIconImage = function(i) { this.iconImage = i; };
function MenuBar()
{
	this.id = MenuHandler.pid+(MenuHandler.mbcntr++); // since 1.1
	this.x = 0;
	this.y = 0;
	this.isAbsolute = false;
	this.obj = [];
	//this.img_path = TMENU_IMAGES_PATH;
	this.img_loaded = false;
}
//MenuBar.prototype.setArrowImagesPath = function(p) { this.img_path=p; };
MenuBar.prototype.loadArrowImages = function() {
	_arrowD = new image(menuInfo.btn.downImageURL,7,4);
	_arrowR = new image(menuInfo.sideImageURL,4,7);
	this.img_loaded=true;
};
MenuBar.prototype.add = function(obj) { this.obj[this.obj.length] = obj; };
MenuBar.prototype.toString = function() {
	// generating button
	if(!this.img_loaded)
		this.loadArrowImages();

	for(this.L=0;this.L<this.obj.length;this.L++)
	{
		MenuHandler.sortIDs(this.obj[this.L],MenuHandler.item_prefix+this.L);
		this.obj[this.L].id = MenuHandler.pid+(MenuHandler.mbcntr-1)+"-"+MenuHandler.frame_prefix+MenuHandler.item_prefix+this.L;
		MenuHandler.all[MenuHandler.all.length] = this.obj[this.L].id;
		MenuHandler.mbcntr++; // 13/04/03
	}
	konProps = (kon) ? "float:left;":"";
	display = (this.isAbsolute) ? "position:absolute;left:"+this.x+"px;top:"+this.y+"px;":"";

	ret = "<span id='"+this.id+"' class='"+menuInfo.menuName+"mMenuBar' "+((this.isAbsolute) ? " style='margin:0px;padding:0px;"+display+"'":"")+">"; // 1.1
	
	// SET right and Left Images
	if (menuInfo.menudir == 'rtl'){
		var leftImageCap = menuInfo.btn.rightImage;
		var rightImageCap = menuInfo.btn.leftImage;
	}else{
		var rightImageCap = menuInfo.btn.rightImage;
		var leftImageCap = menuInfo.btn.leftImage;
	}
	if (rightImageCap == 'undefined') rightImageCap = "none";
	if (leftImageCap == 'undefined') leftImageCap = "none";
	if (menuInfo.btn.seperatorImage == 'undefined') menuInfo.btn.seperatorImage = "none";
	
	
	for(i=0;i<this.obj.length;i++)
	{
		
		// function that returns the place of the menu Y position
		_k = (kon && this.isAbsolute) ? 10:0;
		
		if(this.obj[i].isSelected){
			_changeBtnLook = "";
		}else{
			_changeBtnLook = "this.className='"+menuInfo.menuName+"TButton_hover';";
		}

		if (this.obj[i].isMenu) 
			_pos = "MenuHandler.show_submenu(this.menuname,'"+this.obj[i].id+"',"+"layout.getX(this)-"+_k+",layout.getY(this)-"+_k+");"+_changeBtnLook;
		else 
			_pos = _changeBtnLook;
	
		_tt = this.obj[i].tooltip ? this.obj[i].tooltip:"";
		_sub = _pos;
		//_sub = "MenuHandler.hideAllSubs();Tthread.stop();Tthread.start();"+_pos;
		//hov = MENU_HOVER_MODE ? "onMouseOver=\""+((opera || kon) ? _sub:"this.focus();")+"\" ":"";
		
		
		_act = (this.obj[i].isMenu) ? "javascript:void(0);":"window.location='"+this.obj[i].href+"' ";
		//_act = (this.obj[i].isMenu) ? "javascript:void(0);":this.obj[i].href;
		hov = " onMouseOver=\"window.clearTimeout(window.menutimeout);MenuHandler.hideAllSubs();"+((opera || kon) ? _sub:_sub)+"\" onmouseout=\"Tthread.stop();Tthread.start();this.className='"+menuInfo.menuName+"TButton'\"  ";
		var defClassName = menuInfo.menuName+"TButton";
		if(this.obj[i].isSelected){
			_act = "javascript:void(0);";
			hov = " onMouseOver=\"window.clearTimeout(window.menutimeout);MenuHandler.hideAllSubs();"+((opera || kon) ? _sub:_sub)+"\" onmouseout=\"Tthread.stop();Tthread.start();\"  ";
			defClassName = menuInfo.menuName+"TButton_Selected";
		}
		
		if (this.obj[i].image){
			_bt = "<img border='0' alt='"+_tt+"' src='"+this.obj[i].image.object.src+"' "+
					" onMouseOver=\"this.src='"+this.obj[i].image.over_object.src+"';"+((kon && MENU_HOVER_MODE) ? _sub:"")+"\" "+
					" onMouseOut=\"this.src='"+this.obj[i].image.object.src+"';\" "+
					" onMouseDown=\"this.src='"+this.obj[i].image.clicked_object.src+"';\" "+
					" onMouseUp=\"this.src='"+this.obj[i].image.object.src+"';\" "+
					(this.obj[i].image.w ? "width='"+this.obj[i].image.w+"' ":"")+(this.obj[i].image.h ? "height='"+this.obj[i].image.h+"' ":"")+
					((this.obj[i].isMenu && kon) ? "onclick=\""+_sub+"\" ":"onclick='window.location.href=\""+_act+"\";' ")+">";
		}else{
			_bt = this.obj[i].label.replace(/\s/,"&nbsp;");
		}
		_da = (!this.obj[i].image && this.obj[i].isMenu) ? "<img border=0 class='"+menuInfo.menuName+"down_arrow' src='"+_arrowD.object.src+"' align=left alt=''>":"";

		// SETTING IB BUTTONS ARE VERTICAL OT HORISONTAL
		var buttonDisplay = 'inline';
		if (menuInfo.menuButtonsAlign == 'vertical') buttonDisplay = 'block';
		
		////////////////////////////////
		// ADDING ONE BUTTON
		////////////////////////////////
		ret += "<Table style='cursor:hand;display:"+buttonDisplay+"' cellpadding=0 cellspacing=0 border=0><Tr>";
		
		if (leftImageCap != "none" && i == 0){
			ret += "<td valign=top><img src='"+leftImageCap+"'><td>";
		}
		if (menuInfo.btn.seperatorImage != "none" && i != 0){
			ret += "<td valign=top><img src='"+menuInfo.btn.seperatorImage+"'></td>";
		}

		ret += "<Td nowrap><span menuname='"+menuInfo.menuName+"' "+hov+"  onclick=\""+_act+"\" onblur='MenuHandler._blur(this);' style='display:block' class='"+defClassName+"'>&nbsp;";
		ret += _bt+_da;
		ret += "&nbsp;</span>";
		ret += "</td>";

		if (rightImageCap != "none" && i == this.obj.length-1){
			ret += "<td valign=top><img src='"+rightImageCap+"'></td>";
		}

		ret += "</tr></table>";
		////////////////////////////////

/*		ret += "<table style='display:"+buttonDisplay+"' cellpadding=0 cellspacing=0 border=1 width="+menuInfo.btn.width+" height="+menuInfo.btn.height+"><tr><TD width="+menuInfo.btn.width+" height="+menuInfo.btn.height+" nowrap>";
		ret += "<a menuname='"+menuInfo.menuName+"' "+((!kon) ? hov:"")+"  onblur='MenuHandler._blur(this);' href='"+_act+"'"+((_tt) ? " title='"+_tt+"'":"")+((!this.obj[i].image) ? " class='"+defClassName+"'":"")+" >&nbsp;";
		ret += _bt+_da;
		ret += "&nbsp;</a>";
		ret += "</td></tr></table>";
*/
	}
	ret += "</span>";
	// preload Back image
	ret += "<span style='overflow:hidden;width=0px;height:0px;'><img src='"+menuInfo.btn.backImageHot+"' width=0 height=0></span>";
	
	for(this.I=0;this.I<this.obj.length;this.I++) { ret += this.obj[this.I]; }
	window.status = "";
	return ret;
};
function MenuButton(l,h,isSelected,t)
{
	this.t = new Menu(l);
	this.t.isSelected = isSelected;
	this.t.isMenu=false;
	this.t.href=h;
	this.t.tooltip=t;
	return this.t;
}
function image(loc,w,h)
{
	this.w = w!=null ? w:false;
	this.h = h!=null ? h:false;
	this.object = new Image();
	this.over_object = new Image();
	this.clicked_object = new Image();
	this.object.src = this.over_object.src = this.clicked_object.src = loc;
	this.isImage = true;
}
image.prototype.setImage = function(loc) { this.object.src = loc; };
image.prototype.setOverImage = function(loc) { this.over_object.src = loc; };
image.prototype.setClickedImage = function(loc) { this.clicked_object.src = loc; };


/****************************************************************/
/******************* MY ADDITIONS ***************************/
/****************************************************************/




function getDhtmlMenuStyle(menuInfo){
	// creates a copy of the menue definitions
	// and name it as the currently renderedmenu name
	eval("mn"+menuInfo.menuName+"mn = menuInfo.clone();");

	if(menuInfo.version == undefined){
		menuInfo.btn.paddingTopHot = menuInfo.btn.paddingTop;
		menuInfo.btn.paddingLeftHot = menuInfo.btn.paddingLeft;
		menuInfo.btn.paddingRightHot = menuInfo.btn.paddingRight;
		menuInfo.btn.paddingBottomHot = menuInfo.btn.paddingBottom;

		menuInfo.btn.paddingTopSelected = menuInfo.btn.paddingTop;
		menuInfo.btn.paddingLeftSelected = menuInfo.btn.paddingLeft;
		menuInfo.btn.paddingRightSelected = menuInfo.btn.paddingRight;
		menuInfo.btn.paddingBottomSelected = menuInfo.btn.paddingBottom;
	}

	var buttonDisplay = 'inline';
	if (menuInfo.menuButtonsAlign == 'vertical'){
		buttonDisplay = 'block';
	}
	var sCode="<style>\n";

	sCode += "."+menuInfo.menuName+"mMenuBar {\n";
	sCode += "	direction:"+menuInfo.menudir+";\n";
	sCode += "	height:20px;\n";
	sCode += "	}\n";

	// the menus css
	sCode += "	."+menuInfo.menuName+"mMenu \n";
	sCode += "	{\n";
	try{
		sCode += "	width:"+menuInfo.menuWidth+"px;\n";
	}catch(err){
		sCode += "	width:150px;\n";
	}
	sCode += "	position:absolute;\n";
	sCode += "	direction:"+menuInfo.menudir+";\n";
	sCode += "	z-index:100;\n";
	sCode += "	background-color:"+menuInfo.backColor+";\n";
	try{
		sCode += "	background-image:url("+menuInfo.backImage+");\n";
	}catch(err){}
	sCode += "	visibility:hidden;\n";
	sCode += "	border:"+menuInfo.borderSize+"px "+menuInfo.borderStyle+" "+menuInfo.borderColor+";\n";
	sCode += "	filter:progid:DXImageTransform.Microsoft.Alpha(opacity="+menuInfo.opacity+")\n";
	if (menuInfo.shadowFlag == 'true')
		sCode += "	progid:DXImageTransform.Microsoft.Shadow(color='#777777', Direction=135, Strength=4);\n";
	else
		sCode += ";\n";
	sCode += "	}\n";
	
	sCode += "	."+menuInfo.menuName+"mMenu-mi {\n";
	sCode += "	border:"+menuInfo.hotbarBorderSize+"px solid "+menuInfo.backColor+";\n";
	//sCode += "	background-color:"+menuInfo.backColor+";\n";
	sCode += "	display:block;\n";
	sCode += "	text-decoration:none;\n";

	sCode += "	padding-left:"+menuInfo.hotbarPaddingLeft+"px;\n";
	sCode += "	padding-top:"+menuInfo.hotbarPaddingTop+"px;\n";
	sCode += "	padding-right:"+menuInfo.hotbarPaddingRight+"px;\n";
	
	sCode += "	font-family:"+menuInfo.btn.textFont+";\n";
	sCode += "	font-size: "+menuInfo.textSize+";\n";
	sCode += "	text-decoration:none;\n";
	sCode += "	color:"+menuInfo.textColor+";\n";
	sCode += "	height:"+menuInfo.hotbarHeight+"px;\n";
	sCode += "	direction:"+menuInfo.menudir+";\n";
	if (menuInfo.menudir == 'rtl')
		sCode += "	text-align:right;\n";
	else
		sCode += "	text-align:left;\n";

	sCode += "	}\n";

	sCode += "	."+menuInfo.menuName+"mMenu-mi:hover {\n";
	sCode += "	background-color:"+menuInfo.hotbarColor+";\n";
	sCode += "	background-image:url("+menuInfo.hotbarBackImage+");\n";
	sCode += "	color:"+menuInfo.textHotColor+";\n";
	sCode += "	border:"+menuInfo.hotbarBorderSize+" "+menuInfo.hotbarBorderStyle+" "+menuInfo.hotbarBorderColor+";\n";
	sCode += "	}\n";

	sCode += "	."+menuInfo.menuName+"mMenu-icon {\n";
	sCode += "	padding:0px 3px 0px 0px;\n";
	if (menuInfo.menudir == 'rtl')
		sCode += "	float:left;\n";
	else
		sCode += "	float:right;\n";
	sCode += "	border:0px;\n";
	sCode += "	}\n";

	sCode += "	."+menuInfo.menuName+"mMenu-arrow {\n";
	sCode += "	border:0px;\n";
	if (menuInfo.menudir == 'rtl')
		sCode += "	float:left;\n";
	else
		sCode += "	float:right;\n";
	sCode += "	padding:0px;\n";
	sCode += "	vertical-align: baseline;\n";
	sCode += "	}\n";

	sCode += "	.mMenu-separator {\n";
	sCode += "	font-size:0px;\n";
	sCode += "	background-color:#FFFFFF;\n";
	sCode += "	height:1px;\n";
	sCode += "	margin:1px;\n";
	sCode += "	border-top:1px solid #808080;\n";
	sCode += "	border-bottom:1px solid #FFFFFF;\n";
	sCode += "	}\n";

	sCode += "	."+menuInfo.menuName+"TButton {\n";
	sCode += "	width:"+menuInfo.btn.width+"px;\n";
	sCode += "	height:"+menuInfo.btn.height+"px;\n";
	//sCode += "	white-space: nowrap;\n";
	sCode += "	color:"+menuInfo.btn.textColor+";\n";
	sCode += "	text-align:"+menuInfo.btn.align+";\n";
	sCode += "	font-family:"+menuInfo.btn.textFont+";\n";
	sCode += "	font-weight:"+menuInfo.btn.textWeight+";\n";
	sCode += "	font-size:"+menuInfo.btn.textSize+";\n";
	sCode += "	text-decoration:none;\n";
	sCode += "	padding-top:"+menuInfo.btn.paddingTop+"px;\n";
	sCode += "	padding-left:"+menuInfo.btn.paddingLeft+"px;\n";
	sCode += "	padding-right:"+menuInfo.btn.paddingRight+"px;\n";
	sCode += "	padding-bottom:"+menuInfo.btn.paddingBottom+"px;\n";
	sCode += "	display:"+buttonDisplay+";\n";
	sCode += "	background-color:"+menuInfo.btn.backColor+";\n";
	sCode += "	background-image:url("+menuInfo.btn.backImage+");\n";
	//sCode += "	padding:1px 5px 0px 7px;\n";
	sCode += "	border:"+menuInfo.btn.borderSize+"px "+menuInfo.btn.borderStyle+" "+menuInfo.btn.borderColor+";\n";
	sCode += "	margin-left:"+menuInfo.btn.hSpacing+"px;\n";
	sCode += "	margin-bottom:"+menuInfo.btn.vSpacing+"px;\n";
	sCode += "	}\n";

	sCode +="	."+menuInfo.menuName+"TButton_hover {\n";
		var hc = "";
		//hc += "	white-space: nowrap;\n";
		hc += "	padding-top:"+menuInfo.btn.paddingTopHot+"px;\n";
		hc += "	padding-left:"+menuInfo.btn.paddingLeftHot+"px;\n";
		hc += "	padding-right:"+menuInfo.btn.paddingRightHot+"px;\n";
		hc += "	padding-bottom:"+menuInfo.btn.paddingBottomHot+"px;\n";
		hc += "	width:"+menuInfo.btn.width+"px;\n";
		hc += "	height:"+menuInfo.btn.height+"px;\n";
		hc += "	display:"+buttonDisplay+";\n";
		hc += "	background-color:"+menuInfo.btn.backHotColor+";\n";
		hc += "	background-image:url("+menuInfo.btn.backImageHot+");\n";
			hc += "	text-decoration:none;\n";
			hc += "	text-align:"+menuInfo.btn.align+";\n";
			hc += "	font-family:"+menuInfo.btn.textFont+";\n";
			hc += "	font-weight:"+menuInfo.btn.textWeight+";\n";
			hc += "	font-size:"+menuInfo.btn.textSize+";\n";
			hc += "	text-decoration:none;\n";
		hc += "	border:"+menuInfo.btn.borderSize+"px "+menuInfo.btn.borderStyleHot+" "+menuInfo.btn.borderColorHot+";\n";
		hc += "	margin-left:"+menuInfo.btn.hSpacing+"px;\n";
		hc += "	margin-bottom:"+menuInfo.btn.vSpacing+"px;\n";
		hc += "	COLOR: "+menuInfo.btn.textHotColor+";\n";
		hc += "	}\n";
	sCode +=hc;

	sCode += "	."+menuInfo.menuName+"TButton:hover {\n";
	sCode += hc;

	sCode += "	."+menuInfo.menuName+"TButton_selected {\n";
		var sc="";
		if(menuInfo.btn.backSelectedColor == undefined &&
			menuInfo.btn.borderStyleSelected == undefined &&
			menuInfo.btn.textSelectedColor == undefined){
			// THIS CODE HAS NO Selected Button defined - use hot
			sc = hc;
		}else{
			sc += "	padding-top:"+menuInfo.btn.paddingTopSelected+"px;\n";
			sc += "	padding-left:"+menuInfo.btn.paddingLeftSelected+"px;\n";
			sc += "	padding-right:"+menuInfo.btn.paddingRightSelected+"px;\n";
			sc += "	padding-bottom:"+menuInfo.btn.paddingBottomSelected+"px;\n";
			sc += "	width:"+menuInfo.btn.width+"px;\n";
			sc += "	height:"+menuInfo.btn.height+"px;\n";
			sc += "	display:"+buttonDisplay+";\n";
			sc += "	background-color:"+menuInfo.btn.backSelectedColor+";\n";
			sc += "	background-image:url("+menuInfo.btn.backImageSelected+");\n";
				sc += "	text-decoration:none;\n";
				sc += "	text-align:"+menuInfo.btn.align+";\n";
				sc += "	font-family:"+menuInfo.btn.textFont+";\n";
				sc += "	font-weight:"+menuInfo.btn.textWeight+";\n";
				sc += "	font-size:"+menuInfo.btn.textSize+";\n";
				sc += "	text-decoration:none;\n";
			sc += "	border:"+menuInfo.btn.borderSize+"px "+menuInfo.btn.borderStyleSelected+" "+menuInfo.btn.borderColorSelected+";\n";
			sc += "	margin-left:"+menuInfo.btn.hSpacing+"px;\n";
			sc += "	margin-bottom:"+menuInfo.btn.vSpacing+"px;\n";
			sc += "	COLOR: "+menuInfo.btn.textSelectedColor+";\n";
			sc += "	}\n";
		}
	sCode += sc;
	
	sCode += "	."+menuInfo.menuName+"TButton:active {\n";
		sCode += "	text-decoration:none;\n";
		sCode += "	text-align:"+menuInfo.btn.align+";\n";
		sCode += "	font-family:"+menuInfo.btn.textFont+";\n";
		sCode += "	font-weight:"+menuInfo.btn.textWeight+";\n";
		sCode += "	font-size:"+menuInfo.btn.textSize+";\n";
		sCode += "	text-decoration:none;\n";
	sCode += "	color:"+menuInfo.btn.textColor+";\n";
	sCode += "	border:"+menuInfo.btn.borderSize+"px "+menuInfo.btn.borderStyle+" "+menuInfo.btn.borderColor+";\n";
	sCode += "	}\n";

	sCode += "	."+menuInfo.menuName+"TButton:visited {\n";
		sCode += "	text-decoration:none;\n";
		sCode += "	text-align:"+menuInfo.btn.align+";\n";
		sCode += "	font-family:"+menuInfo.btn.textFont+";\n";
		sCode += "	font-weight:"+menuInfo.btn.textWeight+";\n";
		sCode += "	font-size:"+menuInfo.btn.textSize+";\n";
		sCode += "	text-decoration:none;\n";
	sCode += "	color:"+menuInfo.btn.textColor+";\n";
	sCode += "	border:"+menuInfo.btn.borderSize+"px "+menuInfo.btn.borderStyle+" "+menuInfo.btn.borderColor+";\n";
	sCode += "	}\n";

	sCode += "	."+menuInfo.menuName+"down_arrow {\n";
	sCode += "	border:0px solid black;\n";
//	sCode += "	float:left;\n";
	sCode += "	vertical-align: bottom;\n";
	sCode += "	margin:0px 0px 0px 0px;\n";
	sCode += "	}\n";
	
	sCode += "</style>\n";
//	alert(sCode);
	return sCode;
}



	function MenuInfo(){
		var version;
		
		var selctedBtnLabel;
		
		var menuName;
		var viewType;

		var menudir; // direction "rtl" ot "ltr"
		var menuButtonsAlign;
		var menuWidth;

		var borderColor;
		var borderStyle;
		var borderSize;

		var hotbarColor;
		var hotbarBorderColor;
		var hotbarBorderStyle;
		var hotbarBorderSize;

		var hotbarHeight; //new
		var hotbarBackImage; //new

		var hotbarPaddingTop; //new
		var hotbarPaddingRight; //new
		var hotbarPaddingLeft; //new
		
		var backImage;

		var backColor;
		var shadowFlag;
		var opacity;
		
		var textColor;
		var textHotColor;
		var textSelectedColor;
		var textSize;
				
		var sideImageURL;
				
		this.btn = new ButtonInfo();

		// public //
		this.getMenuCode = private_getMenuCode;
		this.clone = private_MenuClone;

		// private //
 		this.private_getMenuCodeByName = private_getMenuCodeByName;

	}
	function ButtonInfo(){
		var backColor;
		var backHotColor;
		var backSelectedColor;
		var backDownColor;
		
		var width;
		var height;
		var vSpacing;
		var hHpacing;

		var downImageURL;
		
		var textColor;
		var textHotColor;
		var textSelectedColor;
		var textDownColor;
		var textSize;
		var textFont; //new

		var borderColor;
		var borderStyle;
		var borderSize;
		
		var paddingBottom;
		var paddingTop;
		var paddingLeft;
		var paddingRight; //new
		
		var paddingBottomHot;//new
		var paddingTopHot;//new
		var paddingLeftHot;//new
		var paddingRightHot; //new
		
		var paddingBottomSelected;//new
		var paddingTopSelected;//new
		var paddingLeftSelected;//new
		var paddingRightSelected; //new
		
		var align;
		
		var backImage;
		var backImageHot;
		var backImageSelected;
		
		var seperatorImage; // new new
		var rightImage; // new new
		var leftImage; // new new
		
	}
	
	// this function is called when the menu generates in the editor
	// it is not called on runtime
	function private_getMenuCode(){
		return this.private_getMenuCodeByName("menuInfo");
	}
	
	function private_MenuClone(){
		eval("var mn"+this.menuName+"mn = new MenuInfo();");
		eval(this.private_getMenuCodeByName("mn"+this.menuName+"mn"));
		return eval("mn"+this.menuName+"mn");
	}
	
	function private_getMenuCodeByName(menuObjName){
	    
	    js = "";
		js += "	"+menuObjName+".version = '"+this.version+"';";

		js += "	"+menuObjName+".btn.backImageHot = '"+this.btn.backImageHot+"';";
		js += "	"+menuObjName+".btn.textHotColor = '"+this.btn.textHotColor+"';";
		js += "	"+menuObjName+".btn.borderColorHot = '"+this.btn.borderColorHot+"';";
		js += "	"+menuObjName+".btn.borderStyleHot = '"+this.btn.borderStyleHot+"';";

        //js += ""+menuObjName+" = new "+menuObjName+";";
		js += "	"+menuObjName+".btn.backImageSelected = '"+this.btn.backImageSelected+"';";
		js += "	"+menuObjName+".btn.textSelectedColor = '"+this.btn.textSelectedColor+"';";
		js += "	"+menuObjName+".btn.borderColorSelected = '"+this.btn.borderColorSelected+"';";
		js += "	"+menuObjName+".btn.borderStyleSelected = '"+this.btn.borderStyleSelected+"';";

		js += ""+menuObjName+".menuName = '"+this.menuName+"';";

		js += "	"+menuObjName+".menudir = '"+this.menudir+"';";
		js += "	"+menuObjName+".menuButtonsAlign = '"+this.menuButtonsAlign+"';";
		js += "	"+menuObjName+".menuWidth = '"+this.menuWidth+"';";
		js += "	"+menuObjName+".viewType = '"+this.viewType+"';";

		js += "	"+menuObjName+".borderColor = '"+this.borderColor+"';";
		js += "	"+menuObjName+".borderStyle = '"+this.borderStyle+"';";
		js += "	"+menuObjName+".borderSize = '"+this.borderSize+"';";

		js += "	"+menuObjName+".hotbarColor = '"+this.hotbarColor+"';";
		js += "	"+menuObjName+".hotbarBorderColor = '"+this.hotbarBorderColor+"';";
		js += "	"+menuObjName+".hotbarBorderStyle = '"+this.hotbarBorderStyle+"';";
		js += "	"+menuObjName+".hotbarBorderSize = '"+this.hotbarBorderSize+"';";

		js += "	"+menuObjName+".hotbarPaddingTop = '"+this.hotbarPaddingTop+"';";//new
		js += "	"+menuObjName+".hotbarPaddingRight = '"+this.hotbarPaddingRight+"';";//new
		js += "	"+menuObjName+".hotbarPaddingLeft = '"+this.hotbarPaddingLeft+"';";//new

		js += "	"+menuObjName+".hotbarHeight = '"+this.hotbarHeight+"';";//new
		js += "	"+menuObjName+".hotbarBackImage = '"+this.hotbarBackImage+"';";//new

		js += "	"+menuObjName+".backImage = '"+this.backImage+"';";

		js += "	"+menuObjName+".backColor = '"+this.backColor+"';";
		js += "	"+menuObjName+".shadowFlag = '"+this.shadowFlag+"';";
		js += "	"+menuObjName+".opacity = '"+this.opacity+"';";

		js += "	"+menuObjName+".textColor = '"+this.textColor+"';";
		js += "	"+menuObjName+".textHotColor = '"+this.textHotColor+"';";
		js += "	"+menuObjName+".textSelectedColor = '"+this.textSelectedColor+"';";
		js += "	"+menuObjName+".textSize = '"+this.textSize+"';";

		js += "	"+menuObjName+".sideImageURL = '"+this.sideImageURL+"';\n";

		//js += ""+menuObjName+".btn = new ButtonInfo;";
		//js += "function ButtonInfo(){";
		js += "	"+menuObjName+".btn.backColor = '"+this.btn.backColor+"';";
		js += "	"+menuObjName+".btn.backHotColor = '"+this.btn.backHotColor+"';";
		js += "	"+menuObjName+".btn.backSelectedColor = '"+this.btn.backSelectedColor+"';";
		//js += "	"+menuObjName+".btn.backDownColor = '"+this.btn.backDownColor+"';";

		js += "	"+menuObjName+".btn.textColor = '"+this.btn.textColor+"';";
		js += "	"+menuObjName+".btn.textSize = '"+this.btn.textSize+"';";
		js += "	"+menuObjName+".btn.textFont = '"+this.btn.textFont+"';";
		js += "	"+menuObjName+".btn.textWeight = '"+this.btn.textWeight+"';";
		//js += ""+menuObjName+".btn.textDownColor = '"+this.btn.textDownColor+"';";

		js += "	"+menuObjName+".btn.borderColor = '"+this.btn.borderColor+"';";
		js += "	"+menuObjName+".btn.borderStyle = '"+this.btn.borderStyle+"';";
		js += "	"+menuObjName+".btn.borderSize = '"+this.btn.borderSize+"';";

		js += "	"+menuObjName+".btn.width = '"+this.btn.width+"';";
		js += "	"+menuObjName+".btn.height = '"+this.btn.height+"';";
		js += "	"+menuObjName+".btn.vSpacing = '"+this.btn.vSpacing+"';";
		js += "	"+menuObjName+".btn.hSpacing = '"+this.btn.hSpacing+"';";

		js += "	"+menuObjName+".btn.paddingTop = '"+this.btn.paddingTop+"';";
		js += "	"+menuObjName+".btn.paddingLeft = '"+this.btn.paddingLeft+"';";
		js += "	"+menuObjName+".btn.paddingRight = '"+this.btn.paddingRight+"';";
		js += "	"+menuObjName+".btn.paddingBottom = '"+this.btn.paddingBottom+"';";

		js += "	"+menuObjName+".btn.paddingTopHot = '"+this.btn.paddingTopHot+"';";
		js += "	"+menuObjName+".btn.paddingLeftHot = '"+this.btn.paddingLeftHot+"';";
		js += "	"+menuObjName+".btn.paddingRightHot = '"+this.btn.paddingRightHot+"';";
		js += "	"+menuObjName+".btn.paddingBottomHot = '"+this.btn.paddingBottomHot+"';";

		js += "	"+menuObjName+".btn.paddingTopSelected = '"+this.btn.paddingTopSelected+"';";
		js += "	"+menuObjName+".btn.paddingLeftSelected = '"+this.btn.paddingLeftSelected+"';";
		js += "	"+menuObjName+".btn.paddingRightSelected = '"+this.btn.paddingRightSelected+"';";
		js += "	"+menuObjName+".btn.paddingBottomSelected = '"+this.btn.paddingBottomSelected+"';";

		js += "	"+menuObjName+".btn.align = '"+this.btn.align+"';";

		js += "	"+menuObjName+".btn.backImage = '"+this.btn.backImage+"';";

		// new seperator images
		js += "	"+menuObjName+".btn.seperatorImage = '"+this.btn.seperatorImage+"';";
		js += "	"+menuObjName+".btn.rightImage = '"+this.btn.rightImage+"';";
		js += "	"+menuObjName+".btn.leftImage = '"+this.btn.leftImage+"';";

		js += "	"+menuObjName+".btn.downImageURL = '"+this.btn.downImageURL+"';";

		//js += "	this.btn = new ButtonInfo();";
		//js += "}";
		return js;

	}
	

/**********************************/
/******** SET GLOBAL VARS *********/
/**********************************/


var menuInfo = new MenuInfo;
menuInfo.btn = new ButtonInfo;

// MENU

menuInfo.menuName = 'defaultMN';
menuInfo.selectedPageTitle = "none";

menuInfo.menudir = 'rtl';
menuInfo.menuButtonsAlign = 'horisontal';
menuInfo.menuWidth = '150';
menuInfo.viewType = 'all';

menuInfo.backImage = "none";

menuInfo.backColor = "ffaaff";
menuInfo.shadowFlag = 'true';
menuInfo.opacity = 90;

menuInfo.borderColor = "black";
menuInfo.borderStyle = "solid";
menuInfo.borderSize = "2";

menuInfo.hotbarColor = "green";
menuInfo.hotbarBorderColor = "red";
menuInfo.hotbarBorderStyle = "solid";
menuInfo.hotbarBorderSize = "1";

menuInfo.hotbarHeight = "20";
menuInfo.hotbarBackImage = "none";

menuInfo.textColor = "black";
menuInfo.textHotColor = "white";
menuInfo.textSize = "x-small";

// BUTTON
menuInfo.btn.backColor = "brown";
menuInfo.btn.backHotColor = "white";
//menuInfo.btn.backDownColor = "black";
menuInfo.menuAlign = 'horisontal';

menuInfo.btn.textColor = "white";
menuInfo.btn.textHotColor = "brown";
menuInfo.btn.textDownColor;
menuInfo.btn.textSize = "x-small";
menuInfo.btn.textFont = "arial";
menuInfo.btn.textWeight = "normal";

menuInfo.btn.width='100';
menuInfo.btn.height='20';
menuInfo.btn.vSpacing='0';
menuInfo.btn.hSpacing='0';

menuInfo.btn.borderColor = "black";
menuInfo.btn.borderColor = "black";
menuInfo.btn.borderColorHot = "black";
menuInfo.btn.borderStyle = "solid";
menuInfo.btn.borderStyleHot = "solid";
menuInfo.btn.borderSize = "2";

menuInfo.btn.paddingTop = "0";
menuInfo.btn.paddingLeft = "0";
menuInfo.btn.paddingRight = "0";
menuInfo.btn.paddingBottom = "0";
menuInfo.btn.align = "center";

menuInfo.btn.backImage = "none";
menuInfo.btn.backImageHot = "none";

menuInfo.btn.seperatorImage = "none";
menuInfo.btn.rightImage = "none";
menuInfo.btn.leftImage = "none";