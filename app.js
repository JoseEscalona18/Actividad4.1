const API = "https://api.dictionaryapi.dev/api/v2/entries/en/"
 
const inputPalabra = document.getElementById('palabra')
const boton = document.getElementById('boton')
const resultado = document.getElementById('resultado')
const darkMode = document.getElementById('Darkmode');
const fuentes = document.getElementById('Fuentes');
const body = document.body

function busquedaDebounce(func, delay){
  let timeoutId;
  return function(...args){
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(()=>{
      func.apply(this, args);
    }, delay);
  }
}

const buscar = busquedaDebounce(()=> {
  const Palabra = inputPalabra.value;
  fetch(`${API}${Palabra}`) 
    .then(res => res.json())
    .then(response => {
      const data = response[0];
      const definitions = data.meanings.map(meaning => meaning.definitions[0].definition);
      const sinonimos = data.meanings.flatMap(meaning => meaning.synonyms);
      const fonetica = data.phonetics.filter(texto => texto.text);
      const links = data.sourceUrls.filter(links => links.length > 0);
      const audioUrl = data.phonetics.filter(pronunciation => pronunciation.audio);

      //se agregan las foneticas a una variable string
      let textoFonetica = '';

      if (fonetica.length == 0){
        textoFonetica='No hay fonetica disponible en la API'
      }else {
        for (i = 0; i < fonetica.length; i++){
          if (i==1){
            textoFonetica=`${textoFonetica}<br> <b>Tambien:</b> `
          }
          textoFonetica = textoFonetica + ' ' + fonetica[i].text;
        }
      }

      //se agrega el boton de reproducir el audio


      //agregar informacion al html
      resultado.innerHTML = `
      <h2> ${data.word}</h2>
      <ul>
      ${definitions.map(definition => `<li>${definition}</li>`).join('')}
      <h3>Sinónimos:</h3>
      ${sinonimos.length 
        ? `<ul>${sinonimos.map(sinonimo => `<li>${sinonimo}</li>`).join('')}</ul>`
        : '<p>No hay sinónimos disponibles.</p>'
      }
      <h3>Fonética:</h3>
      <p>${textoFonetica}</p>
      </ul>
      <button id="reproducirAudio">Reproducir Audio</button>
      <div id="msg"> </div>
      <h3>Enlaces fuente:</h3>
      ${links.length 
        ? `<ul>${links.map(link => `<li><a href='${link}' target='_blank'>${link}</a></li>`).join('')}</ul>`
        : '<p>No hay enlaces disponibles.</p>'
      }
      `
      const reproducirAudio = document.getElementById('reproducirAudio');
      const msg = document.getElementById('msg');

      reproducirAudio.addEventListener('click', () => {

        if (audioUrl.length == 0){

          msg.textContent = 'No se encontraron audios en la API';
          msg.style.cssText = 'color: #8b0303; margin-top: 5px'
        }else {
          const audio = new Audio(audioUrl[0].audio);
          audio.play();
        }

      });

    })
    .catch(error => {
      if (Palabra.length > 0){
      resultado.innerHTML = `No se encontraron resultados para "${Palabra}"`
      } else {
        resultado.innerHTML = ``
      }
  });
    
}, 500);

inputPalabra.addEventListener('input', buscar)
boton.addEventListener('click', buscar)

fuentes.addEventListener('change', ()=> {
  const fuentesclass = fuentes.value

  if(body.classList.contains('Darkmode')){
    body.classList = ''
    body.classList.add('Darkmode', fuentesclass)
  } else {
    body.classList = ''
    body.classList.add(fuentesclass) 
  }
});


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.toggle('Darkmode');
    body.classList.contains('Darkmode')
    darkMode.value = 'Modo claro'
} else {
  darkMode.value = 'Modo oscuro'
    
}

darkMode.addEventListener('click',()=> {
  body.classList.toggle('Darkmode');
  if (body.classList.contains('Darkmode')){
    darkMode.value = 'Modo claro'
  } else darkMode.value = 'Modo oscuro'
});
