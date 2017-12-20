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
}