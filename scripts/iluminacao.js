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
    
    //console.log(pl);
    //console.log(ka);
    //console.log(ia);
    //console.log(kd);
    //console.log(od);
    //console.log(ks);
    //console.log(il);
    //console.log(n);
    
}

var iluminacao;

document.getElementById('iluminacao').addEventListener('change', loadIluminacao, false);

function loadIluminacao(event){
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
            
            //usar ponto3d e vetor quando der
            //por enquanto usando array
            var pl = [entrada[count++], entrada[count++], entrada[count++]];
            var ka = entrada[count++];
            var ia = [entrada[count++], entrada[count++], entrada[count++]];
            var kd = entrada[count++];
            var od = [entrada[count++], entrada[count++], entrada[count++]];
            var ks = entrada[count++];
            var il = [entrada[count++], entrada[count++], entrada[count++]];
            var n = entrada[count++];
            
            iluminacao = new Iluminacao(pl, ka, ia, kd, od, ks, il, n);
        };        
    })(file);
    reader.readAsText(file);

}