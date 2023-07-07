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
      </ul>`
  
    })
    .catch(error => {resultado.innerHTML = `No se encontraron resultados para ${Palabra}`});
    
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

darkMode.addEventListener('click',()=> {
  body.classList.toggle('Darkmode');
  if (body.classList.contains('Darkmode')){
    darkMode.textContent = 'Modo claro'
  } else darkMode.textContent = 'Modo Oscuro'
});
