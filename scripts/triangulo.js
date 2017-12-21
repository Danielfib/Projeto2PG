function Triangulo(a, b, c) {
    //vamos começar cosntruindo o construtor básico
    this.a = a; 
    this.b = b; 
    this.c = c;
    this.normal;
}

//calcular normal do triangulo normalizado
Triangulo.prototype.calcNormal = function() {
    var v = new Vector(this.b.x - this.a.x, this.b.y - this.a.y, this.b.z - this.a.z);
    var u = new Vector(this.c.x - this.a.x, this.c.y - this.a.y, this.c.z - this.a.z);
    var w = v.produtoVetorial(u);
    this.normal = w;
};

//coordenadas baricentricas dos pontos do triangulo em relação a um ponto

//ordenar um trinagulo com os pontos ordenados

//calcular area do triangulo

Triangulo.prototype.clone = function() {
    return new Triangulo(this.a, this.b, this.c);
}