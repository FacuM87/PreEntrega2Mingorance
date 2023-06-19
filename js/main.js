/*
alert("Bienvenido/a a la versión mejorada del simulador de inversiones a plazo fijo! \n\nTras las mejoras incorporadas podrás realizar no solo una simulación, sino todas las que desees. Los resultados quedarán almacenados y luego podrás acceder a los mismos ya sea buscando por nombre o plazo. \n\nComencemos!")
*/

class Inversion {
  constructor(nombre) {
    this.nombre = nombre
    this.capitalInicial = 0
    this.plazo = 0
    this.tasaNominalAnual = 0
    this.capitalFinal = 0
  }

  validarNombre(nombre){
    let nombreError=document.getElementById("nombreError")
    nombre !== "" ? (nombreError.innerHTML = "") : (nombreError.innerHTML = "Completa este campo")
    
    let inversionExistente = inversiones.find(inversion => inversion.nombre.toLowerCase() === nombre.toLowerCase())
    inversionExistente && (nombreError.innerHTML = "Favor de ingresar un nombre no ingresado anteriormente.") 

    if (nombre === "" || inversionExistente) {
      return false
    }
  }

  validarCapitalInicial(capitalInicial) {
    let montoError=document.getElementById("montoError")
    capitalInicial > 0 ? (montoError.innerHTML = "", this.capitalInicial = capitalInicial) : (montoError.innerHTML = "¡Ups! Monto inválido, ¿probamos de nuevo?")
  }
  
  validarPlazo(plazo) {
    let plazoError=document.getElementById("plazoError")
    plazo > 0 ? (plazoError.innerHTML = "", this.plazo=parseInt(plazo)) : (plazoError.innerHTML = "¡Ups! Plazo inválido, ¿probamos de nuevo?")
  }

  determinarTasaNominalAnual() {
    if (this.capitalInicial > 0 && this.capitalInicial < 500000) {
      this.tasaNominalAnual = 97
    } else if (this.capitalInicial >= 500000 && this.capitalInicial < 1000000) {
      this.tasaNominalAnual = 107
    } else if (this.capitalInicial >= 1000000) {
      this.tasaNominalAnual = 117
    }
  }

  calcularInteresSimple() {
    const interesPeriodo = this.capitalInicial * (this.tasaNominalAnual / 100) * (this.plazo / 365);
    this.capitalFinal = parseFloat(this.capitalInicial + interesPeriodo)
  }

  mostrarResultados() {
    limpiarResultadoAnterior("sectionSim","resultados")
    const sectionSim = document.getElementById("sectionSim")
    const divResultados = document.createElement("div")
    divResultados.id="resultados"
    divResultados.classList.add("cajaResultados")    
    sectionSim.appendChild(divResultados)
    divResultados.innerHTML = `
      <div>
        <p class="text-center mb-2">Muchas gracias ${this.nombre}. <br> A continuación los resultados:</p>
        <ul class="listaResultados">
          <li>Capital Invertido: $${this.capitalInicial}</li>
          <li>Plazo: ${this.plazo} días</li>
          <li>Tasa Nominal Anual: ${this.tasaNominalAnual}%</li>
          <li>Capital final: $${this.capitalFinal.toFixed(2)}</li>
        </ul>
      </div>
    `
  }
}

function limpiarResultadoAnterior(idSection, idDiv){
  const section = document.getElementById(idSection)
  const div = document.getElementById(idDiv)
  if (div && (div.parentNode === section)) {
    section.removeChild(div)
  }  
}

const inversiones = []

function simularInversion(nombre, capitalInicial, plazo){ 
  const inversion = new Inversion(nombre)
  inversion.validarNombre(nombre)
  inversion.validarCapitalInicial(capitalInicial)
  inversion.validarPlazo(plazo)
  inversion.determinarTasaNominalAnual()
  inversion.calcularInteresSimple()
  if (capitalInicial > 0 && plazo > 0 && inversion.validarNombre(nombre)!=false) {
    inversion.mostrarResultados() 
    inversiones.push(inversion) 
    guardarInversionesEnLS() 
  }
  console.log(inversiones)
}

function guardarInversionesEnLS() {
  localStorage.setItem("inversiones", JSON.stringify(inversiones))  
}

function traerInversionesDelLS() {
return JSON.parse(localStorage.getItem("inversiones"))
}

