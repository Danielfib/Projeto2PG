function Objeto(pontos, pontosTriangulo){
    
    this.pontos = pontos;
    this.pontosTriangulos = pontosTriangulo;
    this.triangulos = [];
}

Objeto.prototype.calcTriangulo = function () {
    //pontos do objeto em coordenadas de vista
    for(var i = 0; i < this.pontos.length; i++) {
        this.pontos[i] = camera.mudarSisCoordenadas(this.pontos[i]);
    }
    var triangulo;
    for(var i = 0; i < this.pontosTriangulos.length; i++) {
        
        //vertices do triangulo
        var a = this.pontosTriangulos[i][0] - 1;
        var b = this.pontosTriangulos[i][1] - 1;
        var c = this.pontosTriangulos[i][2] - 1;

        var verticeA = this.pontos[a];
        var verticeB = this.pontos[b];
        var verticeC = this.pontos[c];

        //criando o triangulo
        triangulo = new Triangulo(verticeA, verticeB, verticeC);

        //calculo das normais dos triangulos
        triangulo.calcNormal();
        
        //calculo das normais dos vertices
        this.pontos[a].normal = this.normal[a].normal.add(triangulo.normal);
        this.pontos[b].normal = this.normal[b].normal.add(triangulo.normal);
        this.pontos[c].normal = this.normal[c].normal.add(triangulo.normal);

        //normalização das normais
        for(var i = 0; i < this.pontos.length; i++) {
            this.pontos[i].normal = this.pontos[i].normal.normaliza();
        }

        this.triangulos.push(triangulo);
    }
}

this.calcTriangulo();

document.getElementById('objeto').addEventListener('change', loadObject, false);

var objeto = null;

function loadObject(event){
    var file = event.target.files[0]; //so vai selecionar um arquivo
    var reader = new FileReader();
    reader.onload = (function(file) {
        return function(event){
            var count = 0;
            var entrada = [];
            var dados = this.result.split('\n');
            for (var c = 0; c < dados.length; c++){
                var valores = dados[c].split(' ');
                for (var c1 = 0; c1 < valores.length; c1++){
                    entrada.push(parseFloat(valores[c1]));
                }
            }
            
            var numPontos = entrada[count++];
            var numTriangulos = entrada[count++];
            
            var pontos = [];
            for(var c = 0; c < numPontos; c++){
                var x = entrada[count++];
                var y = entrada[count++];
                var z = entrada[count++];
                
                pontos.push(new Point3D(x, y, z));
            }
            
            
            var pontosTriangulo = [];
            for(var c = 0; c < numTriangulos; c++){
                var a = entrada[count++];
                var b = entrada[count++];
                var c = entrada[count++];
                
                pontosTriangulo.push([a, b, c]);
            }
            
            objeto = new Objeto(pontos, pontosTriangulo);        
        };        
    })(file);
    reader.readAsText(file);

}