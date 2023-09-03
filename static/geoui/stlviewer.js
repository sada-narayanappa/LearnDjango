var mesh, scene, camera, renderer
var mousex, mousey, mousez, dotid=0, largestDimension
var SENSOR_LIST = ["Thermometer", "GIS", "Current"]



// API FUNCTIONS


/**
 * Uploads STL file and displays it on webpage.
 * LIMITATION: Can only handle one STL file at a time. Need to refresh page between uploads.
 * 
 * @param {String} srcfile The path to the STL file
 */
function uploadSTL(srcfile = document.getElementById("stl_file").value) {
    document.getElementById("stlviewer").setAttribute("data-src", srcfile);

    // Removes original STL file scene
    div = document.getElementById("stlviewer");
    div.removeChild(div.firstChild);
    pts = document.getElementById("pointscoor");
    while (pts.hasChildNodes()) {
        pts.removeChild(pts.firstChild);
    }
    pts.innerHTML = "Points:";

    STLViewerEnable("stlviewer");
}


/**
 * Lists current points.
 * 
 * @returns array of points with each point as a dictionary {x, y, z, color, sensor}
 */
function getPoints() {
    dots = []
    scene.traverse((obj) => {
        if (obj.type == 'Points') {
            color = obj.material.color.getHexString();
            sensor = obj.parent.name;
            pt = obj.geometry.vertices[0];
            dots.push({"x":pt.getComponent(0), "y":pt.getComponent(1), "z":pt.getComponent(2), "color":color, "sensor":sensor});
        }
    });
    return dots;
}


/**
 * Lists sensors.
 * 
 * @returns array of sensors with each sensor name as a String
 */
function getSensorList() {
    return SENSOR_LIST;
}


/**
 * Creates a new sensor type.
 * 
 * @param {String} sensor The sensor type to be added.
 */
function addSensorList(sensor) {
    SENSOR_LIST.push(sensor);
    
    // Adds to Dropdown
    const opt = document.createElement("option");
    opt.innerHTML = sensor;
    opt.value = sensor;
    document.getElementById("sensor_type").appendChild(opt);

    // Creates Toggle Button
    const btn = document.createElement("button");
    btn.innerHTML = sensor;
    btn.type = "button";
    btn.name = "toggle_" + sensor;
    btn.id = btn.name;
    btn.style.background = "lightblue";
    btn.onclick = function () {
        sens = btn.name.split("_").pop();
        toggleSensor(sens);
    }
    document.getElementById("togglesensors").appendChild(btn);

    // Creates Group Object
    const group = new THREE.Group();
    group.name = sensor;
    scene.add(group);
}


/**
 * Maps x, y, z location with color and groups point under sensor group.
 * 
 * @param {int} x 
 *      If not specified when called, assumed to use x input text box from webpage
 * @param {int} y 
 *      If not specified when called, assumed to use y input text box from webpage
 * @param {int} z 
 *      If not specified when called, assumed to use z input text box from webpage
 * @param {String} color The color -- can be name of color or hex value
 *      If not specified when called, assumed to use color input text box from webpage popup
 * @param {String} sensor The sensor type -- must be in SENSOR_LIST
 *      If not specified when called, assumed to use sensor type input text box from webpage popup
 */
function mapXYZ(x = parseInt(document.getElementById("x").value), y = parseInt(document.getElementById("y").value), 
                z = parseInt(document.getElementById("z").value), color = document.getElementById("color_hex").value, 
                sensor = document.getElementById("sensor_type").value) {
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        throw new Error("ERROR: Missing value for x, y, or z");
    }
    else if (SENSOR_LIST.includes(sensor)) {
        mapPoint(x, y, z, color, sensor);
    }
    else {
        throw new Error("ERROR: Invalid sensor");
    }
}


