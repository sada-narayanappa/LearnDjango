/*--------------------------------------------------------------------------------
This will get all the inputs and textareas and save them in local storage
--------------------------------------------------------------------------------*/
let callws_ignore = ["X_","share_copy", "button", "submit", "reset", "image", "password"]

// CHECK IF THIS IS CORRECT
function callws_setfiles(k) {
    for (let i = 0; i < k.files.length; i++) {
        formData.append("file", k.files[i])
    }
}
function callws_getvalue(k) {
    var v = k.value;
    if (k.type == "radio"){
        v = document.querySelector(`input[name="${k.name}"]:checked`).value
    } 
    else if (k.type == "file"){
        if ( k.name)
            v = null;
        else{
            // figure a way to add files to formdata
            console.log("File: ", k.files)
        }
    }
    else if (k.type == "checkbox"){
        v = k.checked ? 1 : 0;
    }
    //console.log(`${k.type} => ${k.id} tag: ${k.tagName}, val: ${v}`)
    return v
}

function callws_getIDs(formName="", ignore = callws_ignore) {
    var ips = $( ":input" );
    if (formName) {
        ips = $( `form#${formName} :input` )
    }
    ret = {}
    for (i = 0; i < ips.length; ++i) {
        var k = ips[i]
        if (k.type == "radio" && !k.name)
            continue;
        if ( !k.id ||  k.id in ignore || k.type in ignore  || k.id.startsWith("X_") )
            continue;

        var v = callws_getvalue(k)
        if (v)
            ret[k.name || k.id] = v;
    }
    return ret;
}
//--------------------------------------------------------------------------------*/
function dumpformdata(formData) {
    count =0 
    for (var p of formData.entries()) {
        if (p[0].startsWith("X_") || p[0].startsWith("csrf") || p[0].startsWith("auth"))
            continue;
        console.log(count, p[0],  ': =>' + p[1]);
        count += 1        
    } 
    //console.log(': =>', count," entries found");
}
/*--------------------------------------------------------------------------------
This will get Formdata
--------------------------------------------------------------------------------*/
function callws_getform(formName="" , context={}, getIDS=true) {
    var formObj = null
    var formData= null
    if (formName) {
        formObj = $('form#' + formName)
        if (formObj[0].checkValidity() == false) {
            console.log(`${formName} Validation failed: `)
            formObj[0].reportValidity()
            return null
        }
        formData = new FormData(formObj[0]);
    }
    if ( !formData) {
        formData = new FormData();
    }
    for (var k in context) {
        formData.append(k, context[k]);
    }

    // get all elements with out name attribute and add them to formdata
    if (getIDS) {
        var vals = callws_getIDs(formName)
        for (k in vals) {
            if ( !formData.get(k))
                formData.append(k, vals[k]);
        }
    }

    // Add standard params
    params =  GET_POSTDATA({})
    for(var k in params) {
        formData.append(k, params[k]);
    }

    fd = formData
    return formData;
}
/*--------------------------------------------------------------------------------
This will call WS service
--------------------------------------------------------------------------------*/
var callws_default_opts= {
    getIDS: false,
}

if (typeof busy !== 'function') { // if no one defined busy or nbusy - we make it empty
    busy = function() {
    }
    nbusy = function() {
    }
}

async function callws(  url="/ui/test/", formName="", callbacks=null, context={}, 
                        opts=callws_default_opts) {
    var start    = new Date()
    var getIDS   = false

    if ( Object.keys(opts).length > 0) {
        if (opts["url"])        url        = opts["url"]
        if (opts["formName"])   formName   = opts["formName"]
        if (opts["callbacks"])  callbacks  = opts["callbacks"]
        if (opts["context"])    context    = opts["context"]
        if (opts["getIDS"])     getIDS     = opts["getIDS"]
    }

    var formData = callws_getform(formName, context, getIDS)
    if (!formData)
        return;

    busy() // defined in common.html - should move it here
    dumpformdata(formData)
    var data = "?"
    var RESPONSE=null

    let response=fetch(url, {
        method: "post",
        body: formData,
        headers: { "X-CSRFToken": '{{csrf_token }}' },
    })
    .then(response =>  RESPONSE=response)
    .then(response =>  response.text())
    .then(resp => {
        data = resp

        if ( RESPONSE.status != 200) {
            console.log("ERROR: " + data)
            JS_error( "" + RESPONSE.status + " Check logs", "error", null, true)
        } else {
            if (JS_error( data, "success", null, true)) {
                console.log("ERROR: " + data)
            }
        }
    })
    .catch(error => {
        console.log("ERROR; " , error)
        JS_error("Error: " + error, "error", null, true)
    }).finally( function() {
        nbusy()
        if ( RESPONSE.status == 200 ) {
            if (callbacks) {
                if ( Array.isArray(callbacks) )
                    for (var cb in callbacks)
                        callbacks[cb](data, null, null, context, formData);
                else
                    callbacks(data, null, null, context, formData)
            }

            var now = new Date()
            var elp = now.valueOf() - start.valueOf()
            var t1  = start.toTimeString().slice(0,8)
            var t2  = now.toTimeString().slice(0,8)
            var log =  url+ " =>:" + t1 + " - " + t2 + " : " + elp/1000 + " ms; =>" + data.slice(0,48) + "..."
            console.log( log )
        }

    });
}
