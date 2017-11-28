function Objeto(pontos, pontosTriangulo){
    //construtor
    this.pontos = pontos;
    this.pontosTriangulos = pontosTriangulo;
    //console.log("pontos:");
    //console.log(pontos);
    //console.log("pontosTriangulo:");
    //console.log(pontosTriangulo);
    
    
    //calcular triangulos
}

document.getElementById('objeto').addEventListener('change', loadObject, false);

var objeto;

function loadObject(event){
    var file = event.target.files[0]; //so vai selecionar um arquivo
    var reader = new FileReader();
    reader.onload = (function(file) {
        return function(event){
            var count = 0;
            var entrada = [];
            var dados = this.result.split('\n');
            //console.log(dados);
            for (var c = 0; c < dados.length; c++){
                var valores = dados[c].split(' ');
                for (var c1 = 0; c1 < valores.length; c1++){
                    entrada.push(parseFloat(valores[c1]));
                }
            }
            //console.log(entrada);
            
            var numPontos = entrada[count++];
            var numTriangulos = entrada[count++];
            
            var pontos = [];
            for(var c = 0; c < numPontos; c++){
                var x = entrada[count++];
                var y = entrada[count++];
                var z = entrada[count++];
                
                //usar ponto3d(n to conseguindo)
                pontos.push([x, y, z]);
            }
            
            
            var pontosTriangulo = [];
            for(var c = 0; c < numTriangulos; c++){
                var X = entrada[count++];
                var Y = entrada[count++];
                var Z = entrada[count++];
                
                pontosTriangulo.push([X, Y, Z]);
            }
            
            objeto = new Objeto(pontos, pontosTriangulo);        
        };        
    })(file);
    reader.readAsText(file);

}