/**
 * Zooms to x, y, z location.
 * 
 * @param {int} x 
 *      If not specified when called, assumed to use x input text box from webpage
 * @param {int} y 
 *      If not specified when called, assumed to use y input text box from webpage
 * @param {int} z 
 *      If not specified when called, assumed to use z input text box from webpage
 */
function zoomXYZ(x = parseInt(document.getElementById("x").value), y = parseInt(document.getElementById("y").value),
                z = parseInt(document.getElementById("z").value)) {
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        throw new Error("ERROR: Missing value for x, y, or z");
    }
    else {
        camera.position.set(x+1, y+1, z+1);
        camera.lookAt(x, y, z);
        camera.updateProjectionMatrix();
    }
}


/**
 * Edits x,y,z of a point.
 * 
 * @param {int} oldx X-coordinate of current point to modify
 * @param {int} oldy Y-coordinate of current point to modify
 * @param {int} oldz Z-coordinate of current point to modify
 * @param {int} newx New X-coordinate
 * @param {int} newy New Y-coordinate
 * @param {int} newz New Z-coordinate
 */
function editXYZ(oldx, oldy, oldz, newx, newy, newz) {
    closeEditPopup();
    dot = undefined;
    // Checks if dot object has been passed in
    if (typeof oldx == 'object') {
        dot = oldx;
    }
    else if (oldx == undefined || oldy == undefined || oldz == undefined || newx == undefined || newy == undefined || newz == undefined) {
        throw new Error("ERROR: All parameters not specified. Need: oldx, oldy, oldz, newx, newy, newz.");
    }
    else {
        // Searches for dot object that matches given (x,y,z)
        scene.traverse((obj) => {
            if (obj.type == 'Points') {
                pt = obj.geometry.vertices[0];
                if (pt.getComponent(0) == oldx && pt.getComponent(1) == oldy && pt.getComponent(2) == oldz) {
                    dot = obj;
                }
            }
        });
        if (dot == undefined) {
            throw new Error("ERROR: Point does not exist.");
        }
    }

    // Change Info Listing
    pt_name = "pt".concat(dot.name.split("dot").pop());
    pt = document.getElementById(pt_name);
    pt.childNodes[0].nodeValue = "(" + newx + ", " + newy + ", " + newz + ") ";

    // Change Actual Dot on STL
    dot.geometry.vertices[0].set(newx,newy,newz);
    dot.geometry.verticesNeedUpdate = true;
}


/**
 * Deletes point.
 * 
 * @param {int} x X-coordinate of point to delete
 * @param {int} y Y-coordinate of point to delete
 * @param {int} z Z-coordinate of point to delete
 */
function deleteXYZ(x, y, z) {
    dot = undefined;
    // Checks if dot object has been passed in
    if (typeof x == 'string') {
        dot = scene.getObjectByName(x);
    }
    else if (x == undefined || y == undefined || z == undefined) {
        throw new Error("ERROR: Coordinates of point to change not specified. Need: x, y, z.");
    }
    else {
        // Searches for dot object that matches given (x,y,z)
        scene.traverse((obj) => {
            if (obj.type == 'Points') {
                pt = obj.geometry.vertices[0];
                if (pt.getComponent(0) == x && pt.getComponent(1) == y && pt.getComponent(2) == z) {
                    dot = obj;
                }
            }
        });
        if (dot == undefined) {
            throw new Error("ERROR: Point does not exist.");
        }
    }
    pt_name = "pt".concat(dot.name.split("dot").pop());
    dot.parent.remove(dot);
    document.getElementById(pt_name).remove();
}


/**
 * Changes color of given point.
 * 
 * @param {int} x X-coordinate of point
 * @param {int} y Y-coordinate of point
 * @param {int} z Z-coordinate of point
 * @param {Color Hex or String} newcolor New color
 */
