var canvas;

const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 600;

var context;

function startCanvas(){    
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}

//preenche o zbuffer com valores infinitos
fillZBuffer();