//----------------------------------------------------------------------
//------------------------------CANVAS----------------------------------
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
//----------------------------------------------------------------------
//--------------------------CAMERA--------------------------------------
var camera = null;
//camera tera como atributo tudo isso embaxo
var cameraPosition;
var vetorN;
var vetorV;
var vetorU; //calculado em calibrarCamera()
var d;
var hx;
var hy;
var matrix = [];

function mudarSisCoordenadas(ponto){
    //translada o ponto em relação ao foco
    //console.log("ponto:", ponto);
    var p = ponto.transladar(camera.cameraPos);
    //console.log("P:", p);
    //console.log("cameaPos:",camera.cameraPos);

    //mudança de base
    var x = (matrix[0][0] * p.x) + (matrix[0][1] * p.y) + (matrix[0][2] * p.z);
    var y = (matrix[1][0] * p.x) + (matrix[1][1] * p.y) + (matrix[1][2] * p.z);
    var z = (matrix[2][0] * p.x) + (matrix[2][1] * p.y) + (matrix[2][2] * p.z);
    var a = new Ponto3D(x, y, z);
    a.normal = p.normal;
    return a;
}

function calibrarCamera(){
    vetorN = vetorN.normaliza();
    vetorV = vetorV.gramSchmidt(vetorN);
    vetorV = vetorV.normaliza();
    vetorU = vetorN.produtoVetorial(vetorV);
    matrix.push([vetorU.x, vetorU.y, vetorU.z]);
    matrix.push([vetorV.x, vetorV.y, vetorV.z]);
    matrix.push([vetorN.x, vetorN.y, vetorN.z]);
    
}

//calibrearCamera();

var camera = null;

document.getElementById('camera').addEventListener('change', loadCamera, false);

function loadCamera(event){
    var file = event.target.files[0]; //so vai selecionar um arquivo
    var reader = new FileReader();
    reader.onload = (function(file) {
        return function(event){
            var count = 0;
            var entrada = [];
            var dados = this.result.split('\n');
            for (var c = 0; c < dados.length; c++) {
                var valores = dados[c].split(' ');
                for (var c1 = 0; c1 < valores.length; c1++) {
                    entrada.push(parseFloat(valores[c1]));
                }
            }
        
            //talvez aqui usar point3d e vector
            cameraPosition = [entrada[count], entrada[count+1], entrada[count+2]];
            count += 3;
            vetorN = new Vector(entrada[count], entrada[count+1], entrada[count+2]);
            count += 3;
            vetorV = new Vector(entrada[count], entrada[count+1], entrada[count+2]);
            count += 3;
            d = entrada[count];
            hx = entrada[count+1];
            hy = entrada[count+2];
            
            camera = {cameraPos: cameraPosition, N: vetorN, V: vetorV, d: d, hx: hx, hy: hy};
        };        
    })(file);
    reader.readAsText(file);
}
//----------------------------------------------------------------------
//-------------------------------OBJETO---------------------------------
var objeto = null;
//objeto tera como atributos os dois arraye de baixo
var pontos = [];
var pontosTriangulo = [];
var triangulos = []; //array de objetos triangulos

function calcTriangulo() {
    var triangulo;

    //pontos do objeto em coordenadas de vista
    console.log("antes" , pontos[2]);
    for(var i = 0; i < pontos.length; i++) {
        pontos[i] = mudarSisCoordenadas(pontos[i]);
    }
    console.log("depois",pontos[2]);

    for(var i2 = 0; i2 < pontosTriangulo.length; i2++) {

        //vertices do triangulo
        var a = pontosTriangulo[i2][0] - 1;
        var b = pontosTriangulo[i2][1] - 1;
        var c = pontosTriangulo[i2][2] - 1;

        var verticeA = pontos[a];
        var verticeB = pontos[b];
        var verticeC = pontos[c];

        //criando o triangulo
        triangulo = new Triangulo(verticeA, verticeB, verticeC);

        //calculo das normais dos triangulos
        triangulo.calcNormal();

        //calculo das normais dos vertices
        pontos[a].normal = pontos[a].normal.somar(triangulo.normal);
        pontos[b].normal = pontos[b].normal.somar(triangulo.normal);
        pontos[c].normal = pontos[c].normal.somar(triangulo.normal);

        //normalização das normais
        for(var i3 = 0; i3 < this.pontos.length; i3++) {
            this.pontos[i3].normal = this.pontos[i3].normal.normaliza();
        }

        triangulos.push(triangulo);
    }
}

document.getElementById('objeto').addEventListener('change', loadObject, false);