function editColor(x, y, z, newcolor) {
    if (newcolor == undefined) {
        throw new Error("ERROR: New color not specified. Ex: '#00FFFF' or 'green' ");
    }
    // Checks if dot object has been passed in
    if (typeof x == 'object') {
        oldcolor = x.material.color.getHexString();
        x.material.color.set(newcolor);
        return oldcolor;
    }
    else if (x == undefined || y == undefined || z == undefined) {
        throw new Error("ERROR: Coordinates of point to change not specified. Need: x, y, z.");
    }
    else {
        // Searches for dot object that matches given (x,y,z)
        scene.traverse((obj) => {
            if (obj.type == 'Points') {
                pt = obj.geometry.vertices[0];
                if (pt.getComponent(0) == x && pt.getComponent(1) == y && pt.getComponent(2) == z) {
                    oldcolor = obj.material.color.getHexString();
                    obj.material.color.set(newcolor);
                    return oldcolor;
                }
            }
        });
    }
}


function editSensor(x, y, z, newsensor) {
    if (newsensor == undefined || !SENSOR_LIST.includes(newsensor)) {
        throw new Error("ERROR: Sensor not a valid sensor type. Use getSensorList() to see available sensor types.");
    }
    // Checks if dot object has been passed in
    if (typeof x == 'object') {
        parent = x.parent.name;
        scene.getObjectByName(newsensor).add(x.clone());
        scene.getObjectByName(parent).remove(x);
    }
    else if (x == undefined || y == undefined || z == undefined) {
        throw new Error("ERROR: Coordinates of point to change not specified. Need: x, y, z.");
    }
    else {
        // Searches for dot object that matches given (x,y,z)
        scene.traverse((obj) => {
            if (obj.type == 'Points') {
                pt = obj.geometry.vertices[0];
                if (pt.getComponent(0) == x && pt.getComponent(1) == y && pt.getComponent(2) == z) {
                    parent = obj.parent.name;
                    scene.getObjectByName(newsensor).add(obj.clone());
                    scene.getObjectByName(parent).remove(obj);
                }
            }
        });
    }
}


/**
 * Maps location of mouse and then zooms to it.
 */
function mapMouse(color = "#AC94F4", sensor = "Thermometer") {
    x = parseInt(document.getElementById("mouse_x").value);
    y = parseInt(document.getElementById("mouse_y").value);
    z = parseInt(document.getElementById("mouse_z").value);
    mapPoint(x, y, z, color, sensor);
}


/**
 * Zooms to location of mouse.
 */
function zoomMouse() {
    x = parseInt(document.getElementById("mouse_x").value);
    y = parseInt(document.getElementById("mouse_y").value);
    z = parseInt(document.getElementById("mouse_z").value);
    camera.position.set(x+1, y+1, z+1);
    camera.lookAt(x, y, z);
    camera.updateProjectionMatrix();
}


/**
 * Creates 3D grid with specified step size.
 * 
 * @param {int} step_size Interval size / Distance between grid marks
 *      If not specified when called, assumed to use step size input text box from webpage
 */
function createGrid(step_size = parseInt(document.getElementById("step_size").value)) {
    scene.remove(scene.getObjectByName("Grid"));
    create3DGrid(step_size);
}


/**
 * When a sensor is toggled, all of the points grouped under it are made hidden/visible.
 * 
 * @param {String} sensor The sensor type -- must be in SENSOR_LIST
 */
function toggleSensor(sensor) {
    if (SENSOR_LIST.includes(sensor)) {
        chil = scene.getObjectByName(sensor).children;
        btn = document.getElementById("toggle_" + sensor);
        if (btn.style.background == "lightblue") {
            // Turn off -- make sensor type disappear
            btn.style.background = "lightgray";
            for (var j=0; j<chil.length; j++) {
                chil[j].visible = false;
            }
        }
        else {
            // Turn on -- make sensor type appear
            btn.style.background = "lightblue";
            for (var j=0; j<chil.length; j++) {
                chil[j].visible = true;
            }
        }
    }
    else {
        throw new Error("ERROR: Invalid sensor");
    }
}


/**
 * When the axes object is toggled, it is made hidden/visible.
 */
