function dragElement(element, direction, first1, second1 ) {
    var md;
    const elem   = element;
    const first  = first1  || $(element).prev("div").get(0);
    const second = second1 || $(element).next("div").get(0);

    element.onmousedown = onMouseDown;

    function onMouseDown(e) {
        md = {e,
              offsetLeft:   element.offsetLeft,
              offsetTop:    element.offsetTop,
              firstWidth:   first.offsetWidth,
              secondWidth:  second.offsetWidth,
              firstHeight:  first.offsetHeight,
              secondHeight: second.offsetHeight
             };

        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            //console.log("mouse up");
            document.onmousemove = document.onmouseup = null;
        };
    }
    function onMouseMove(e) {
        //console.log("mouse move: " + e.clientX);
        var delta = {x: e.clientX - md.e.clientX,
                     y: e.clientY - md.e.clientY};

        if (direction === "H" ) { // Horizontal
            // Prevent negative-sized elements
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = (md.firstWidth + delta.x) + "px";
            second.style.width = (md.secondWidth - delta.x) + "px";
        } else {
            delta.y = Math.min(Math.max(delta.y, -md.firstHeight), md.secondHeight);

            element.style.bottom  = md.offsetTop   + delta.y + "px";
            first.style.height  = (md.firstHeight  + delta.y) + "px";
            second.style.height = (md.secondHeight - delta.y) + "px";

        }
    }
    return this;
}

function splitter1_document_ready(){
    //dragElement(document.getElementById("separator1"), "H");
    var x = document.getElementsByClassName("separatorH");
    for (var i = 0; i < x.length; i++) {
        dragElement(x[i], "H");
    }

    x = document.getElementsByClassName("separatorV");
    for ( i = 0; i < x.length; i++) {
        dragElement(x[i], "V");
    }
}

$(document).ready(function() {
    splitter1_document_ready();
});