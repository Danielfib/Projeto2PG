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
	return (new Vector(X, Y, Z));
};

Vector.prototype.gramSchmidt = function(v) {
    return v.subtrair(v.projecao(this));
};

Vector.prototype.getCosseno = function(v) {
    return (this.produtoInterno(v) / (this.norma() * v.norma()));
};

//copia vetor
Vector.prototype.clone = function () {
    return new Vetor(this.x, this.y, this.z);
};