function Triangulo(a, b, c) {
    //vamos começar cosntruindo o construtor básico
    this.a = c; 
    this.b = b; 
    this.c = c;
    this.normal = new Vector(0, 0, 0);
}

//calcular normal do triangulo normalizado
Triangulo.prototype.calcNormal = function() {
    var p3p2 = new Vector(this.c.x - this.b.x, this.c.y - this.b.y, this.c.z - this.b.z);
    var p2p1 = new Vector(this.b.x - this.a.x, this.b.y - this.a.y, this.b.z - this.a.z);
    this.normal = p3p2.produtoVetorial(p2p1).normaliza();
}

//coordenadas baricentricas dos pontos do triangulo em relação a um ponto

//ordenar um trinagulo com os pontos ordenados

//calcular area do triangulo

Triangulo.prototype.normal = function() {
    var v = new Vetor(this.b.x - this.a.x, this.b.y - this.a.y, this.b.z - this.a.z );
    var u = new Vetor(this.c.x - this.b.x, this.c.y - this.b.y, this.c.z - this.b.z );
    this.normal = v.produtoVetorial(u);
    this.normal.normaliza();
};

Triangulo.prototype.clone = function() {
    return new Triangulo(this.a, this.b, this.c);
}