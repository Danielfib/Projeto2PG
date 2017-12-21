var pontosTela= [];

function Point2D (x,y) {
    this.x = x;
    this.y = y;
    this.normal = new Vector(0,0,0);
}

function TransfCoordenadasTela(ponto3D){
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

function ConvertendoTodosPonto(array3D){
    for( var i = 0 ; i < object.pontos.lenght ; i++) {
        pontosTela[i] = TransfCoordenadasTela(object.pontos[i]);
    }
}