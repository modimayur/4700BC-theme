if (!customElements.get('find-gift')) {
  customElements.define(
    'find-gift',
    class FindGift extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.errorContainer = this.querySelector('.error-container');
        this.url = this.querySelector('form').action;
        this.filter1 = this.querySelector('.occasion-filter');
        this.filter2 = this.querySelector('.price-filter');

        this.querySelection = [];

        this.form.addEventListener('submit', this.handleFormSubmit.bind(this))
        this.filter1.addEventListener('change', this.handleOccasionChange.bind(this));
        this.filter2.addEventListener('change', this.handlePriceChange.bind(this));
      }
      
      handleFormSubmit(event){
        event.preventDefault();
        if(this.filter1.value == '' && this.filter2.value == ''){
          this.errorContainer.innerHTML = '<p>Please select any occasion or price range.</p>';
        }else{
          const querySelectionArr = this.querySelection.filter(selection => selection != undefined)
          const querySelection = querySelectionArr.join('&');
          location.href = `${this.url}?${querySelection}`;
        }
      }
      
      handleOccasionChange(evt) {
        let value = evt.target.value;
        if(value != ''){
          value = value.replace(' ', '+');
          this.querySelection[0] = `${evt.target.name}=${value}`;
        }
      }
      
      handlePriceChange(evt) {
        const value = evt.target.value;
        if(value != ''){
          const values = value.split('-');
          this.querySelection[1] = `${evt.target.name}.gte=${values[0]}&${evt.target.name}.lte=${values[1]}`;
        }
      }
    }
  );
}
