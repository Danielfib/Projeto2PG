//isso era pra funcionar como uma classe, mas ainda n ta funcionando

function Ponto3D(x, y, z){
    //construtor
    this.x = x;
    this.y = y;
    this.z = z;    
}

Ponto3D.prototype.sub = function(point){
    return new Ponto3D ( this.x - point.x, this.y - point.y, this.z - point.z);
};

Ponto3D.prototype.add = function(point){
    return new Ponto3D ( this.x + point.x, this.y + point.y, this.z + point.z);
};


Ponto3D.prototype.mult = function(number){
    return new Ponto3D ( this.x * number , this.y * number, this.z * number.z);
};