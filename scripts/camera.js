function Camera (pontoC, vetorN, vetorV, d, hx, hy) {
    this.pontoC = pontoC;
    this.vetorN = vetorN;
    this.vetorV = vetorV;
    this.d = d;
    this.hx = hx;
    this.hy = hy;
    this.matrix = [];

    this.mudarSisCoordenadas = function(ponto) {
        //translada o ponto em relação ao foco
        var p = ponto.transladar(this.pontoC);

        //mudança de base
        var x = (this.matrix[0][0] * p.x) + (this.matrix[0][1] * p.y) + (this.matrix[0][2] * p.z);
        var y = (this.matrix[1][0] * p.x) + (this.matrix[1][1] * p.y) + (this.matrix[1][2] * p.z);
        var z = (this.matrix[2][0] * p.x) + (this.matrix[2][1] * p.y) + (this.matrix[2][2] * p.z);
        var a = new Ponto3D(x, y, z);
        a.normal = p.normal;
        return a;
    };

    this.calibrarCamera = function() {
        this.vetorN = this.vetorN.normaliza();
        this.vetorV = this.vetorV.gramSchmidt(this.vetorN);
        this.vetorN = this.vetorV.normaliza();
        var vetorU = this.vetorN.produtoVetorial(this.vetorV);
        this.matrix.push([vetorU.x, vetorU.y, vetorU.z]);
        this.matrix.push([this.vetorV.x, this.vetorV.y, this.vetorV.z]);
        this.matrix.push([this.vetorN.x, this.vetorN.y, this.vetorN.z]);
    };
    
    this.calibrarCamera();
}

var camera = null;

document.getElementById('camera').addEventListener('change', loadCamera, false);

function loadCamera(event){
    var file = event.target.files[0]; //so vai selecionar um arquivo
    var reader = new FileReader();
    reader.onload = (function(file) {
        return function(event){
            var count = 0;
            var entrada = [];
            var dados = this.result.split('\n');
            for (var c = 0; c < dados.length; c++) {
                var valores = dados[c].split(' ');
                for (var c1 = 0; c1 < valores.length; c1++) {
                    entrada.push(parseFloat(valores[c1]));
                }
            }

            var cameraPosition = new Ponto3D(entrada[count], entrada[count+1], entrada[count+2]);
            count += 3;
            var vetorN = new Vector(entrada[count], entrada[count+1], entrada[count+2]);
            count += 3;
            var vetorV = new Vector(entrada[count], entrada[count+1], entrada[count+2]);
            count += 3;
            var d = entrada[count];
            var hx = entrada[count+1];
            var hy = entrada[count+2];
            
            camera = new Camera(cameraPosition, vetorN, vetorV, d, hx, hy);
        };        
    })(file);
    reader.readAsText(file);
}