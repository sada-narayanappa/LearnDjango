/*
To use this cut and paste the following code

SIMPLEST VERSION:

    <form id="fileupload" method="post" enctype="multipart/form-data" style="display: contents">
        {% csrf_token %}
        <input id="savein"  name="savein" id="savein" value="/opt/data/models/{{user.username}}/" >
        <div id="file_drop">
            <input id="file_id" name=file type="file" onchange="handleFileSelect(this.id)" accept="*">
        </div>
        <button type="button"  onclick="handleUploadClick()">Upload</button>
    </form>


SIMPLE VERSION:

    <form id="fileupload" method="post" enctype="multipart/form-data" style="display: contents">
        {% csrf_token %}
        <input id="savein"  name="savein" id="savein" value="/opt/data/models/{{user.username}}/"  required>
        <div id="file_drop">
        <input class="form-control border-right-0 inputhw" id="file_id" name=file type="file" onchange="handleFileSelect(this.id)"
                accept="*">
        </div>
        <button type="button"  onclick="handleUploadClick()" class="btn btn-success"><i class="fa fa-upload"></i>Upload</button>
    </form>


FULL VERSION:

<form id="fileupload" method="post" enctype="multipart/form-data" style="display: contents; padding: 10px;" >
    <div   id="file_drop" class="drag_leave" >
    {% csrf_token %}
    <input id="user_id" type="hidden" value="{{user.get_username}}">
    <input id="file_id" name=file type="file" onchange="handleFileSelect(this.id, 1,'#X_file_list', '#X_preview' )"
                    multiple="multiple" accept="*">
        <br/><br/><br/>
        <h6>&nbsp;&nbsp;&nbsp;Files List</h6>
        <div id="X_file_list" style="min-width: 50%; padding: 20px;">
        </div>
        <br/>
        <div class="input-group">
            <span class="input-group-text" style="width:100px;"> Files will be uploaded to: </span>
            <input class="form-control inputhw" id="savein"  name="savein" id="savein" value="/opt/data/tseries/{{user.username}}/"
                                required>
        </div>
        <div class="input-group">
            <button type="button"   class="form-control btn btn-lg btn-success" onclick="handleUploadClick()">
                            <i class="fa fa-upload"></i>Upload</button>
        </div>
    </div>
</form>
<hr/>
<div id="X_preview" style="padding: 10px;overflow-wrap: anywhere;"></div>

<!-- configure these parameters as you need it: -->

var DD_MAX_FILES     = 3;
var DD_MAX_FILE_SIZE = 50*1024*1024;

*/
var DD_MAX_FILES     = 3;
var DD_MAX_FILE_SIZE = 250*1024*1024;

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
    
    clName = (evt.type == "dragover" ? "drag_hover" : "drag_leave");
    document.getElementById("file_drop").className = clName;
}

function handleFileDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    //evt.target.className = ("drag_leave");
    document.getElementById("file_drop").className = "drag_leave";

    var files1 = evt.dataTransfer.files;  // FileList object.
    if (files1.length > DD_MAX_FILES) {
        alert(`Max files you can upload are: ${DD_MAX_FILES}!!! `);
        return;
    }
    for (var i=0; i<files1.length; i++) {
        var file = files1[i];
        if ( file.size > DD_MAX_FILE_SIZE) {
            alert(`File size exceeded: ${file.name} ${file.size} => Max is: ${DD_MAX_FILE_SIZE}!!! `);
            return;
        }
        fstr = "File: " + file.name + ", type: " + file.type + ", size: " + file.size;
    }

    if (files1.length == 0) {
        console.log("No files found ... cut and pasted?!!");
        return;
    }
    //ret = readFile(files1)
    ret = 1;
    file_id = document.getElementById("file_id");
    if(ret && file_id ) {
        file_id.files = files1;
        file_id.onchange();
    } else {
        if (file_id)
            document.getElementById("file_id").value = '';
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
 * This assumes you have a service working
 */
function handleUploadClickCB(responseTxt, statusTxt, xhr) {
    salert("Upload status: " +statusTxt + " : " + responseTxt)
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function handleUploadClick(url) {
    url = url || '/api1/uploadfile/';
    var file_id = document.getElementById("file_id");
    if ( file_id.files.length <= 0) {
        salert("No Files Selected!!", 'btn-danger');
        return;
    }
    var formData = new FormData($('form#fileupload')[0]);
    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        success: function(response) {
            salert("Uploaded!! " + response, "btn-success", 2000);
        },
        error: function(response) {
            salert("Error!!!" + response.responseText, "btn-error");
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function handleFileSelect(id, displayTable = 0, filelistdiv=null, previewDIV=''){
    if (!filelistdiv)
        return;

    var file_id = document.getElementById(id);
    var files = file_id.files;
    var lst = `<table class="table " style="wwidth:100%; background-color: #fafafa; " cellpadding="10px">
            <tr><th>Name</th> <th>Type</th><th>Size</th><th> </th><tr>
          `
    for (var i=0; i<files.length; i++) {
        var file = files[i];
        msg = `<a href=# onclick='handlePreviewFile( ${i}, "${previewDIV}" )'> Preview </a>`;
        if (!previewDIV)
            msg = "";

        if ( file.size > DD_MAX_FILE_SIZE) {
            msg = "ERROR: size too big";
        }
        lstr = `<tr><td>${file.name}</td><td>${file.type}</td><td>${file.size}</td><td>${msg}</td></tr>\n`
        lst += lstr;
        //console.log(lstr)
    }
    lst += "</table>";

    //$('#X_file_list').html(lst)
    $(filelistdiv).html(lst);

    handlePreviewFile(0, previewDIV);
}

$(document).ready(function() {
    var file_drop = document.getElementById('file_drop');

    if(file_drop) {
        file_drop.addEventListener('dragover', handleDragOver, false );
        file_drop.addEventListener("dragleave", handleDragOver, false);
        file_drop.addEventListener("drop", handleFileDrop, false);
    }    
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Preview File
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Assuming CSV file
function makeDataFrame(mdata) {
    var nLines = mdata.split('\n');
    var ds = {};
    var gotColumns = 0;
    var i, line;
    for (i=0; i < nLines.length; i++) {
        line = nLines[i];
        if ( !line.trim() || line.startsWith('#'))
            continue;
        ds.columns = nLines[i].split(',');
        break;
    }
    ds.values= [];
    for ( i++;i < nLines.length; i++) {
        line = nLines[i];
        if ( !line.trim() || line.startsWith('#'))
            continue;
        ds.values[ds.values.length] = nLines[i].split(',');
    }
    return ds;
}
function getCSVFromTextFile(file, callback) {
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(e) {
        var ds = makeDataFrame(e.target.result);
        callback(ds);
    };
}

function drawTableCSV(mdata) {
    var nLines = mdata.split('\n');
    var cols = nLines[0].split(',');

    var tab = `Summary: ${nLines.length} x ${cols.length} <br/><table width=100% border=1>\n`;

    var tr ="<tr>";
    var ds = nLines[0].split(",");
    for (var i in ds){
        tr += `<th nowrap> ${ds[i]}</th>`;
    }
    tr += "</tr>";
    tab += tr;

    for (i=1; i < nLines.length; i++){
        ds = nLines[i].split(",");
        tr = "<tr>";
        for (var d in ds){
            tr += `<td nowrap contenteditable> ${ds[d]}</td>`;
        }
        tab += tr;
        if ( i > 10 )
            break;
    }
    tab += "</table>";
   return tab;
}

function previewTextFile(file, results) {
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(e) {
        if ( file.name.endsWith(".csv")) {
            var out = drawTableCSV(e.target.result);
            $(results).html(`${file.name} </br>${out}`);
        }
        else if ( file.name.endsWith(".html")) {
            $(results).text(`${e.target.result}`);
        }
        else {
            $(results).html(`<pre><![CDATA[\n${e.target.result}\n]]</pre>`);
        }
    };
}
function previewImageFile(file, results) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        $(results).html(`<p><img width=256 src='${e.target.result}'/></p>`);
    };
}
function previewBinaryFile(file, results) {
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(e) {
        var res = btoa(e.target.result);
        $(results).html(res.slice(0, 128));
    };
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function handlePreviewFile(i, resultsDIV){
    if ( !resultsDIV)
        return;

    var file = document.getElementById("file_id").files[i];
    if (file.type.indexOf("image") >= 0 )
        previewImageFile(file, resultsDIV);
    else if (file.type.indexOf("text") >= 0 )
        previewTextFile(file, resultsDIV);
    else
        previewBinaryFile(file, resultsDIV);
}

/***
file_drop.addEventListener("paste", handlePaste);
function handlePaste(e){
    for (var i = 0 ; i < e.clipboardData.items.length ; i++) {
        var item = e.clipboardData.items[i];
        if (1 || item.type.indexOf("image") > -1) {
            files = [item.getAsFile()]
            //readFile(files)
            console.log("Item: ", item.type, files);
            document.getElementById("file_id").files = e.clipboardData.files;
        }
    }
}
***/