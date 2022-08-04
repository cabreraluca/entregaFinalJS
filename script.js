let container = document.getElementById('proximosPartidos');
let prode = document.getElementById('prode');
const botonGuardar = document.getElementById('guardar');
let results;
const botonInicioSesion = document.getElementById('botonInicioSesion');
botonGuardar.onclick = function(){
    let inputsResultados = document.getElementsByClassName("prueba");
    console.log(inputsResultados);
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
    }
    localStorage.setItem('resultados', JSON.stringify(dictIdsRestultados));
    imprimirResultados();
};

console.log(localStorage.getItem('resultados'));
function imprimirResultados(){
    let resultadosCompletos = JSON.parse(localStorage.getItem('resultados'));
    let elementosHTML = document.getElementsByClassName('prode');
    for(let i = 0; i < elementosHTML.length; i++){
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
        console.log(results)
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
            const element = document.createElement('div');
            element.className = 'prode';
            element.innerHTML =`<p> ${dia}/${mes+1} - ${horario}:${minutos == "0" ? "00" : minutos }  // ${fechaTorneo} </p> <div class = "cartaPartido"> <p>${teams.home.name}<input id="${fixture.id}_local" class="prueba" type="number" placeholder="" required> vs <input id="${fixture.id}_visitante" class="prueba" type="number" placeholder="" required> ${teams.away.name} </p> <img src="${teams.home.logo}" alt=""> <img src="${teams.away.logo}" </div>`;
            prode.append(element);
        }
    }   
    )
	.catch(err => console.error(err));