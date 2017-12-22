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
var pontosOriginais = [];
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
                pontosOriginais.push(new Ponto3D(x, y, z));

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

function transfCoordenadasTela(ponto) {
    // a linha abaixo gera os pontos 2D parametrizados no intervalo [-1, 1]:
    var dhx = camera.d / camera.hx;
    var dhy = camera.d / camera.hy;
    var novoX = dhx * ( ponto.x / ponto.z );
    var novoY = dhy * ( ponto.y / ponto.z );
    // em seguida parametrizamos os pontos para as dimensões da janela (intervalos [0, width] e [0, height]) ,
    // transformando tudo em inteiro, podendo descartar os pontos gerados no intervalo [-1, 1].
    novoX = parseInt((novoX+1) * (canvas.width/2) );
    novoY = parseInt((1-novoY)* (canvas.height/2) );
    return new Point2D(novoX,novoY);
}

function convertendoTodosPonto(){
    for(var i = 0 ; i < pontos.length ; i++) {
        pontosTela[i] = transfCoordenadasTela(pontos[i]);
    }
}

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

var triangulos2d = [];
function converterTriangulos(){
    for(var i = 0; i < triangulos.length; i++){
        var v1_2d = transfCoordenadasTela(triangulos[i].a);
        var v2_2d = transfCoordenadasTela(triangulos[i].b);
        var v3_2d = transfCoordenadasTela(triangulos[i].c);
        
        var novoTri2d = new Triangulo2D(v1_2d, v2_2d, v3_2d);
        triangulos2d.push(novoTri2d);
    }
}
//-----------------------------------------------------------------------
//---------------------------------ZBUFFER E OUTRAS COISAS-------------------------------
//zbuffer é um array bidimensional
var zbuffer;
//preencher zbuffer de valores infinitos
function fillZBuffer(){
    zbuffer = [];
    for (var c = 0; c < CANVAS_HEIGHT; c++){
        zbuffer.push([]);
        for (var c1 = 0; c1 < CANVAS_WIDTH; c1++){
            zbuffer[zbuffer.length-1].push({cor:new Vector(0,0,0), dist:+Infinity});
        }
    }
}

//var pixel = {x: a, y: b};
function calcCoordBaricentricas(i, pixel){
    //i sendo o triangulo que queremos
    var alfa, beta, gama;
    var v1 = triangulos2d[i].a;
    var v2 = triangulos2d[i].b;
    var v3 = triangulos2d[i].c;
    
    alfa = (((v2.y - v3.y) * (pixel.x - v3.x)) + ((v3.x - v2.x) * (pixel.y - v3.y)))  /  
           (((v2.y - v3.y) * (v1.x - v3.x)) + ((v3.x - v2.x) * (v1.y - v3.y)));
    
    beta = (((v3.y - v1.y) * (pixel.x - v3.x)) + ((v1.x - v3.x) * (pixel.y - v3.y)))  /
           (((v2.y - v3.y) * (v1.x - v3.x)) + ((v3.x - v2.x) * (v1.y - v3.y)));
    
    gama = 1 - alfa - beta;
    var cor = new Vector(0,0,0);
    
    //usa phong se o z for menor que o do zbuffer:
    //falta saber as posicoes, e n 0 0
    if (P.z < zbuffer[0][0]){
        zbuffer[0][0] = P.z;
        gouraud(P,i,alfa,beta,gama);
    }
}
var pontosNormais = [];


function gouraud(){
    
}
function normalizarPontos(){
    preencherNormaisVazio();
    preencherNormais();   
}

function preencherNormaisVazio() {
    for ( var i =0 ; i<pontos.length ; i++){
        pontosNormais[i]= new Ponto3D(0,0,0);
    }
}

function preencherNormais() {
    for ( var i =0 ; i<pontos.length ; i++){
        var x = pontos[triangulos[i].x];
        console.log(x);
        var y = pontos[triangulos[i].y];
        var z = pontos[triangulos[i].z];
        var vertice1 = x.sub(y);
        var vertice2 = x.sub(z);

        var normals = vertice1.produtoVetorial(vertice2).normaliza();
            if (normals.z < 0) {
              normals = normals.multiplicarEscalar(-1);
            }

        pontosNormais[triangulos[i].x] = pontosNormais[triangulos[i].x].somar(normals);
        pontosNormais[triangulos[i].y] = pontosNormais[triangulos[i].y].somar(normals);
        pontosNormais[triangulos[i].z] = pontosNormais[triangulos[i].z].somar(normals);
    }
}
function calculoPhong(vetorP,i,alfa,beta,gama){ //sera que o p já vai vir? melhor não!   
    var especular, difusa, ambiente;
    var vetorN = calculoN(i,alfa,beta,gama); //falta esse calculo
    var vetorL = vetorP.subtrair(pl);
    var vetorR = 2*vetorN.produtoInterno(vetorL)*vetorN.subtrair(vetorL);
    vetorN.normaliza();
    vetorL.normaliza();
    vetorR.normaliza();
    
    var rv = Math.pow(vetorR.produtoInterno(vetorV),n);
    var nl = vetorL.produtoInterno(vetorN);
    
    ambiente = il.multiplicarEscalar(ka);
    difusa = il.produtoInterno(od).multiplicarEscalar(nl * kd);
    especular = il.multiplicarEscalar(ks*rv);
    
    if (vetorV.produtoInterno(vetorN)<0){
        vetorN = vetorN.multiplicarEscalar(-1);
    }
    if (vetorL.produtoInterno(vetorN)<0){
        difusa = new Vector(0,0,0);
        especular = new Vector(0,0,0);
    }
    if (vetorR.produtoInterno(vetorV)<0){
        especular = new Vector(0,0,0);
    }
    var cores = new Vector(0,0,0);
    cores = ambiente.somar(difusa).somar(especular);
    cores.x = Math.floor(Math.min(cores.x, 255));
    cores.y = Math.floor(Math.min(cores.y, 255));
    cores.z = Math.floor(Math.min(cores.z, 255));
    
    return cores;
}

