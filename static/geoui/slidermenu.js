//Title, Have Children, Icon,  href, a , state (show || collapsed), description
var EXAMPLE_menu = `
//==>My MENU HEADING
#  Home    ;  fa fa-home            ;   #    ; onclick="" ;   ; Description 
## Home1   ;
## Home2   ;
## Home3   ;

# Snacks   ; fas fa-angle-right

# About    ; fas fa-book-reader
---
#   Gear   ; fas fa-Hammer
##  Ice    ;  ""              
### Home11  ;  ""                      ; #     ;              ; show
#### Home111   ;  
#### Home112   ;  
#### Home113   ;  
### Home2  ;  ""
### Home3  ;  ""
---
# Portfolio; fas fa-paint-brush
# Contact  ; fas fa-cocktail
`;

DEFAULT_ICON ="";

function menuExpandAll(){
    $('*[id*=zzID]').each(function(){
        $(this).removeClass('collapse');
        $(this).addClass('show');
        $(this).prev().removeClass('collapsed');
   })
}
function menuCollapseAll(){
    $('*[id*=zzID]').each(function(){
        $(this).removeClass('show');
        $(this).addClass('collapse');
        $(this).prev().addClass('collapsed');
    });
}
function menusetActive(a) {
    $('#sidebar').find('ul li').each(function (i) {
        $(this).removeClass('active');
    });
    var d = $(a).parent().closest('li').addClass('active');
}

function toggleParentDiv(di){
    var d = $(di).parent().closest('div');
    if (parseInt($(d).css('width')) > 70 ){
        $(d).css('oldwidth', $(d).width());
        $(d).css('width', "50px");
    } else{
        var w = $(d).css('oldwidth') || '230px';
        $(d).css('width', w);
    }
    $(window).resize();
}

function olevel(t, previousLevel){
    if (!t.startsWith('#')){
        return previousLevel || -1;
    }
    for (var l = 0; l < t.length; l++){
        if (t[l] !== '#')
            break;
    }
    return l;
}
function nextLevel(omenu, cur) {
    var ret = -1;
    if (cur == omenu.length - 1) {
        return ret;
    }
    for (var i=cur+1; i < omenu.length; i++ ) {
        if (!omenu[i].startsWith("#")) {
            continue;
        }
        ret = olevel(omenu[i]);
        break;
    }
    return ret;
}

function drawMenuHeading(h){
    var h = `<ul><li><p><a href>${h}</a></p></li></ul>
        <div
        style="background: #f9f9f9; font-variant-caps: small-caps; text-align: center;font-size:small; height: 30px;
            border-bottom: 1px solid silver; border-top: 1px solid silver; width: 100%;
            display: table;vertical-align: middle !important; margin-left: -100px;">
    <div style="width:100%; display: table-cell;vertical-align: middle !important;">
        <ul><li><a>${h}</a></li></ul>
    </div></div>\n`;
    return h;
}
function _sliderMenu_DefaultMenuItemClicked(d, a){
    //console.log("You can defined this function and overide");
    menusetActive(a);

    // Stop the propogation of toggling only if clicked closed to arrow
    var e = window.event;
    var c = e.target.offsetLeft + e.target.offsetWidth
    if ( c - e.x > 50 )
        window.event.stopPropagation()
}

function menuItemClicked(d, a) {
    _sliderMenu_DefaultMenuItemClicked(d,a)
}

function getSidebarHTML(omenu ) {
    var out="";
    var inside = 0;

    var thisRand = Math.floor(Math.random() * 1000000);
    var lvl;

    for (var i=0; i < omenu.length; i++ ){
        var om  = omenu[i].trim();
        if (om.startsWith("---")){
            out += "<hr/>\n";
            continue;
        } else if (om.startsWith("--") || om.startsWith("//")) { // comment
            continue;
        } else if (om.startsWith("==>") ) { // comment
            out += drawMenuHeading(om.substr(3));
            continue;
        } else if (!om.startsWith("#")) {
            out += om + "\n";
            continue;
        }
        var os  = om.split(";");
        for (var o in os){
            os[o] = os[o].trim();
        }
        var hr, a, t, ic, it,show, desc;
        lvl = olevel(om);
        t = os[0].replace(/^#*/,"").trim();
        ic= os[1] || ""; hr = os[2] || "#";  show = os[4] || 'collapse'; desc = os[5] ||"";

        a = os[3] || "";
        if (!a ) {
            a = `onclick="menuItemClicked('${t}', this)"`;
        } else if (a && a.length > 0 && !a.startsWith("onclick")) {
            a = `onclick="menuItemClicked('${a}', this)"`;
        }

        if ( ic&& !ic.startsWith("<"))
            ic = `<i class="${ic}"></i>`
        if (!ic && lvl <= 1 ){
            ic = '<i class="fa fa-bookmark" ></i>';
        }
        var nlvl = nextLevel(omenu, i);

        if ( i == omenu.length-1 || nlvl <= lvl ){
            it = `<li><a title="${t} : ${desc}" href="${hr}" ${a}> ${ic} ${t}</a></li>`;
            out += "\t".repeat(lvl) + it + "\n";

            while ( (i == omenu.length-1 || nlvl < lvl) && inside){
                inside--;
                nlvl++;
                out += "\t".repeat(lvl) + "</ul></li>\n";
            }
        } else if( olevel(omenu[i+1]) > lvl ){
            var zzID= "zzID__" + thisRand++;

            it = `<li><a title="${t} : ${desc}" ${a} data-target="#${zzID}" data-toggle="collapse" aria-expanded="false" 
                        class="dropdown-toggle collapsed">
                        ${ic} ${t}  </a>
                    <ul class="${show} list-unstyled" id="${zzID}">
                `;
            out += "\t".repeat(lvl) + it;
            inside++;
        }
    }
    return out;
}

function parseMenuStr(menu) {
    var menu1 = menu.replace(/^\s*$(?:\r\n?|\n)/gm, "").trim();
    var omenu = menu1.split("\n");
    for (var i=0; i < omenu.length; i++ ) {
        omenu[i] = omenu[i].trim();
    }
    return omenu;
}

function getmenu(menu, div, title, showToogle) {
    menu = menu || ((div)? $(div).html(): EXAMPLE_menu);

    omenu = parseMenuStr(menu, div);

    return getmenu1(omenu, div, title, showToogle);
}

function getmenu1(omenu, div, title, showToogle, defIcon){
    DEFAULT_ICON = defIcon;

    var menus  = getSidebarHTML(omenu);
    title = title || '';
    var toggl  = `<a
        style="padding-left: 24px; padding-top: 15px; display: table; font-weight: bold; white-space: nowrap "
        onClick="toggleParentDiv(this)">
        <i class="fas fa-bars"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${title}
    </a>
    <hr/>`;

    if (typeof showToogle !== "undefined" && !showToogle) {
        toggl = '';
    }

    var out = `${toggl}
        <nav id="sidebar">
        <ul class="list-unstyled components">
        ${menus}
</u></nav>`;

    if ( div )
        $(div).html(out);

    return out;
}


//!-------------- EXTRA
$(document).on('click', ':not(.dropdown)', function(e) {
  if ($(this).closest('.dropdown-toggle').length == 0) {
      //
      // if on doc and not on a dropdown....
      //
      e.stopPropagation();
  }
});
$(document).on('click', function(e) {
    $('.dropdown').find('.dropdown-menu').stop();
});
$('.dropdown-toggle').on( 'click', function(e) {
    e.stopPropagation();
});
