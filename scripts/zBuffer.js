//zbuffer é um array bidimensional
var zbuffer;

//preencher zbuffer de valores infinitos
function fillZBuffer(){
    zbuffer = [];
    for (var c = 0; c < 800; c++){
        zbuffer.push([]);
        for (var c1 = 0; c1 < 600; c1++){
            zbuffer[zbuffer.length-1].push(new tuplaZBuffer([0,0,0], +Infinity));
        }
    }
}