var canvas;

var canvasHeight;
var canvasWidth;

var context;

function startCanvas(){
    canvasWidth = document.getElementById('canvasDiv').offsetWidth;
    canvasHeight = document.getElementById('canvasDiv').offsetHeight;
    
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}