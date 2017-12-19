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