function toggleAxes() {
    scene.getObjectByName("Axes").visible = !scene.getObjectByName("Axes").visible;
}


/**
 * When the bounding box is toggled, it is made hidden/visible.
 */
function toggleBbox() {
    scene.getObjectByName("Bbox").visible = !scene.getObjectByName("Bbox").visible;
}


/**
 * When the grid is toggled, it is made hidden/visible.
 */
function toggleGrid() {
    scene.getObjectByName("Grid").visible = !scene.getObjectByName("Grid").visible;
}


/**
 * Creates and returns the bounding box.
 */
function getbbox(){
    bbox = new THREE.Box3().setFromObject(mesh);
    return bbox;    
}



// SUPPORTING & WEBPAGE FUNCTIONS


document.addEventListener("mousemove", mousexyz);
document.addEventListener("keyup", shortcuts);


function shortcuts(event) {
    inputTags = ['INPUT', 'TEXTAREA'];
    if (event.code === 'KeyC' && !inputTags.includes(event.target.tagName)) {
        document.getElementById("mouse_x").value = mousex;
        document.getElementById("mouse_y").value = mousey;
        document.getElementById("mouse_z").value = mousez;
    }
    else if (event.code === 'KeyM' && !inputTags.includes(event.target.tagName)) {
        document.getElementById("mouse_x").value = mousex;
        document.getElementById("mouse_y").value = mousey;
        document.getElementById("mouse_z").value = mousez;
        mapMouse();
        zoomMouse();
    }
    else if (event.code === 'KeyZ' && !inputTags.includes(event.target.tagName)) {
        document.getElementById("mouse_x").value = mousex;
        document.getElementById("mouse_y").value = mousey;
        document.getElementById("mouse_z").value = mousez;
        zoomMouse();
    }
}


function xyView() {
    camera.position.set(0, 0, largestDimension);
    camera.updateProjectionMatrix();
}


function xzView() {
    camera.position.set(0, largestDimension, 0);
    camera.updateProjectionMatrix();
}


function yzView() {
    camera.position.set(largestDimension, 0, 0);
    camera.updateProjectionMatrix();
}


function openPopup() {
  document.getElementById("dotPopup").style.display = "block";
}


function closePopup() {
  document.getElementById("dotPopup").style.display = "none";
}


function openEditPopup(dotname) {
    dot = scene.getObjectByName(dotname);
    document.getElementById("edit_pt_confirm").onclick = function () {
        // Passes in dot object since we already know it and don't need to search for it
        editXYZ(dot, undefined, undefined, parseInt(document.getElementById("new_x").value), parseInt(document.getElementById("new_y").value),
                parseInt(document.getElementById("new_z").value));
                
        editColor(dot, undefined, undefined, document.getElementById("new_color").value);

        newsensor = document.getElementById("new_sensor").value;
        if (dot.parent.name != newsensor) {
            editSensor(dot, undefined, undefined, newsensor);
        }
    };
    vert = dot.geometry.vertices[0]
    document.getElementById("new_x").value = vert.x;
    document.getElementById("new_y").value = vert.y;
    document.getElementById("new_z").value = vert.z;
    document.getElementById("new_color").value = "#".concat(dot.material.color.getHexString());
    document.getElementById("new_sensor").value = dot.parent.name;
    document.getElementById("editPopup").style.display = "block";
}


function closeEditPopup() {
    document.getElementById("editPopup").style.display = "none";
}


/**
 * General map point function. Called by mapXYZ and mapMouse.
 * Creates and maps point on STL with correct color. Adds it to correct sensor group.
 * Adds it to list of points in info box. Adds delete, edit, and flash capabilities.
 */
