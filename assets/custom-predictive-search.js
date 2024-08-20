document.addEventListener('DOMContentLoaded', () => {
    class CustomPredictivesearch extends HTMLElement {
        constructor() {
            super();
            this.input = this.querySelector('input[type="search"]');
            this.predictiveSearchResults = this.querySelector('#predictive-search');
            this.resultsContainer = this.querySelector('#search-results');
            this.suggestions = this.querySelector('.tegsuggestions');

            this.input.addEventListener(
                'input',
                this.debounce((event) => {
                    this.onChange(event);
                }, 300).bind(this)
            );
        }

        onChange() {
            const searchTerm = this.input.value.trim();
            if (!searchTerm.length) {
                //this.close();
                return;
            }
            this.getSearchResults(searchTerm);
        }
        getSearchResultsSuggestions(searchTerm) {
            fetch(`/search/suggest.json?q=${searchTerm}`)
                .then((response) => response.json())
                .then((data) => {
                    var queries = data.resources.results.queries;
                    if (queries.length > 0) {
                        console.log('queries', queries);
                        var resultsHtml = '<ul>';
                        queries.forEach(function (querie) {
                            //console.log('product title: ',product.title);
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
                    //this.resultsContainer.innerHTML = 'Error occurred while searching.';
                    console.error('Error:', error);
                });
        }
        getSearchResults(searchTerm) {
            this.resultsContainer.innerHTML = 'Loading...';
            fetch(`/search?q=${searchTerm}&section_id=product-search-range&view=product-search-range`).then((response) => {
                if (!response.ok) {
                    var error = new Error(response.status);
                    //this.close();
                    throw error;
                }
                return response.text();
            })
                .then((text) => {
                    // console.log('text',text);
                    //const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
                    const resultsMarkup = new DOMParser().parseFromString(text, 'text/html');
                    const resultsMarkupHTML = resultsMarkup.querySelector('#search-results').innerHTML
                    this.resultsContainer.innerHTML = resultsMarkupHTML;
                    if (this.resultsContainer.querySelector('.view-product-button')) {
                        this.resultsContainer.querySelector('.view-product-button').setAttribute('href', `/search?q=${searchTerm}`);
                    }
                    this.getSearchResultsSuggestions(searchTerm);
                    // console.log('resultsMarkup',resultsMarkupHTML);
                })
                .catch((error) => {
                    //this.close();
                    throw error;
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