function calculoN(i,alfa,beta,gama){
    
    var n = new Vector(0,0,0);
    
    n.x = pontosNormais[i].x.multiplicarEscalar(alfa) + pontosNormais[i].x.multiplicarEscalar(beta) + pontosNormais[i].x.multiplicarEscalar(gama);
    n.y = pontosNormais[i].y.multiplicarEscalar(alfa) + pontosNormais[i].y.multiplicarEscalar(beta) + pontosNormais[i].y.multiplicarEscalar(gama);
    n.z = pontosNormais[i].z.multiplicarEscalar(alfa) + beta*pontosNormais[i].z + pontosNormais[i].z.multiplicarEscalar(gama);
    return n;
}




//-----------------------------------------------------------------------
//------------------------------SCANLINE---------------------------------
function drawLine (x1, y1, x2, y2) {
    context.fillStyle="#FF0000";
    if(x1<=x2) {
        for(var i = x1; i <= x2; i++) {
            context.fillRect(i, y1, 1, 1);
        }
    } else {
        for(var i = x2; i <= x1; i++) {
            context.fillRect(i, y2, 1, 1);
        }
    }
}

function scanLine() {
    convertendoTodosPonto();
    for(var i = 0; i < triangulos.length; i++) {
        
        //converte os vertices dos triangulos para coordenadas de tela

        var v1 = pontosTela[pontosTriangulo[i][0] - 1];
        var v2 = pontosTela[pontosTriangulo[i][1] - 1];
        var v3 = pontosTela[pontosTriangulo[i][2] - 1];

        var t;
        if(v1.y > v2.y) {
            t = v1;
            v1 = v2;
            v2 = t;
        }
    
        if(v1.y > v3.y) {
            t = v1;
            v1 = v3;
            v3 = t;
        }
    
        if(v2.y > v3.y) {
            t = v2;
            v2 = v3;
            v3 = t;
        }

        if(v2.y === v3.y) {
            fillBottomFlatTriangle(v1, v2, v3);
        } else if(v1.y === v2.y) {
            fillTopFlatTriangle(v1, v2, v3);
        } else {
            var v4 = new Point2D(
                parseInt((v1.x + ((v2.y - v1.y) / (v3.y - v1.y)) * (v3.x - v1.x)), 10), v2.y);
            fillBottomFlatTriangle(v1, v2, v4);
            fillTopFlatTriangle(v2, v4, v3);
        }
        
    }
}

function fillBottomFlatTriangle(v1, v2, v3) {
    
    var invislope1 = (v2.x - v1.x) / (v2.y - v1.y);
    var invislope2 = (v3.x - v1.x) / (v3.y - v1.y);

    var curx1 = v1.x;
    var curx2 = v1.x;
    
    for(var scanlineY = v1.y; scanlineY <= v2.y; scanlineY++) {

        drawLine(parseInt(curx1, 10), scanlineY, parseInt(curx2, 10), scanlineY);

        curx1 += invislope1;
        curx2 += invislope2;
    }
}

function fillTopFlatTriangle(v1, v2, v3) {
    var invslope1 = (v3.x - v1.x) / (v3.y - v1.y);
    var invslope2 = (v3.x - v2.x) / (v3.y - v2.y);
  
    var curx1 = v3.x;
    var curx2 = v3.x;
  
    for (var scanlineY = v3.y; scanlineY > v1.y; scanlineY--) {

        drawLine(parseInt(curx1, 10), scanlineY, parseInt(curx2, 10), scanlineY);
      
        curx1 -= invslope1;
        curx2 -= invslope2;
    }
}
//-----------------------------------------------------------------------
function enviar(){
    fillZBuffer();
    startCanvas();
    //o que mais falta?
    //console.log("1didb1yidb1");
    calibrarCamera();
    //console.log("aqui");
    calcTriangulo();
    //console.log("aqui2");
    convertendoTodosPonto();
    converterTriangulos();
    normalizarPontos();
    //console.log("aqui3",pontosNormais);
    
}