function loadObject(event){
    var file = event.target.files[0]; //so vai selecionar um arquivo
    var reader = new FileReader();
    reader.onload = (function(file) {
        return function(event){
            var count = 0;
            var entrada = [];
            var dados = this.result.split('\n');
            for (var c = 0; c < dados.length; c++){
                var valores = dados[c].split(' ');
                for (var c1 = 0; c1 < valores.length; c1++){
                    entrada.push(parseFloat(valores[c1]));
                }
            }
            
            var numPontos = entrada[count++];
            var numTriangulos = entrada[count++];
            
            for(var c = 0; c < numPontos; c++){
                var x = entrada[count++];
                var y = entrada[count++];
                var z = entrada[count++];
                
                pontos.push(new Ponto3D(x, y, z));
            }
            
            
            pontosTriangulo = [];
            for(var c = 0; c < numTriangulos; c++){
                var X = entrada[count++];
                var Y = entrada[count++];
                var Z = entrada[count++];
                
                pontosTriangulo.push([X, Y, Z]);
            }
            //calcula as normais dos vertices, amarzenando-as num array de vetores
            //calcularNormaisPontos(pontosTriangulo);
            objeto = {pontos: pontos, pontosTriangulo: pontosTriangulo};
        };        
    })(file);
    reader.readAsText(file);
}
//----------------------------------------------------------------------
//----------------------------------ILUMINACAO--------------------------
var iluminacao = null;
var pl;
var ka;
var ia;
var kd;
var od;
var ks;
var il;
var n;

document.getElementById('iluminacao').addEventListener('change', loadIluminacao, false);

function loadIluminacao(event){
    var file = event.target.files[0]; //so vai selecionar um arquivo
    var reader = new FileReader();
    reader.onload = (function(file) {
        return function(event){
            var count = 0;
            var entrada = [];
            var dados = this.result.split('\n');
            //console.log(dados);
            for (var c = 0; c < dados.length; c++){
                var valores = dados[c].split(' ');
                for (var c1 = 0; c1 < valores.length; c1++){
                    entrada.push(parseFloat(valores[c1]));
                }
            }
            //console.log(entrada);
            
            //usar ponto3d e vetor quando der
            //por enquanto usando array
            pl = new Ponto3D(entrada[count++], entrada[count++], entrada[count++]);
            ka = entrada[count++];
            ia = new Vector(entrada[count++], entrada[count++], entrada[count++]);
            kd = entrada[count++];
            od = new Vector(entrada[count++], entrada[count++], entrada[count++]);
            ks = entrada[count++];
            il = new Vector(entrada[count++], entrada[count++], entrada[count++]);
            n = entrada[count++];
            
            iluminacao = {pl: pl, ka: ka, ia: ia, kd: kd, od: od, ks: ks, il: il, n: n};
        };        
    })(file);
    reader.readAsText(file);

}
//-----------------------------------------------------------------------
//------------------------------------VETORES----------------------------
function Vector(x, y, z) {   
    //construtor
    this.x = x;
    this.y = y;
    this.z = z;
}

//somar vetores
Vector.prototype.somar = function(v) {
    return (new Vector(this.x + v.x, this.y + v.y, this.z + v.y));
};

//subtrair vetores
Vector.prototype.subtrair = function(v) {
    return (new Vector(this.x - v.x, this.y - v.y, this.z - v.y));
};

Vector.prototype.multiplicarEscalar = function(k) {
    return (this.x*k, this.y*k, this.z*k);
};

//produto interno
Vector.prototype.produtoInterno = function(v) {
    return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
};

//normalizacao
Vector.prototype.normaliza = function() {
    var norma = this.norma();
    return (new Vector(this.x/norma, this.y/norma, this.z/norma));
};

//norma
Vector.prototype.norma = function() {
    return (Math.sqrt(this.produtoInterno(this)));
};

//projeção ortogonal
Vector.prototype.projecao = function(v) {
    var div = this.produtoInterno(v) / v.produtoInterno(v);
    return (new Vector(div*v.x, div*v.y, div*v.z));
};
    
//produto vetorial
Vector.prototype.produtoVetorial = function(v) {
    var X = this.y*v.z - this.z*v.y;
	var Y = this.z*v.x - this.x*v.z;
	var Z = this.x*v.y - this.y*v.x;
    var w = new Vector(X, Y, Z);
    return w;
};

Vector.prototype.gramSchmidt = function(v) {
    return v.subtrair(v.projecao(this));
};

Vector.prototype.getCosseno = function(v) {
    return (this.produtoInterno(v) / (this.norma() * v.norma()));
};

