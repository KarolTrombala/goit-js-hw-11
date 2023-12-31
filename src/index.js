import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init({
    position: 'center-top',
  });

const API_URL = 'https://pixabay.com/api/?';
const API_KEY = '38252708-5f6067fe441253ed3ba76750b';

const inputEl = document.querySelector('input[name="searchQuery"]');
const btnEl = document.querySelector('button[type="submit"]');
const galleryEl = document.querySelector('.gallery');
// const loadMoreBtnEl = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

let page = 1;

const searchApi = async () => {
  return await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: inputEl.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  });
};

const loadApi = () => {
  searchApi()
    .then(response => {
      if (response.data.hits.length > 0 && inputEl.value !== '') {
        const totalHits = response.data.total;

        galleryEl.innerHTML = createGallery(response);

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        // loadMoreBtnEl.style.visibility = 'visible';
        // let lightbox = new SimpleLightbox('.gallery a');
        lightbox.refresh();
      } else {
        clear();
        // loadMoreBtnEl.style.visibility = 'hidden';
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      }
    })
    .catch(error => console.log(error));
};

btnEl.addEventListener('click', e => {
  e.preventDefault();
  loadApi();
});

const clear = () => {
  galleryEl.innerHTML = '';
};

const createGallery = response => {
  return response.data.hits
    .map(picture => {
      return `<div class="photo-card">
        <a href="${picture.largeImageURL}">
        <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" /></a>
          <div class="info">
            <p class="info-item"><b>Likes</b>
              ${picture.likes}
            </p>
            <p class="info-item"><b>Views</b>
              ${picture.views}
            </p>
            <p class="info-item"><b>Comments</b>
              ${picture.comments}
            </p>
            <p class="info-item"><b>Downloads</b>
              ${picture.downloads}
            </p>
          </div>
        </div>`;
    })
    .join('');
};

const loadMoreApi = () => {
  page++;
  searchApi().then(response => {
    galleryEl.insertAdjacentHTML('beforeend', createGallery(response));
    galleryEl.addEventListener('click', e => e.preventDefault());
    // let lightbox = new SimpleLightbox('.gallery a');
  
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

      // loadMoreBtnEl.style.visibility = 'hidden';

    if (response.data.total / page < 40) {
      // loadMoreBtnEl.style.visibility = 'hidden';
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    } 
    // else {
    //   loadMoreBtnEl.style.visibility = 'visible';
    // }
  });
};

// loadMoreBtnEl.addEventListener('click', e => {
//   loadMoreApi();
// });

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    loadMoreApi();
  }
});
