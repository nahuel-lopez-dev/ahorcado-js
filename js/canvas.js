/* Variables */
let ctx;
let canvas;
let palabra;
let letras = "QWERTYUIOPASDFGHJKLÑZXCVBNM";
let colorTecla = "#212529";
let colorMargen = "rgb(253, 103, 3)";
let inicioX = 200;
let inicioY = 300;
let lon = 35;
let margen = 20;
let pistaText = "";

/* Arreglos */
/** [] O new Array() es lo mismo */
let listaTeclas = [];
let listaLetras = [];
let listaPalabras = [];

/* Variables de control */
let aciertos = 0;
let errores = 0;

/** Selectores */
const iniciarJuego = document.querySelector("#iniciarJuego");
const nuevaPalabra = document.querySelector("#nuevaPalabra");
const agregarPalabra = document.querySelector("#agregarPalabra");

/* Palabras para el juego */
listaPalabras.push("TIGRE");
listaPalabras.push("CAMELLO");
listaPalabras.push("VACA");
listaPalabras.push("OVEJA");
listaPalabras.push("LEOPARDO");
listaPalabras.push("HIPOPOTAMO");
listaPalabras.push("CANCREJO");
listaPalabras.push("ZORRO");
listaPalabras.push("CACHALOTE");
listaPalabras.push("SUPERMAN");
listaPalabras.push("BATMAN");
listaPalabras.push("LUCIERNAGA");
listaPalabras.push("AHORCADO");
listaPalabras.push("FRONTEND");
listaPalabras.push("FULLSTACK");
listaPalabras.push("GITHUB");
listaPalabras.push("JAVASCRIPT");
listaPalabras.push("DAREDEVIL");

        
/***** clases *****/
class Tecla {
    constructor(x, y, ancho, alto, letra){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.letra = letra;
        this.dibuja = dibujaTecla;
    }
}

class Letra {
    constructor(x, y, ancho, alto, letra){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.letra = letra;
        this.dibuja = dibujaCajaLetra;
        this.dibujaLetra = dibujaLetra;
    }
}

