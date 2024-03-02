console.log ("hola mundo")

let a = 23;
let b = 5;
let c = a + b;
let isWorking = true;
const arreglo = ["maria", "josé"];

console.log ({a,b,c});
console.log (a);

console.log (typeof isWorking);

console.log(arreglo.length)

const encontrar = arreglo.filter (elemento=> elemento == "maria");
console.log (encontrar);

const objeto = {
    nombre: "ana",
    edad: "41",
    nacionalidad: "brasil",
}

// cambia la propiedad
objeto.nombre = "juana";
console.log (objeto);

//borra la propiedad
delete objeto.nacionalidad;
console.log (objeto);

console.log(objeto.nacionalidad);
console.log (objeto["edad"]);

// muestra las claves del objeto y Objet.values imprime los valores
const clave = Object.getOwnPropertyNames(objeto);
console.log (clave);

//si no pongo un return en la función, imprime undefined, porque no regresa nada
const saludar = (nombre) =>{
    console.log("hola, " + nombre)
    return 7;
}

let alo = saludar ("ana");

console.log (alo);

let m = 1;
let n = 2;
let z;

const suma = () => {
    z = m + n;
    return z;
}
console.log (suma());

// como hay solo una linea de código se puede omitir el return
//esta forma es más escalável
const multi = (valor1,valor2) => valor1*valor2;

console.log (multi(3,3));

const nombre = "ana";
const país = "brasil";

console.log(`Hola, soy ${nombre}, de ${país}. ${3*3}`);

