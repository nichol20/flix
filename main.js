import {
  API_KEY, BASE_URL,
  IMG_URL,
  language,
} from './api.js'

const LoadingScreen = {
  loadingScreen: document.querySelector('.loading-screen'),
  movieElement: document.querySelector('.movie'),

  startLoadingScreen(){
    LoadingScreen.loadingScreen.classList.add('active')
    LoadingScreen.movieElement.classList.add('loading')
  },

  closeLoadingScreen(){
    LoadingScreen.loadingScreen.classList.remove('active')
    LoadingScreen.movieElement.classList.remove('loading')
  }
}

const setRandomNumber = {
  async withLastId(){
    const lastMovie = await fetch(`${BASE_URL}latest?${API_KEY}&${language}`)
    const dataLastMovie = await lastMovie.json()
    const lastId = dataLastMovie.id
    const randomNumber = Math.floor(Math.random() * (lastId - 1) + 1)

    return randomNumber
  },

  withinALimit(){
    const max = 5000
    const min = 1
    const randomNumber = Math.floor(Math.random() * (max - min) + min)

    return randomNumber
  }
}

function animateButton() {
  
  changeMovieButton.classList.add('active')

  setTimeout(() => changeMovieButton.classList.remove('active'), 200)
}

async function getMovie(){
  try {
    LoadingScreen.startLoadingScreen()

    //const randomNumber = await setRandomNumber.withLastId()
    const randomNumber = setRandomNumber.withinALimit()

    const response = await fetch(`${BASE_URL}${randomNumber}?${API_KEY}&${language}`)
    const data = await response.json()

    
    //If the movie is not found
    if(data.status_code === 34){
      await getMovie()
      return
    }
    
    const poster = data.poster_path == null ? `./assets/imageNotFound.png` : `${IMG_URL}${data.poster_path}`
    const overview = data.overview == null || data.overview == "" ? 'No description' : data.overview
    const title = data.original_title == null || data.original_title == "" ? 'No title' : data.original_title
    
    const movie = document.querySelector('.movie')
    
    movie.innerHTML = `
    <img src="${poster}" alt="Capa do filme">
    <div class="description">
      <h2>${title}</h2>
      <p>${overview}</p>
    </div>
    `
    LoadingScreen.closeLoadingScreen()
  } catch (error) {
    console.log(error)
  }
}

const changeMovieButton = document.querySelector('.change-movie-button')
changeMovieButton.addEventListener('click', animateButton)
changeMovieButton.addEventListener('click', await getMovie)
