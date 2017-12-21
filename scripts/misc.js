
function Phong(pontoAtual, countTri, pixel, alfa, beta, gama){
    var normal;
    var prodIluDifusa, prodIluEspec, potIluEspecular;
    var cor;
    
    var ambiental, difusa, especular;
    var escalarAndEspecular;
    
    var L = Vector.subtrair(this.pl, pontoAtual);
    var V = Vector.subtrair(camera.pontoC, pontoAtual);
    //var N = 
    
    
}

//----------------------------------------------------------------------

var normaisVertices = [];
var normaisTriangulos = [];

function calcularNormais(triangulos){
    for (var i = 0; i < triangulos.length; i++){
        normaisTriangulos[i] = calcularNormalTri(triangulos[i]);
        calcularNormalVertice(i);
    }    
}

function calcularNormalTri(triangulo){
    var vertice1 = this.pontos[triangulo.a - 1];
    var vertice2 = this.pontos[triangulo.b - 1];
    var vertice3 = this.pontos[triangulo.c - 1];
    
    var p3p1 = {a: parseFloat(vertice3.a) - parseFloat(vertice1.a), b: parseFloat(vertice3.b) - parseFloat(vertice1.b), c: parseFloat(vertice3.c) - parseFloat(vertice1.c)};
    var p2p1 = {a: parseFloat(vertice2.a) - parseFloat(vertice1.a), b: parseFloat(vertice2.b) - parseFloat(vertice1.b), c: parseFloat(vertice2.c) - parseFloat(vertice1.c)};
    
    var prodVetorial = Vector.produtoVetorial(p2p1, p3p1);
    return Vector.normaliza(prodVetorial);
    
}

function calcularNormalVertice(i){
    var ponto1 = this.pontosTriangulos[i].a - 1;
    var ponto2 = this.pontosTriangulos[i].b - 1;
    var ponto3 = this.pontosTriangulos[i].c - 1;
    
    var ta = normaisTriangulos[i].a;
    var tb = normaisTriangulos[i].b;
    var tc = normaisTriangulos[i].c;
    
    normaisVertices[ponto1] = {a: normaisVertices[ponto1]};
}

function normalPontoObjeto(i, alfa, beta, gama){
    var ponto1 = parseInt(this.pontosTriangulos[i][0] - 1);
    var ponto2 = parseInt(this.pontosTriangulos[i][1] - 1);
    var ponto3 = parseInt(this.pontosTriangulos[i][2] - 1);
    
    //var normalVertice1 = 
    
}
//----------------------------------------------------------------------
//preenche o zbuffer com valores infinitos
fillZBuffer();