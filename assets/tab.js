if (!customElements.get('tab-content')) {
  customElements.define(
    'tab-content',

    class TabContent extends HTMLElement {
      constructor() {
        super();

        this.tab = this.querySelectorAll('.tab-button');
        this.contents = this.querySelectorAll('.tab-data-content');

        this.tab.forEach((t) => {
          t.addEventListener('click', this.handleTabClick.bind(this));
        })
      }

      handleTabClick(event){
        this.tab.forEach(t => t.classList.remove('active'));
        var content = event.target.dataset.tab;
        event.target.classList.add('active');
        this.contents.forEach(c => c.classList.remove('active'));
        if(content != null){
          this.querySelector(`#${content}`).classList.add('active');
        }
      }

    }
  );
}
