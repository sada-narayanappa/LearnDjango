// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SPLIT through double quotes on comma
function mysplit(str) {
    var arr = str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return arr;
}
/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
function geoui_setupMATHJAX(div){
    if (typeof  MathJax !== 'undefined' ) {
        MathJax.Hub.Config({
            extensions: ["tex2jax.js"],
            tex2jax: {
                inlineMath:       [ ['$','$'], ["\\(","\\)"] ],
                equationNumbers:  { autoNumber: "AMS" } ,
                processEscapes:   true
            },
            TeX: { equationNumbers: { autoNumber: "AMS" } },
            "HTML-CSS": { availableFonts: ["TeX"] }
          });
        MathJax.Hub.Queue(["Typeset",MathJax.Hub, document.getElementById(div)]);
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function geoui_nthIndex(str, ch, n=0) {
    var ret  = 0
    var from = -1;

    while (n-- >= 0 ) {
        from = str.indexOf(ch, from+1)
        if (from < 0)
            break;
        ret = from;
    }
    return ret;
}

function geoui_scrollTo(ch='‣'){
    var st  = $(`*:contains(${ch}):last`).offset() || 0;
    if ( st) {
        var stt = st.top - window.innerHeight/2;
        if ( st.top > window.innerHeight )
            $(window).scrollTop(stt);
    }

}
/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * This prints a DIV element on the client side
 *
 * @param elem
 * @returns {boolean}
 * @constructor
 */

function PrintElem(elem) {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return false;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
function parseDate(s) {
    if (typeof s == "object" )
        return s;
    d = new Date(s);

}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
function toggleDiv(di){
    if (typeof di === "string") {
        if ( !di.startsWith('#')) {
            di = '#'  + di;
        }
    }
    var d = $(di).css('display');
    if (d =='none') {
        $(di).css('display', "");
    } else{
        $(di).css('display', "none");
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
function toggleDiv1(di){
    if (typeof di === "string") {
        if ( !di.startsWith('#')) {
            di = '#'  + di;
        }
    }
    var d = $(di).is(':visible');
    if (d) {
        $(di).hide();
    } else{
        $(di).show();
    }
}// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
function copyText(id, val) {
    if ( !id) {
        id =  "share_copy";
    }
    $('#'+id).val(val);
    var copyText = document.getElementById(id);
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    document.execCommand("copy");
    //salert("Copied to clipboard: " + copyText.value);
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
function getallInputs() {
    var $inputs = $(':input');
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
    return values;
}
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    This will filter rows with filter value given in text field
    USe as follows:

    setupFilter('#filter', '#sensorsTable')

*/
let FilterFunctionCB = null;
function setupFilter(textBox, table) {
    $(textBox).keyup(function() {
        if (FilterFunctionCB) {
            clearTimeout(FilterFunctionCB);
        }
        var fv = $(textBox).val();
        FilterFunctionCB = setTimeout(`filterFunc("${table}", "${fv}")`, 500)
    });
}
function filterFunc(tab, filterVal, column=null) {
    tab += " tr";
    var $rows = $(tab).not(':first');
    var val = $.trim(filterVal).replace(/ +/g, ' ').toLowerCase();
    if ( $rows.length <= 6 || ($rows.length > 4000 && val.length <=2) ) {
        console.log("Ignoring Filter==> #rows:", $rows.length , val.length);
        return;
    }
    //console.log(tab, $rows.length , val, column);

    $("body").css("cursor", "progress");

    $rows.show().filter(function() {
        var text = (column) ? $(this).find("td")[column-1].textContent : $(this).find("td").text()
        
        text = text.replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
        
    }).hide();

    $("body").css("cursor", "default");
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getTableColumn(tableID, col=0, parse=0){
    var ttab = $(tableID);
    var data  = [];
    ttab.find('tr').each(function (i, el) {
        var txt = el.cells[col].innerText;
        data.push(txt);
    });
    return data;
}
function saveTable(tableID = '#tabledd', name = "/tmp/__test__.csv", skipCols=0, skipRows=-1) {
    var ttab = $(tableID);
    var out = "";
    var row, col;
    row = -1;
    ttab.find('tr').each(function (i, el) {
        if (++row <= skipRows)
            return;
        var txt = "";
        col = -1;
        $(this).children().each(function (j,elt) {
            if (++col <= skipCols)
                return;
            txt += elt.innerText + ",";
        });
        if ( txt[txt.length-1] ==','){
            txt[txt.length-1] = '';
        }
        out += txt + "\n";
    });
    return out;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}
            
function FillRemainingHeight(n = '#tabledd1'){
    if ( !n.startsWith('#') )
        n = '#' +n
    
    var h = window.innerHeight
    var i = getOffset($(n).get(0)) // {top: 920, left: 0}
    var ht = h - i.top - 15;
    $(n).height( ht )
    console.log(i, ht)
}  
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
var WTEMP = `
#label        ; icon            ;  onlck    ; id        ; type          ,   placeholder        ; value    ;                  ; title
<div class="row">
<div class="col-md-3 draggable">
<legend> Traing Data Details </legend>
Trn           , fa fa-database  ,            ,trn1      , text          ,   Connection Info    , localhost:8086/mydb:test  , "Training Dat; defaults to influx"
From          ,                 ,            ,trnstart  , datetime-local,   --                   ,                         , "Trained From If file - file begnning"
To            ,                 ,            ,trnend    , datetime-local,   --                   ,                         , "Trained upto If file - file end"
</div>

<div class="col-md-3 draggable">
<legend> Inference Data Details </legend>
Inf           , fa fa-database  ,          , inf1      , text          ,   Connection Info      , localhost:8086/mydb:test  , Inference file
From          ,                 ,          , infstart  , datetime-local,   --                   ,                         , Inferred From If file - file begnning
To            ,                 ,          , infend    , datetime-local,   --                   ,                         , Infered upto If file - file end
</div>

<div class="col-md-3 draggable"><B>Optional </B>
Model         ,                 ,           , model     , text          ,   Model File          ,                         , Model filename
Flags         ,                 ,           , flags     , text          ,   Flag File           ,                         , Flags File
Dict          ,                 ,           , dicts     , text          ,   Dict File           , Dictionary              , telemetry dictionary
</div>

</div>
<hr/>
#              , fas fa-sync     , getFileNames(), analysis_dir, text   ,                       , tseries/ANALYSIS/       , Analysis directory
`
function mkwidget(label, icon='', onclk='', id, type="text", placeholder='', value='', title='', questhelp=false) {
    if ( value.startsWith('"')) { value = value.slice(1,-1) }
    if ( title.startsWith('"')) { title = title.slice(1,-1) }

    var help=`data-toggle="tooltip" title= "${title}" data-html="true" data-container="body"`
    var ques=`<i class="fa fa-question-circle" ${help}></i>`
    if ( !questhelp ) { ques=''; } else { help = '';}
    span_or_a = (onclk) ? "a" : "span"

    var out = `
<div class="input-group mt-8" >
<input id="${id}"  type=${type} class="form-control border-right-0 inputhw"
                placeholder="Connection info" value="${value}">
<${span_or_a} onclick="${onclk}" href=# class="input-group-text spanhw" ${help}>
        ${label} &nbsp; <i class="${icon}"></i>  ${ques}
</${span_or_a}>
</div>
`
    return out;
}

function mkwidgets(w, div){
    var out = ""
    var lines = w.split('\n')
    for (var l in lines) {
        l = lines[l].trim()
        if ( !l || l.startsWith('#'))
            continue;
        if ( l.startsWith("<")){
            out += l +"\n";
            continue;
        }
        var arr = mysplit(l)
        for (var a in arr)
            arr[a] = arr[a].trim()
        //console.log(arr)
        //mkwidget("Hello", "fd", "fa fa-database", 'text', 'Stuff', "Help message");
        out += mkwidget(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], )
    }
    if ( div ) {
        $(div).html(out)
    }
    return out;
}
*/