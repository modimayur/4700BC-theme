document.addEventListener('DOMContentLoaded', () => {
    class CustomPredictivesearch extends HTMLElement {
        constructor() {
            super();
            this.input = this.querySelector('input[type="search"]');
            this.predictiveSearchResults = this.querySelector('#predictive-search');
            this.resultsContainer = this.querySelector('#search-results');
            this.suggestions = this.querySelector('.tegsuggestions');
            this.swiperMainSlider = null;

            this.input.addEventListener(
                'input',
                this.debounce((event) => {
                    this.onChange(event);
                }, 300).bind(this)
            );
            this.sliderInit();
        }
        
        sliderInit() {
            this.swiperMainSlider = new Swiper(this.resultsContainer, {
              loop: false,
              slideToClickedSlide: true,
              speed: 1000,
              centeredSlides: true,
              spaceBetween: 8,
              slidesPerView: 2,
              breakpoints: {
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
              },
            });
        }

        updateSlider() {
            if (this.swiperMainSlider) {
                this.swiperMainSlider.destroy(true, true); // Destroy the existing instance
            }
            this.sliderInit(); // Reinitialize the swiper with the updated slides
        }

        onChange() {
            const searchTerm = this.input.value.trim();
            if (!searchTerm.length) {
                return;
            }
            this.getSearchResults(searchTerm);
        }

        getSearchResults(searchTerm) {
            this.resultsContainer.innerHTML = 'Loading...';
            fetch(`/search?q=${searchTerm}&section_id=product-search-range&view=product-search-range`).then((response) => {
                if (!response.ok) {
                    var error = new Error(response.status);
                    throw error;
                }
                return response.text();
            })
                .then((text) => {
                    const resultsMarkup = new DOMParser().parseFromString(text, 'text/html');
                    const resultsMarkupHTML = resultsMarkup.querySelector('#search-results').innerHTML;
                    this.resultsContainer.innerHTML = resultsMarkupHTML;
                    this.updateSlider(); // Update the slider after new slides are loaded
                    this.getSearchResultsSuggestions(searchTerm);
                })
                .catch((error) => {
                    throw error;
                });
        }

        getSearchResultsSuggestions(searchTerm) {
            fetch(`/search/suggest.json?q=${searchTerm}`)
                .then((response) => response.json())
                .then((data) => {
                    var queries = data.resources.results.queries;
                    if (queries.length > 0) {
                        var resultsHtml = '<ul>';
                        queries.forEach(function (querie) {
                            resultsHtml +=
                                '<li class="querie-iteam"><a href="' + querie.url + '">' + querie.styled_text + '</a></li>';
                        });
                        resultsHtml += '</ul>';
                        this.suggestions.innerHTML = resultsHtml;
                        this.suggestions.classList.remove('hidden');
                    } else {
                        this.suggestions.classList.add('hidden');
                    }

                })
                .catch(function (error) {
                    console.error('Error:', error);
                });
        }

        debounce(fn, wait) {
            let t;
            return (...args) => {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), wait);
            };
        }
    }
    customElements.define('custom-predictive-search', CustomPredictivesearch);
});