function mapPoint(x, y, z, color, sensor) {
    closePopup();

    scene.traverse((obj) => {
        if (obj.type == 'Points') {
            pt = obj.geometry.vertices[0];
            if (pt.getComponent(0) == x && pt.getComponent(1) == y && pt.getComponent(2) == z) {
                throw new Error("ERROR: There is already something at this location. Delete or Edit it first.");
            }
        }
    });

    console.log("xyz: ", x, " ", y, " ", z, " color: ", color, " sensor type: ", sensor);

    // Add to INFO points list
    pt = document.createElement("p");
    pt.innerHTML = "(" + x + ", " + y + ", " + z + ") ";
    pt.name = "pt" + dotid;
    pt.id = pt.name;

    // Create dot on graphic
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(x,y,z));
    var material = new THREE.PointsMaterial({size:15, sizeAttenuation:false});
    material.color.set(color);
    var dot = new THREE.Points(geometry, material);
    dot.name = "dot" + dotid;

    // Create delete button
    const btn = document.createElement("button");
    btn.innerHTML = "Delete";
    btn.type = "button";
    btn.name = "del_dot" + dotid;
    btn.id = btn.name;
    btn.onclick = function () {
        deleteXYZ(dot.name, undefined, undefined);
    };

    // Create edit button
    const btn2 = document.createElement("button");
    btn2.innerHTML = "Edit";
    btn2.type = "button";
    btn2.name = "edit_dot" + dotid;
    btn2.id = btn2.name;
    btn2.onclick = function () {
        openEditPopup(dot.name);
    }

    // Create flash on hover over info
    var myVar;
    var flash = function () {
      dot.material.opacity = (dot.material.opacity == 1 ? 0 : 1);
    };
    pt.addEventListener("mouseenter", function () {
      if (!myVar) {
        myVar = setInterval(flash, 250);
      }
      flash();
    });
    pt.addEventListener("mouseleave", function () {
      clearInterval(myVar);
      myVar = null;
      dot.material.opacity = 1;
    });

    pt.appendChild(btn2);
    pt.appendChild(btn);
    document.getElementById("pointscoor").appendChild(pt);
    
    scene.getObjectByName(sensor).add(dot);
    dotid+=1
    return dot;
}


function createAxes(axis_size) {
    var axesHelper = new THREE.AxesHelper( axis_size );
    axesHelper.name = "Axes";
    scene.add( axesHelper );
}


function mousexyz(event) {
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    vec.set(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5 );

    vec.unproject( camera );

    mousex = vec.x.toFixed(3);
    mousey = vec.y.toFixed(3);
    mousez = vec.z.toFixed(3);

    document.getElementById("mousepos").innerHTML = "Current Position:"
            + "\n\t x: " + mousex
            + "\n\t y: " + mousey
            + "\n\t z: " + mousez;

    vec.sub( camera.position ).normalize();

    var distance = - camera.position.z / vec.z;

    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );  
}


function createSensorDropDown() {
    for (var i=0; i<SENSOR_LIST.length; i++) {
        // Creates Groups
        const group = new THREE.Group();
        group.name = SENSOR_LIST[i];
        scene.add(group);

        // Adds to Dropdown
        const opt = document.createElement("option");
        opt.innerHTML = SENSOR_LIST[i];
        opt.value = SENSOR_LIST[i];
        document.getElementById("sensor_type").appendChild(opt);

        // Creates Toggle Button
        const btn = document.createElement("button");
        btn.innerHTML = SENSOR_LIST[i];
        btn.type = "button";
        btn.name = "toggle_" + SENSOR_LIST[i];
        btn.id = btn.name;
        btn.style.background = "lightblue";
        btn.onclick = function () {
            sens = btn.name.split("_").pop();
            toggleSensor(sens);
        }
        document.getElementById("togglesensors").appendChild(btn);

    }
}