//copia vetor
Vector.prototype.clone = function () {
    return new Vector(this.x, this.y, this.z);
};
//-----------------------------------------------------------------------
//--------------------------------PONTO3D--------------------------------
var pontosTela = [];

function Ponto3D(x, y, z){
    //construtor
    this.x = x;
    this.y = y;
    this.z = z;
    this.normal = new Vector(0, 0, 0);
}

Ponto3D.prototype.transladar = function(a) {
    //como "a" é a cameraPos, que é um vetor
    var p = new Ponto3D(a[0] - this.x, a[1] - this.y, a[2] - this.z);
    p.normal = this.normal;
    return p;
};

Ponto3D.prototype.sub = function(point){
    return new Ponto3D ( this.x - point.x, this.y - point.y, this.z - point.z);
};

//Precisa garantir a soma baricentrica, eu acho né
Ponto3D.prototype.add = function(point){
    return new Ponto3D ( this.x + point.x, this.y + point.y, this.z + point.z);
};

//estranho, multiplicar ponto por escalar????????
Ponto3D.prototype.mult = function(k){
    return new Ponto3D (this.x * k , this.y * k, this.z * k);
};

Ponto3D.prototype.clone = function() {
    return new Ponto3D(this.x, this.y, this.z);
};

Ponto3D.prototype.transfCoordenadasTela= function() {
    // a linha abaixo gera os pontos 2D parametrizados no intervalo [-1, 1]:
    var dhx = camera.d / camera.hx;
    var dhy = camera.d / camera.hy;
    var novoX = dhx * ( this.x / this.z );
    var novoY = dhy * ( this.y / this.z );
    // em seguida parametrizamos os pontos para as dimensões da janela (intervalos [0, width] e [0, height]) ,
    // transformando tudo em inteiro, podendo descartar os pontos gerados no intervalo [-1, 1].
    novoX = parseInt((novoX+1) * (canvas.width/2) );
    novoY = parseInt((1-novoY)* (canvas.height/2) );
    return new Point2D(novoX,novoY);
};

Ponto3D.prototype.convertendoTodosPonto = function() {
    for( var i = 0 ; i < pontos.lenght ; i++) {
        pontosTela[i] = pontos[i].transfCoordenadasTela;
    }
};

//-----------------------------------------------------------------------
//---------------------------------PONTO2D-------------------------------
function Point2D (x,y) {
    this.x = x;
    this.y = y;
    this.normal = new Vector(0,0,0);
}
//-----------------------------------------------------------------------
//---------------------------------TRIANGULO-----------------------------
function Triangulo(a, b, c){
    //vamos começar cosntruindo o construtor básico
    this.a = c; 
    this.b = b; 
    this.c = c;
    this.normal;
}

//calcular normal do triangulo normalizado

//coordenadas baricentricas dos pontos do triangulo em relação a um ponto

//ordenar um trinagulo com os pontos ordenados

//calcular area do triangulo

Triangulo.prototype.calcNormal = function() {
    var v = new Vector(this.b.x - this.a.x, this.b.y - this.a.y, this.b.z - this.a.z );
    var u = new Vector(this.c.x - this.b.x, this.c.y - this.b.y, this.c.z - this.b.z );
    var w = v.produtoVetorial(u);
    this.normal = w;
    this.normal.normaliza();
    console.log("oi");
};

Triangulo.prototype.clone = function() {
    return new Triangulo(this.a, this.b, this.c);
};
//-----------------------------------------------------------------------
//-----------------------------------TRIANGULO2D-------------------------
function Triangulo2D(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.normal;
}

//coordenadas baricentricas

//ordenar pontos do triangulo

Triangulo.prototype.clone = function() {
    return new Triangulo2D(this.a, this.b, this.c);
};
//-----------------------------------------------------------------------
//---------------------------------ZBUFFER-------------------------------
//zbuffer é um array bidimensional
var zbuffer;
fillZBuffer();
//preencher zbuffer de valores infinitos
function fillZBuffer(){
    zbuffer = [];
    for (var c = 0; c < 800; c++){
        zbuffer.push([]);
        for (var c1 = 0; c1 < 600; c1++){
            zbuffer[zbuffer.length-1].push({cor:new Vector(0,0,0), dist:+Infinity});
        }
    }
}
//-----------------------------------------------------------------------
function enviar(){
    startCanvas();
    //o que mais falta?
    //console.log("1didb1yidb1");
    calibrarCamera();
    //console.log("aqui");
    calcTriangulo();
    //console.log("aqui2");
    
}