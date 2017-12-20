function Objeto(pontos, pontosTriangulo){
    
    this.pontos = pontos;
    this.pontosTriangulos = pontosTriangulo;
        
    //calcular triangulos
}

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