function create3DGrid(step_size=1) {
    bbox = getbbox();
    grid_size = Math.max(bbox.max.x-bbox.min.x, bbox.max.y-bbox.min.y, bbox.max.z-bbox.min.z);
    var group = new THREE.Group();
    group.name = "Grid";

    opacity = 0.5

    for (i=0; i<grid_size/2; i+=step_size) {
        grid2D = new THREE.GridHelper(grid_size, grid_size/step_size);
        grid2D.position.y = i;
        grid2D.material.transparent = true;
        grid2D.material.opacity = opacity;
        group.add(grid2D);
        grid2D = new THREE.GridHelper(grid_size, grid_size/step_size);
        grid2D.position.y = -i;
        grid2D.material.transparent = true;
        grid2D.material.opacity = opacity;
        group.add(grid2D);

        grid2D = new THREE.GridHelper(grid_size, grid_size/step_size);
        grid2D.rotation.x=Math.PI/2;
        grid2D.position.z = i;
        grid2D.material.transparent = true;
        grid2D.material.opacity = opacity;
        group.add(grid2D);
        grid2D = new THREE.GridHelper(grid_size, grid_size/step_size);
        grid2D.rotation.x=Math.PI/2;
        grid2D.position.z = -i;
        grid2D.material.transparent = true;
        grid2D.material.opacity = opacity;
        group.add(grid2D);

        if (i==0) {
          opacity = 0.1
        }
    }

    scene.add( group );
}


function STLViewerEnable(classname, firstLoad = false) {
    var models = document.getElementsByClassName(classname);
    for (var i = 0; i < models.length; i++) {
        STLViewer(models[i], models[i].getAttribute("data-src"), firstLoad);
    }
}


function STLViewer(elem, model, firstLoad) {

    if (!WEBGL.isWebGLAvailable()) {
        elem.appendChild(WEBGL.getWebGLErrorMessage());
        return;
    }

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    camera = new THREE.PerspectiveCamera(70, elem.clientWidth / elem.clientHeight, 1, 1000);
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.appendChild(renderer.domElement);

    window.addEventListener('resize', function () {
        renderer.setSize(elem.clientWidth, elem.clientHeight);
        camera.aspect = elem.clientWidth / elem.clientHeight;
        camera.updateProjectionMatrix();
    }, false);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.05;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = .75;

    scene = new THREE.Scene();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x080820, 1.5));

    (new THREE.STLLoader()).load(model, function (geometry) {
        var material = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 100, shininess: 100, wireframe: true });
        mesh = new THREE.Mesh(geometry, material);
        // mesh.name("stl_object");
        scene.add(mesh);

        // Compute the middle
        var middle = new THREE.Vector3();
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(middle);

        // Center it
        mesh.position.x = -1 * middle.x;
        mesh.position.y = -1 * middle.y;
        mesh.position.z = -1 * middle.z;
        console.log("Mesh:");
        console.log(mesh);

        // Display Bounding Box
        var bbox = new THREE.BoxHelper(mesh, 0x000000); 
        bbox.name = "Bbox";
        bbox.update();
        console.log(bbox);
        scene.add(bbox);

        // Add Bounding Box Dimensions to Info Box
        document.getElementById("boundingbox").innerHTML = "Bounding Box Dimensions:" + 
            "\n\t total x: " + (geometry.boundingBox.max.x-geometry.boundingBox.min.x).toFixed(3) +
            "\n\t total y: " + (geometry.boundingBox.max.y-geometry.boundingBox.min.y).toFixed(3) + 
            "\n\t total z: " + (geometry.boundingBox.max.z-geometry.boundingBox.min.z).toFixed(3);

        // Pull the camera away as needed
        largestDimension = Math.max(geometry.boundingBox.max.x,
            geometry.boundingBox.max.y, geometry.boundingBox.max.z)
        camera.position.z = largestDimension * 1.5;

        // Create Axes
        createAxes(largestDimension);

        if (firstLoad) {
            // Create Sensor Dropdown
            createSensorDropDown();
        }

        // Create Sensor Groups
        for(var i=0; i<SENSOR_LIST.length; i++) {
            const group = new THREE.Group();
            group.name = SENSOR_LIST[i];
            scene.add(group);
        }

        var animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }; animate();

    });
}