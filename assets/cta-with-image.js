if (!customElements.get('cta-with-image')) {
  customElements.define(
    'cta-with-image',

    class TabContent extends HTMLElement {
      constructor() {
        super();        

        this.onResize();
        
        window.addEventListener('resize', this.onResize);
      }

      onResize(){
        let topCurveHeight = document.querySelector('.section-before-curve-before').clientHeight;
        topCurveHeight = topCurveHeight - 1;
        document.querySelector('.section-before-curve-before').style.marginTop = '-'+topCurveHeight+'px';
      }
    }
  );
}
  