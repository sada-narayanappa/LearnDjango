/*--------------------------------------------------------------------------------
* DO THE SAME AS ABOBE BUT WITH LOCALSTORAGE
--------------------------------------------------------------------------------*/
var ZZvals = null;
function saveZZValues() {
    lret = {
            input:    {},
            textarea: {},
            //select:   {},
            checkbox: {}
    }
    ret = ZZvals || lret

    for (const [k, v] of Object.entries(ret)) {
        var inputs = document.getElementsByTagName(k);

        for (i = 0; i < inputs.length; ++i) {
            id = inputs[i].id
            if ( !id || id == "user_id" || id == "file_id" || id.startsWith("X_") )
                continue;
            id1 = "#" + id;

            if (k == 'input' || k == 'textarea') {
                if ( $(id1).is(':checkbox') )
                    ret['checkbox'][id] = $(id1).is(':checked')
                else
                    ret[k][id] = $(id1).val()
            }
            else{
                ret[k][id] = document.getElementById(id).innerHTML;
            }
        }
    }
    localStorage.setItem('ZZ1', JSON.stringify(ret) );
    ZZvals = ret;
    return ret;
}
//--------------------------------------------------------------------------------
function deleteZZValues() {
    localStorage.removeItem('ZZ1');
}
//--------------------------------------------------------------------------------
function restoreZZValues(dontset) {
    var ret = JSON.parse(localStorage.getItem('ZZ1',""));
    if(!ret) {
        return
    }
    for (const [k, v] of Object.entries(ret)) {
        for (const [k1, v1] of Object.entries(v)) {
            var lg = (`Setting: Type: ${k} ID:${k1} V:${v1}`)

            // console.log(lg)
            if (dontset) {
                console.log("Not: " + lg)
                continue
            }
            //console.log(lg)
            if (k == "checkbox" ) {
                $('#'+k1).prop('checked', v1)
            }
            else if (k == "input" || k == "textarea")
                $('#'+k1).val(v1)
            else // must be select
                $('#'+k1).empty().append(v1);
        }
    }
    ZZvals = ret;
    return ret;
}
/*--------------------------------------------------------------------------------
function saveCookie(cname) {
    id = "#" + cname;
    va = $(id).val() || $(id).text()

    if (va.indexOf('\n') >=0){
        va = va.replace(/\n/g,"--NEWLINE--")
    }
    if (va.indexOf('=') >=0){
        va = va.replace(/=/g,"--EQ--")
    }
    //console.log("COOKIESS ===>", id , va)
    document.cookie = `SZZ_${cname}=${va};path=/;expires=Wed, 19 Oct 2292 01:06:10 GMT`;
    return va;
}
//--------------------------------------------------------------------------------
function saveCookies() {
    var ids = []
    var i
    
    var inputs = document.getElementsByTagName('input');
    for (i = 0; i < inputs.length; ++i) {
        if ( !inputs[i].id || inputs[i].id == "user_id" || inputs[i].id == "file_id")
            continue;
        ids.push(inputs[i].id)
    }
    inputs = document.getElementsByTagName('textarea')
    for (i = 0; i < inputs.length; ++i) {
        if ( !inputs[i].id || inputs[i].id == "user_id" || inputs[i].id == "file_id")
            continue;
        ids.push(inputs[i].id)
    }
    
    var sinputs = document.getElementsByTagName('select');
    for (i = 0; i < sinputs.length; ++i) {
        //if ( !sinputs[i].id || inputs[i].id == "user_id" || inputs[i].id == "file_id")
        //    continue;
        //ids.push(inputs[i].id)
    }
    
    for (i = 0; i < ids.length; ++i) {
        saveCookie(ids[i])
    }
}
//--------------------------------------------------------------------------------
function restoreCookies(dontset){
    var cookies = document.cookie.split(";");
    var ret = {}
    for(var i=0; i < cookies.length; i++) {
        t=cookies[i].trim().split('=');
        va = t[1]
        if ( !t[0].startsWith('SZZ_') ) {
            continue;
        }
        va = va.replace(/--NEWLINE--/g, '\n')
        va = va.replace(/--EQ--/g, '=')
        id = "#" + t[0].substring(4)
        //console.log(id , va)
        ret[id] = va 
        if (!dontset)
            $(id).val(va)
    }
    return ret
}  
//--------------------------------------------------------------------------------
function getCookie_OLD(cname){
    var cookies = document.cookie.split(";");
    rname = 'SZZ_'+cname;
    
    for(var i=0; i < cookies.length; i++) {
        t=cookies[i].trim().split('=');
        va = t[1]
        if ( t[0] !== rname ) {
            continue;
        }
        va = va.replace(/--NEWLINE--/g, '\n')
        va = va.replace(/--EQ--/g, '=')
        //console.log(rname , va)
        return va;
    }
}
    
//--------------------------------------------------------------------------------
function deleteCookies() {
    var cookies = document.cookie.split(";");

    for(var i=0; i < cookies.length; i++) {
        t=cookies[i].trim().split('=');
        id = t[0]
        va = t[1]
        if ( !id.startsWith('SZZ_') ) {
            continue;
        }
        document.cookie = `${t[0]}=${va}; expires=Wed, 19 Oct 1970 01:06:10 GMT`;
    }
}
*/


