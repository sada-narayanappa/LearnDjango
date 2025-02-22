// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SPLIT through double quotes on comma
function mysplit(str) {
    var arr = str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return arr;
}
/* ---------------------------------------------------------------------------------
 Utilities should move to common place
--------------------------------------------------------------------------------- */
function rec2Json(ds, i){
    var v = ds.values[i]
    var j = {}
    for (var k=0; k < ds.columns.length; k++){
        j[ds.columns[k]] = v[k]
    }
    return j
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// parseDate
function parseDate(d) {
    if (typeof(d) == "string" && d.startsWith('#'))
        d = $(d).val()

    var ntm = (typeof(d) === "number") ? d : d.replace('T', ' ') + " GMT"
    var ret = new Date( ntm ).getTime()
    return ret
}
/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
function geoui_setupMATHJAX(div){
    if (!$(div)[0]) {
        console.log("Div undefined ...", div)
    }
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
        MathJax.Hub.Queue(["Typeset",MathJax.Hub, $(div)[0]]);
    } else{
        console.log("Mathjax undefined ...")
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
    var lc = $(`*:contains(${ch}):last`).offset()
    var st = lc || 0;
    if ( st) {
        var stt = st.top - window.innerHeight/2
        if ( st.top > window.innerHeight )
            $(window).scrollTop(stt);
    }
    return st
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function geoutils_copyToClipboard(w=null, textToCopy=null) {
    if (!textToCopy) {
        $(w).blur()
        textToCopy = $(w).val() || $(w).text()    
    }
    //console.log("==>", textToCopy)

    // Create a temporary textarea element
    var tempTextArea = $("<textarea>");
    tempTextArea.val(textToCopy).appendTo("body");
    tempTextArea.select();
    document.execCommand("copy");
    tempTextArea.remove();

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
// NOTE this use to be saveTable
function _saveDataTable(tableID = '#tabledd', name = "/tmp/__test__.csv", skipCols=0, skipRows=-1) {
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
    if (  typeof(n) == "string" && !n.startsWith('#') ){
        n = '#' + n
    }
    n = $(n).get(0)
    
    var h = window.innerHeight
    var i = getOffset(n) // {top: 920, left: 0}
    var ht = h - i.top - 15;
    $(n).height( ht )
    //console.log(i, ht)
}  
// ---------------------------------------------------------------------------------
// filename returns the filename 
// Ex: input:  /tmp/hh/Dada.csv
//     output: Dada.csv
//
function filename(str) {
    if ( !str)
        return ''
        
    var base = new String(str).substring(str.lastIndexOf('/') + 1);
   return base;
}

// ---------------------------------------------------------------------------------
// basename returns the filename without extension
// Ex: input:  /tmp/hh/Dada.csv
//     output: Dada

function basename(str) {
    var base = filename(str)
    if(base.lastIndexOf(".") != -1)
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

// ---------------------------------------------------------------------------------
// dirname returns the directory name
// Ex: input:  /tmp/hh/Dada.csv
//     output: /tmp/hh
function dirname(str) {
    if ( !str)
        return ''
        
    var base = new String(str).substring(0, str.lastIndexOf('/') );
    return base;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
countries = ["australia", "austria", "antartica", "argentina", "algeria"];
function geoutils_AutoGetListExample(term, params, url="blah, blah") {
    var term = request.term.trim()  // term is the content
    if ( term.length > 15 || term.length <= 0 )
        return
    u = `${url}${term}`
    $.get(u, function(d){
            try{
                var ret = JSON.parse(d)
                //term = term.endsWith('*') ? term.slice(0, -1) : term;
                //ret.splice(0,0,term)
                ret[ret.length] = term;
                ret = ret.concat(list)
                var ret = countries.filter(function (str) { return str.toLowerCase().indexOf(t) !== -1; });
                response(ret)
            } catch(e){
                console.log(d , e)
            }
        })
}

function geoutils_getACListExample(term, params) {
    let s = new Set(countries);
    countries = [...s]

    // Lets just keep the top 30 elements only
    countries = countries.slice(0, 30);
    var t= term.toLowerCase()
    var ret = countries.filter(function (str) { return str.toLowerCase().indexOf(t) !== -1; });

    return ret
}

_AC_DEF_OPTS={position: "", params: {}, minLength: 0}
function geoutils_Autocomplete(w='#text', list=[], options={}) {

    const opts = {  ..._AC_DEF_OPTS, ...options };
    //console.log("==> AUTOCOMPLETE FOPR: ", $(w))

    $(w).autocomplete({
        autoFocus: true,
        minLength: opts.minLength,
        open: function(event, ui){ 
            var w = $(event.target)
            
            var $results = $(w).autocomplete("widget")
            $results.css("border", "2px solid gray");

            if (opts.position == "top") {
                var top = $results.position().top
                var height = $results.height()
                var inputHeight = $(w).height()
                var newTop = top - height - 25 - inputHeight;
                $results.css("top", newTop + "px");
            }
        },
        source: function(request, response) {  //REST call
            var term = request.term.trim()
            if (typeof list === 'function') {
                response(list(term, opts.params))
            } else {
                response(list)
            }
        },
        select: function (event, item) {
            //console.log("==> Searched for: ",item.item.value)
            $(w).val(item.item.value);
        }
    });
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
