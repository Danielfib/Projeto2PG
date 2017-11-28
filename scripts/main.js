function calibrarCamera(){
    this.vetorV = vetorV.gramSchmidt(vetorN);
    this.vetorU = vetorV.produtoVetorial(vetorN);
}