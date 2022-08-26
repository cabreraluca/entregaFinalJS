let container = document.getElementById('proximosPartidos');
let listado = document.querySelector('.listado');
const botonGuardar = document.getElementById('guardar');
let results;
const botonEditar = document.getElementById('editar');
const botonInicioSesion = document.getElementById('botonInicioSesion');
botonEditar.onclick = editarProde;
botonGuardar.onclick = guardarProde;
function guardarProde(){
    let inputsResultados = document.getElementsByClassName("prueba");
    let dictIdsRestultados = [];
    let contador = 0;
    let partidoId = "";
    for (let i = 0; i < inputsResultados.length; i++){
        if(contador == 0){
            partidoId = inputsResultados[i].id.slice(0, 6);
            let resultadoLocal = Number(inputsResultados[i].value);
            dictIdsRestultados.push({'id': partidoId, 'resultadoLocal': resultadoLocal, 'resultadoVisitante': 0});
            contador += 1;
        }
        else{
            let resultadoVisitante = Number(inputsResultados[i].value);
            for(let j = 0; j < dictIdsRestultados.length; j++){
                if(dictIdsRestultados[j]['id'] == partidoId){
                    dictIdsRestultados[j]['resultadoVisitante'] = resultadoVisitante;
                }
            }
            contador = 0;
        }
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Guardado con éxito',
            showConfirmButton: false,
            timer: 2500
          })
    }
    localStorage.setItem('resultados', JSON.stringify(dictIdsRestultados));
    imprimirResultados();
};

function imprimirResultados(){
    let resultadosCompletos = JSON.parse(localStorage.getItem('resultados'));
    let elementosHTML = document.getElementsByClassName('prode');
    if(!resultadosCompletos || resultadosCompletos.length === 0){
        return
    }
    for(let i = 0; i < resultadosCompletos.length; i++){
        botonGuardar.style.display = 'none';
        botonEditar.style.display = 'inline-block';
        teamsActuales = results[i].teams;
        let resultadoHome = resultadosCompletos[i].resultadoLocal;
        let resultadoAway = resultadosCompletos[i].resultadoVisitante;
        const date = new Date(results[i].fixture.date);
        let dia = date.getDate();
        let mes = date.getMonth();
        let horario = date.getHours();
        let minutos = date.getMinutes();
        let fechaTorneo = results[i].league.round;
        elementosHTML[i].innerHTML = `<p> ${dia}/${mes+1} - ${horario}:${minutos == "0" ? "00" : minutos }  // ${fechaTorneo} </p> <div class = "cartaPartido"> <p>${teamsActuales.home.name} <p>  ${resultadoHome}  </p>  vs  <p>  ${resultadoAway}  </p> ${teamsActuales.away.name} </p> <img src="${teamsActuales.home.logo}" alt=""> <img src="${teamsActuales.away.logo}" </div>`;
    }
};
function editarProde(){
    botonGuardar.style.display = 'inline-block';
    botonEditar.style.display = 'none';
    mostrarInputs(results);
}
function mostrarInputs(results){
    while (listado.firstChild) {
        listado.removeChild(listado.firstChild);
      }
    for (const partido of results) {
        const { teams } = partido;
        const { fixture } = partido;
        const { league } = partido;
        const date = new Date(fixture.date);
        let dia = date.getDate();
        let mes = date.getMonth();
        let horario = date.getHours();
        let minutos = date.getMinutes();
        let fechaTorneo = league.round;
        prodeDiv = document.createElement('div');
        prodeDiv.className = 'prode';
        prodeDiv.innerHTML =`<p> ${dia}/${mes+1} - ${horario}:${minutos == "0" ? "00" : minutos }  // ${fechaTorneo} </p> <div class = "cartaPartido"> <p>${teams.home.name}<input id="${fixture.id}_local" class="prueba" type="number" placeholder="" required> vs <input id="${fixture.id}_visitante" class="prueba" type="number" placeholder="" required> ${teams.away.name} </p> <img src="${teams.home.logo}" alt=""> <img src="${teams.away.logo}" </div>`;
        listado.append(prodeDiv);
    }
}
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9dfb6d14eemsh22e972b59724fbdp10a60ejsn1e83f6437d12',
		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};

fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?league=128&season=2022&next=10&status=NS', options)
	.then(respuesta => {
        return respuesta.json();
    })
	.then(partidosResults => {
        results = partidosResults.response;
        mostrarInputs(results);
        imprimirResultados();
    }  
    )
	.catch(err => err(err));