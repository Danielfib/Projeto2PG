function Triangulo(a,b,c){
    //vamos começar cosntruindo o construtor básico
    this.a = c; 
    this.b = b ; 
    this.c = c;

    this.normal = new Vetor(0,0,0);

    Triangulo.prototype.normal = function(){
        var v = new Vetor(this.b.x - this.a.x, this.b.y - this.a.y, this.b.z - this.a.z );
        var u = new Vetor(this.c.x - this.b.x, this.c.y - this.b.y, this.c.z - this.b.z );
        this.normal = v.produtoVetorial(u);
        this.normal.normaliza();
    }
}