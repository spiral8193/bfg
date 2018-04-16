var options = {
    framerate: 60,
    G: 10,
    START_SPEED: 10,
    MOVER_COUNT: 32,
    TRAILS_DISPLAY: true,
    SHOW_DIED: false,
    SHOW_LABELS: true, 
    TRAILS_LENGTH: 1000,
    MIN_MASS: .01,
    MAX_MASS: 1000,
    DENSITY: 0.1,

    MoveSpeed: 500,
    MAX_DISTANCE: 300000,
    BIG_STAR_MASS:100000,
};

// LOAD CONFIG 
if (localStorage && localStorage.getItem("options")){
    optionsSVG = JSON.parse(localStorage.getItem("options"));
    for (var key in optionsSVG) {
        console.log(key, optionsSVG[key]);
        options.key = optionsSVG.key;
        options[key] = optionsSVG[key];
      }
}

options.AddBigStar = function () {
    AddBigMoverToCenter();
}

options.RESET = function () {
    reset();
}

options.SAVECONFIG = function () {
    // SVG CONFIG OPTIONS
    localStorage.setItem("options", JSON.stringify(options));
}

// dat GUI
var gui = new dat.GUI();
var f = gui.addFolder('Environment');
f.open();
//f.add(options, 'framerate', 1, 120);
f.add(options, 'G', 1, 1000);

var fMoverCountE = f.add(options, 'MOVER_COUNT', 1, 128);
fMoverCountE.onFinishChange(function (value) {
    // Fires when a controller loses focus.
    //reset();
});

f = gui.addFolder('Trails & Labels');
f.open();
f.add(options, 'TRAILS_DISPLAY');
f.add(options, 'TRAILS_LENGTH', 0, 10000);

f.add(options, 'SHOW_DIED');
f.add(options, 'SHOW_LABELS');

f = gui.addFolder('Masses');
f.open();

var fMinMassChangeE = f.add(options, 'MIN_MASS', .00001, 10000.0);
fMinMassChangeE.onFinishChange(function (value) {
    if(options.MAX_MASS<options.MIN_MASS){
        options.MAX_MASS = value;
        fMaxMassChangeE.updateDisplay();
    }
    //reset();
});

var fMaxMassChangeE = f.add(options, 'MAX_MASS', .00001, 10000.0);
fMaxMassChangeE.onFinishChange(function (value) {
    //reset();
});

f = gui.addFolder('Start');
f.open();

var fDensityE = f.add(options, 'DENSITY', 1e-100, 1.0);
fDensityE.onFinishChange(function (value) {
    //reset();
});

var fSpeedE = f.add(options, 'START_SPEED', 1e-100, 100.0);
fSpeedE.onFinishChange(function (value) {
    //reset();
});

var moveSpeed = 100;
f.add(options, 'MoveSpeed', 1, 1000).onFinishChange(function (value) {
    //console.log(value);
    moveSpeed = Math.floor(options.MoveSpeed);
    console.log(moveSpeed);
});

f.add(options, 'AddBigStar').name('Add Big Star');
f.add(options, 'SAVECONFIG').name('SaveTheConf');
f.add(options, 'RESET').name('RESET ALL');

	// GitHub ICON 
    var github = gui.add({ fun : function () { window.open('https://github.com/Almaric78/gravity-engine'); } }, 'fun').name('Github');
    github.__li.className = 'cr function bigFont';
    github.__li.style.borderLeft = '3px solid #8C8C8C';
    var githubIcon = document.createElement('span');
    github.domElement.parentElement.appendChild(githubIcon);
    githubIcon.className = 'icon github';
	
/*
    var twitter = gui.add({ fun : function () { window.open('https://twitter.com/PavelDoGreat'); } }, 'fun').name('Twitter');
    twitter.__li.className = 'cr function bigFont';
    twitter.__li.style.borderLeft = '3px solid #8C8C8C';
    var twitterIcon = document.createElement('span');
    twitter.domElement.parentElement.appendChild(twitterIcon);
    twitterIcon.className = 'icon twitter';
*/

//console.log(gui);

//var HTTP_GET_VARS=new Array();
//var strGET=document.location.search.substr(1,document.location.search.length);
//if(strGET!='')
//{
//    gArr=strGET.split('&');
//    for(i=0;i<gArr.length;++i)
//    {
//        v='';vArr=gArr[i].split('=');
//        if(vArr.length>1){v=vArr[1];}
//        HTTP_GET_VARS[unescape(vArr[0])]=unescape(v);
//    }
//}
//
//function GET(v)
//{
//    if(!HTTP_GET_VARS[v]){return 'undefined';}
//    return HTTP_GET_VARS[v];
//}
//


//var G = 100;

//var MOVER_COUNT = 32;

//var MOVER_MASS_MIN = .0000001;
//var MOVER_MASS_MAX = 100;

///* GET parameters for configuration: */
//var GET_G = parseFloat(GET("G"));
//if (GET_G > 0) {
//    G = GET_G;
//}
//var GET_mover_count = parseInt(GET("count"));
//if (GET_mover_count) {
//    MOVER_COUNT = GET_mover_count;
//}
//var GET_min=parseFloat(GET("min"));
//if (GET_min > 0) {
//    MOVER_MASS_MIN = GET_min;
//}
//var GET_max=parseFloat(GET("max"));
//if (GET_max > 0) {
//    MOVER_MASS_MAX = GET_max;
//}

//var FPS = 60;
var MASS_FACTOR = .01; // for display of size

var SPHERE_SIDES = 12;
//var TRAILS_LENGTH = 100;

var zoom = 1.0;
var translate = new THREE.Vector3();

var movers = [];
//var container =  false; // ME
//var textlabels = [];