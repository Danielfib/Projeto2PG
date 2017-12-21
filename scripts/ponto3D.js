var pontosTela= [];

function Ponto3D(x, y, z){
    //construtor
    this.x = x
    this.y = y;
    this.z = z;
    this.normal = new Vector(0, 0, 0);
}

Ponto3D.prototype.sub = function(point){
    return new Vector( this.x - point.x, this.y - point.y, this.z - point.z);
}

//Precisa garantir a soma baricentrica, eu acho né
Ponto3D.prototype.add = function(point){
    return new Ponto3D( this.x + point.x, this.y + point.y, this.z + point.z);
}

//estranho, multiplicar ponto por escalar????????
Ponto3D.prototype.mult = function(k){
    return new Ponto3D (this.x * k , this.y * k, this.z * k);
}

Ponto3D.prototype.clone = function() {
    return new Ponto3D(this.x, this.y, this.z);
}

Ponto3D.prototype.transfCoordenadasTela= function() {
    // a linha abaixo gera os pontos 2D parametrizados no intervalo [-1, 1]:
    var dhx = Camera.d / Camera.hx;
    var dhy = Camera.d / Camera.hy;
    var novoX = dhx * ( ponto3D.x / ponto3D.z );
    var novoY = dhy * ( ponto3D.y / ponto3D.z );
    // em seguida parametrizamos os pontos para as dimensões da janela (intervalos [0, width] e [0, height]) ,
    // transformando tudo em inteiro, podendo descartar os pontos gerados no intervalo [-1, 1].
    novoX = parseInt((novoX+1) * (canvas.width/2) );
    novoY = parseInt((1-novoY)* (canvas.height/2) );
    return new ponto2D(novoX,novoY);
}

Ponto3D.prototype.convertendoTodosPonto = function() {
    for( var i = 0 ; i < object.pontos.lenght ; i++) {
        pontosTela[i] = object.pontos[i].TransfCoordenadasTela;
    }
}