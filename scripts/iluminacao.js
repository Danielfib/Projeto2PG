function Iluminacao(pl, ka, ia, kd, od, ks, il, n){
    //construtor:
    this.pl = pl;
    this.ka = ka;
    this.ia = ia;
    this.kd = kd;
    this.od = od;
    this.ks = ks;
    this.il = il;
    this.n = n;
    
}

var iluminacao = null;

document.getElementById('iluminacao').addEventListener('change', loadIluminacao, false);

function loadIluminacao(event){
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
            
            var pl = new Ponto3D(entrada[count++], entrada[count++], entrada[count++]);
            var ka = entrada[count++];
            var ia = new Vector(entrada[count++], entrada[count++], entrada[count++]);
            var kd = entrada[count++];
            var od = new Vector(entrada[count++], entrada[count++], entrada[count++]);
            var ks = entrada[count++];
            var il = new Vector(entrada[count++], entrada[count++], entrada[count++]);
            var n = entrada[count++];
            
            iluminacao = new Iluminacao(pl, ka, ia, kd, od, ks, il, n);

            //posicao da luz em coordenadas de vista
            iluminacao.pl = camera.mudarSisCoordenadas(iluminacao.pl);
        };        
    })(file);
    reader.readAsText(file);

}