/* Funciones que podría convertirlos a métodos dentro de las clases */
/***** Dibuja teclas *****/
function dibujaTecla(){
    ctx.fillStyle = colorTecla;
    ctx.strokeStyle = colorMargen;
    ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    ctx.strokeRect(this.x, this.y, this.ancho, this.alto);   
    ctx.fillStyle = "white";
    ctx.font = "bold 20px courier";
    ctx.fillText(this.letra, this.x+this.ancho/2-5, this.y+this.alto/2+5);
}
/***** Dibuja la letra *****/
function dibujaLetra(){
    var w = this.ancho;
    var h = this.alto;
    ctx.fillStyle = "black";
    ctx.font = "bold 40px Courier";
    ctx.fillText(this.letra, this.x+w/2-12, this.y+h/2+14);
}
/***** Dibuja la caja de la letra *****/
function dibujaCajaLetra(){
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    ctx.strokeRect(this.x, this.y, this.ancho, this.alto);
}
/*****  Distribuir nuestro teclado con sus letras respectivas al acomodo de nuestro array *****/
function teclado(){
    var ren = 0;
    var col = 0;
    var letra = "";
    var miLetra;
    var x = inicioX;
    var y = inicioY;
    for(var i = 0; i < letras.length; i++){
        letra = letras.substr(i,1);
        miLetra = new Tecla(x, y, lon, lon, letra);
        miLetra.dibuja();
        listaTeclas.push(miLetra);
        x += lon + margen;
        col++;
        if(col==10){
            col = 0;
            ren++;
            if(ren==2){
                x = 280;
            } else {
                x = inicioX;
            }
        }
        y = inicioY + ren * 50;
    }
}
/***** Obtiene una palabra aleatoriamente y la divide en letras *****/
function pintaPalabra(){
    // palabras_array.push("TIGRE");
    var p = Math.floor(Math.random()*listaPalabras.length);
    palabra = listaPalabras[p];
    // palabra = nuevaPalabra.value
    var w = canvas.width;
    var len = palabra.length;
    var ren = 0;
    var col = 0;
    var y = 230;
    var lon = 50;
    var x = (w - (lon+margen) *len)/2;
    for(var i=0; i<palabra.length; i++){
        var letra = palabra.substr(i,1);
        var miLetra = new Letra(x, y, lon, lon, letra);
        miLetra.dibuja();
        listaLetras.push(miLetra);
        x += lon + margen;
    }
}
/***** Va dibujando el ahorcado *****/
function horca(errores){
    var imagen = new Image();
    imagen.src = "imagenes/ahorcado"+errores+".jpg";
    imagen.onload = function(){
        ctx.drawImage(imagen, 0, 0, 230, 230);
    }
}
/***** ajusta coordenadas *****/
function ajusta(xx, yy){
    var posCanvas = canvas.getBoundingClientRect();
    var x = xx-posCanvas.left;
    var y = yy-posCanvas.top;
    return{x:x, y:y}
}
/***** Detecta tecla clickeada y la compara con las de la palabra ya elegida al azar *****/
function selecciona(e){
    var pos = ajusta(e.clientX, e.clientY);
    var x = pos.x;
    var y = pos.y;
    var tecla;
    var bandera = false;
    for (var i = 0; i < listaTeclas.length; i++){
        tecla = listaTeclas[i];
        if (tecla.x > 0){
            if ((x > tecla.x) && (x < tecla.x + tecla.ancho) && (y > tecla.y) && (y < tecla.y + tecla.alto)){
                break;
            }
        }
    }
    if (i < listaTeclas.length){
        for (var i = 0 ; i < palabra.length ; i++){ 
            var letra = palabra.substr(i, 1);
            if (letra == tecla.letra){ /* compara y ve si acerto la letra */
                caja = listaLetras[i];
                caja.dibujaLetra();
                aciertos++;
                bandera = true;
            }
        }
        if (bandera == false){ /* Si falla aumenta los errores y chequea si perdió para mandar a la funcion gameover */
            errores++;
            horca(errores);
            if (errores == 6) gameOver(errores);
        }
        /* Borra la tecla que se presionó */
        ctx.clearRect(tecla.x - 1, tecla.y - 1, tecla.ancho + 2, tecla.alto + 2);
        tecla.x - 1;
        /* Chequea si se gano y manda a la funcion gameOver */
        if (aciertos == palabra.length) gameOver(errores);
    }
}
/***** Borra las teclas y la palabra con sus cajas y se manda un msj segun el caso si se gano o se perdio *****/
function gameOver(errores){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    ctx.font = "bold 35px Courier";
    if (errores < 6){
        ctx.fillText("Ganaste ¡Felicidades!, la palabra es: ", 110, 280);
    } else {
        ctx.fillText("Game over!, la palabra era: ", 110, 280);
    }
    
    ctx.font = "bold 80px Courier";
    lon = (canvas.width - (palabra.length*48))/2;
    ctx.fillText(palabra, lon, 380);
    horca(errores);
}
/***** Desoculta e oculta el canvas para dar lugar al juego *****/
function iniciaJuego(){
    document.getElementById("pantalla").classList.toggle("hidden");
    document.getElementById("reiniciarJuego").classList.toggle("hidden");
}
/** Agrega palabras nuevas al array */
function agregaPalabra(){
    listaPalabras.push(nuevaPalabra.value)
    console.log(nuevaPalabra.value);
    console.log(listaPalabras);
    nuevaPalabra.value = '';
}


/***** Eventos *****/
iniciarJuego.addEventListener("click", iniciaJuego);
agregarPalabra.addEventListener("click", agregaPalabra);


/***** Detecta si se cargó el contexco en el canvas, e inicia las funciones necesarias para jugar, o se manda msj de error segun sea el caso *****/
window.onload = function(){
    canvas = document.getElementById("pantalla");
    if (canvas && canvas.getContext){
        ctx = canvas.getContext("2d");
        if(ctx){
            teclado();
            pintaPalabra();
            horca(errores);
            canvas.addEventListener("click", selecciona, false);
        } else {
            alert ("Error al cargar el contexto!");
        }
    }
}
