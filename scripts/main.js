/*var canvas;

function initCanvas(){
	width = document.getElementById('main').offsetWidth;
	height = document.getElementById('main').offsetHeight;
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	canvas.width = width;
	canvas.height = height;
}

initCanvas();
*/
function initInput(inputId) {
    var input = $(inputId)

    input.on('change', function(event) {
        return readData(event, inputId)  // quando você fizer algum select ele vai cair aqui e vai chamar read
    })  
}

initInput("#objeto");
initInput("#camera");
initInput("#iluminacao");

function readData(event, inputId) {
    var fileInput = event.target //pega o file input

    if (fileInput.files.length === 0) { 
        return console.error('Error: No file selected.')
    }

    var file = fileInput.files[0]  // caso você selecione mais de 1 file, so pegue a primeira
    readFile(file, saveData(inputId)) //chama funcao da registrar a file
}

var objetoData = undefined
var cameraData = undefined
var iluminacaoData = undefined

function saveData(inputId) {  //save data vai olhar de onde veio o file
    alert(fileReader.result)
    if (inputId == "#objeto") {
        objetoData = fileReader.result //se veio de object salvar nese arquivo e blablbalbla....
    } else if (inputId == "#camera") {
        cameraData = fileReader.result
    } else if (inputId == "#iluminacao") {
        iluminacaoData = fileReader.result
    } else {
        alert("Error! No destination input found.")
    } 
    
    console.log("objetoData: ", objetoData)
    console.log("cameraData: ", cameraData)
    console.log("iluminacaoData: ", iluminacaoData)
}

var fileReader = new FileReader()

function readFile(file, callback) {
    fileReader = new FileReader() //file reader inicializado
    fileReader.addEventListener("load", callback, false) // ação do input, quando ele fizer o load vamos chamar a função callback definida no readfile la em cima no caso será a savedata com id de qual dos 3 arquivos foi
    fileReader.readAsText(file)
}