function traerInversionesDelLSalInicio() {
  const inversionesSesiónAnterior = traerInversionesDelLS();
  if (inversionesSesiónAnterior) {
    for (let i = 0; i < inversionesSesiónAnterior.length; i++) {
      inversiones.push(inversionesSesiónAnterior[i])
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  traerInversionesDelLSalInicio()
})

let boton=document.getElementById("simularInversion")
boton.addEventListener("click", (event) => {
  event.preventDefault()
  let nombre = document.getElementById("nombre").value
  let capitalInicial = parseFloat(document.getElementById("capitalInicial").value)
  let plazo = parseInt(document.getElementById("plazo").value)
  simularInversion(nombre, capitalInicial, plazo) 
})

let resetBtn=document.getElementById("resetBtn")
resetBtn.addEventListener("click", () => {
  localStorage.clear()
})

function mostrarResultadoBusqueda(resultado){
  limpiarResultadoAnterior("sectionBus","resultadosBus")
  const sectionBus=document.getElementById("sectionBus")
  const divResultadosBus = document.createElement("div")
  divResultadosBus.id="resultadosBus"
  divResultadosBus.classList.add("cajaResultadosBus")    
  sectionBus.appendChild(divResultadosBus)
  divResultadosBus.innerHTML = `
    <p class="text-center">Resultado de la búsqueda:</p>
    <ul class="listaResultados">
      <li>Nombre: ${resultado.nombre}</li>
      <li>Capital Inicial: $${resultado.capitalInicial}</li>
      <li>Plazo: ${resultado.plazo} días</li>
      <li>Tasa Nominal Anual: ${resultado.tasaNominalAnual}%</li>
      <li>Capital final: $${resultado.capitalFinal.toFixed(2)}</li>
    </ul>
    <button id="btnEliminarInversion" class="btn btn-primary mt-4">Eliminar inversión del registro</button> 
    `
  let btnEliminacionRegistro=document.getElementById("btnEliminarInversion")
  btnEliminacionRegistro.addEventListener("click", eliminarInversion)
}

function validarNombreBus(buscarNombre){
  let busquedaNombreError = document.getElementById("busquedaNombreError")

  if (buscarNombre === "") {
    busquedaNombreError.innerHTML = "Completa este campo"
    return false
  }

  //let inversiones = traerInversionesDelLS()

  let verificarNombre = inversiones.find(inversion => inversion.nombre.toLowerCase() === buscarNombre.toLowerCase());

  if (!verificarNombre) {
    busquedaNombreError.innerHTML = "No contamos con inversiones bajo ese nombre."
    return false
  }

  busquedaNombreError.innerHTML = ""
  return true
}

function buscarPorNombre() {
  let buscarNombre = document.getElementById("buscarNombre").value
  if (validarNombreBus(buscarNombre)===true) {
    let resultado = traerInversionesDelLS().find(inversion => inversion.nombre.toLowerCase() === buscarNombre.toLowerCase())
    mostrarResultadoBusqueda(resultado)    
  }
}

let btnBusqueda=document.getElementById("btnBusquedaNombre")
btnBusqueda.addEventListener("click", buscarPorNombre)

function eliminarInversion(){ 
  let nombreInversion = document.getElementById("buscarNombre").value
  let index = inversiones.indexOf(inversion => inversion.nombre === nombreInversion)
  inversiones.splice(index, 1)
  guardarInversionesEnLS()  
}

function resumenSimulaciones(){
  let inversionesResumen=traerInversionesDelLS()
  contenido=""
  inversionesResumen.forEach(inversion => {
    contenido+= `
      <div class="cajaResultadosBus">
        <p class="text-center">Simulación de ${inversion.nombre}</p>
        <ul class="listaResultados">
          <li>Capital Inicial: $${inversion.capitalInicial}</li>
          <li>Plazo: ${inversion.plazo} días</li>
          <li>Tasa Nominal Anual: ${inversion.tasaNominalAnual}%</li>
          <li>Capital final: $${inversion.capitalFinal.toFixed(2)}</li>
        </ul>
      </div>
    `
  })
  document.getElementById("resumenSimulaciones").innerHTML=contenido
}

let btnResumen=document.getElementById("resumen")
btnResumen.addEventListener("click", resumenSimulaciones)



/*
----------------------------------------------


class Inversion {
  constructor(nombre) {
    this.nombre = nombre
    this.capitalInicial = 0
    this.plazo = 0
    this.tasaNominalAnual = 0
    this.capitalFinal = 0
  }

  ingresarCapitalInicial() {
    let capitalInicial = parseFloat(prompt("Comentanos, ¿cuánto dinero te gustaría invertir?"))
    while (capitalInicial <= 0 || isNaN(capitalInicial)) {
      capitalInicial = parseFloat(prompt("¡Ups! Ingresaste un monto inválido, probemos de nuevo. ¿Cuánto dinero te gustaría invertir?"))
    }
    this.capitalInicial = capitalInicial
  }

  ingresarPlazo() {
    let plazo = parseInt(prompt("¿Cuántos días quisieras dejar el capital invertido?"));
    while (plazo <= 0 || isNaN(plazo)) {
      plazo = parseInt(prompt("¡Ups! Ingresaste un carácter inválido, probemos de nuevo. ¿Cuántos días quisieras dejar el capital invertido?"))
    }
    this.plazo = plazo
  }

  determinarTasaNominalAnual() {
    if (this.capitalInicial > 0 && this.capitalInicial < 500000) {
      this.tasaNominalAnual = 97
    } else if (this.capitalInicial >= 500000 && this.capitalInicial < 1000000) {
      this.tasaNominalAnual = 107
    } else if (this.capitalInicial >= 1000000) {
      this.tasaNominalAnual = 117
    }
  }

  calcularInteresSimple() {
    let interesPeriodo = this.capitalInicial * (this.tasaNominalAnual / 100) * (this.plazo / 365);
    this.capitalFinal = parseFloat(this.capitalInicial + interesPeriodo)
  }

  mostrarResultados() {
    alert(this.nombre + ", muchas gracias por la información brindada. A continuación los resultados: \n\n" +"Capital Invertido: $" + this.capitalInicial + "\n" + "Plazo: " + this.plazo + " días" + "\n" + "Tasa Nominal Anual: " + this.tasaNominalAnual + "%" + "\n" + "Capital final: $" + this.capitalFinal.toFixed(2))
  }
}

// Array de almacenamiento de objetos (inversiones), ejecución de los métodos y salida del array por consola 

const inversiones = []

function simularInversion(){ 
  let nombre = prompt("Ingrese su nombre")
  const inversion = new Inversion(nombre)
  inversion.ingresarCapitalInicial()
  inversion.ingresarPlazo()
  inversion.determinarTasaNominalAnual()
  inversion.calcularInteresSimple()
  inversion.mostrarResultados()
  inversiones.push(inversion)
}

console.log(inversiones)

// Funciones de filtro y búsqueda 

function buscarPorNombre(nombre) {
  return inversiones.find((inversion) => inversion.nombre.toLowerCase() === nombre.toLowerCase())
}

function filtrarPorPlazo(plazo) {
  return inversiones.filter((inversion) => inversion.plazo === plazo)
}

// Menú

function menu() {
  let opciones = parseInt(prompt("\n¿Qué acción desea realizar?: \n\n1. Simular una inversión\n2. Buscar inversiones por nombre\n3. Buscar inversiones por plazo\n4. Salir \n"));

  switch (opciones) {
    case 1:
      simularInversion()
      menu()
      break
    case 2:
      let nombreBusqueda = prompt("Ingrese nombre para la búsqueda")
      let inversionEncontrada = buscarPorNombre(nombreBusqueda)
      if (inversionEncontrada) {
        let mensaje= `Nombre: ${inversionEncontrada.nombre} \nCapital Inicial: $${inversionEncontrada.capitalInicial} \nPlazo: ${inversionEncontrada.plazo} \nTNA: ${inversionEncontrada.tasaNominalAnual}% \nCapital Final: $${inversionEncontrada.capitalFinal.toFixed(2)}`
        alert(mensaje)
      } else {
        alert("No se encontraron inversiones con el nombre indicado.")
      }
      menu()
      break
    case 3:
      let plazoBusqueda = parseInt(prompt("Ingrese el plazo para la búsqueda"))
      let inversionesFiltradas = filtrarPorPlazo(plazoBusqueda)
      if (inversionesFiltradas.length > 0) {
        let listado = "Inversiones Encontradas: \n\n"
        inversionesFiltradas.forEach(item => {
          listado += `Nombre: ${item.nombre} \nCapital Inicial: $${item.capitalInicial}\nPlazo: ${item.plazo} días \nTNA: ${item.tasaNominalAnual}% \nCapital Final: $${item.capitalFinal.toFixed(2)}\n\n` 
      })
        alert(listado) 
      } else {
        alert("No se encontraron inversiones con el plazo indicado.")
      }
      menu()
      break
    case 4:
      alert("\nGracias por elegirnos! \nTe esperamos nuevamente! :) \n\nSaludos!")
      break
    default:
      alert("Ingresaste una opción inválida :( \n\n Probemos de nuevo!")
      menu()
  }
}

menu()
*/