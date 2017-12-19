function Camera (cameraPosition, vetorN, vetorV, d, hx, hy){
    //construtor
    this.cameraPosition = cameraPosition;
    this.vetorN = vetorN;
    this.vetorV = vetorV;
    this.d = d;
    this.hx = hx;
    this.hy = hy;
    this.matrix = [];

    //console.log(cameraPosition);
    //console.log(vetorN);
    //console.log(vetorV);
    //console.log(d);
    //console.log(hx);
    //console.log(hy);     
}

Camera.prototype.calibrarCamera = function(){
    this.vetorN = this.vetorN.normaliza();
    this.vetorV = this.vetorV.gramSchmidt(this.vetorN);
    this.vetorN = this.vetorV.normaliza();
    var vetorU = this.vetorV.produtoVetorial(this.vetorN);
    this.matrix.push([vetorU.x, vetorU.y, vetorU.z ]);
    this.matrix.push([this.vetorV.x,this.vetorV.y,this.vetorV.z]);
    this.matrix.push([this.vetorN.x,this.vetorN.y,this.vetorN.z]);
}

this.calibrarCamera();

var camera;

document.getElementById('camera').addEventListener('change', loadCamera, false);

function loadCamera(event){
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
        
        
            //talvez aqui usar point3d e vector
            var cameraPosition = [entrada[count], entrada[count+1], entrada[count+2]];
            count += 3;
            var vetorN = [entrada[count], entrada[count+1], entrada[count+2]];
            count += 3;
            var vetorV = [entrada[count], entrada[count+1], entrada[count+2]];
            count += 3;
            var d = entrada[count];
            var hx = entrada[count+1];
            var hy = entrada[count+2];
            
            camera = new Camera(cameraPosition, vetorN,
                                vetorV, d, hx, hy);
        };        
    })(file);
    reader.readAsText(file);

}