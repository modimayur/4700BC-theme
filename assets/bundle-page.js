if (!customElements.get('bundle-product')) {
    customElements.define(
      'bundle-product',
  
      class BundleProduct extends HTMLElement {
        constructor() {
          super();
  
          this.addProductButtons = this.querySelectorAll('.add-product-btn');
          this.addedProductList = [];
          this.productBundleList = this.querySelector('.bundle__list');
          this.bundleProgressBar = this.querySelector('.bundle-progress-bar');
          this.messageBar = this.querySelector('.right-info');
          this.totalAmountWrapper = this.querySelector('.total-amount');
          this.addToCartButton = this.querySelector('.btn_bundle-add-cart');
          this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
          this.quantitySelector = this.querySelector('.quantity__input');
          
          /* update text details */
          this.limitReachMessage = this.bundleProgressBar.dataset.priceLimit;
          this.belowLimitMessage = this.bundleProgressBar.dataset.belowLimitText;
  
          /* amount configuration */
          this.priceLimit = this.bundleProgressBar.dataset.priceLimit;
          this.currentLimitReached = 0;
          this.differenceAmount = 0;
  
          this.addToCartButton.disabled = true;
          this.addToCartButton.addEventListener('click', this.handleAddToCartBundle.bind(this));
  
          this.addProductButtons.forEach((button) => {
            button.addEventListener('click', this.handleAddProductClick.bind(this));
          });
        }
  
        handleAddToCartBundle(event) {
          console.log(this.addedProductList);
          
          this.addToCartButton.setAttribute('aria-disabled', true);
          this.addToCartButton.classList.add('loading');
          this.querySelector('.loading__spinner').classList.remove('hidden');
  
          const config = fetchConfig('javascript');
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          delete config.headers['Content-Type'];
          
          const formData = new FormData();
          this.addedProductList.forEach((item) => {
            formData.append('items[][id]', item.variantId);
            formData.append('items[][quantity]', this.quantitySelector.value);
            formData.append('items[][properties][__bundle_id]', this.dataset.time);
          });
  
          if (this.cart) {
            formData.append(
              'sections',
              this.cart.getSectionsToRender().map((section) => section.id)
            );
            formData.append('sections_url', window.location.pathname);
            this.cart.setActiveElement(document.activeElement);
          }
          config.body = formData;
  
          fetch(`${routes.cart_add_url}`, config)
            .then((response) => response.json())
            .then((response) => {
              if (response.status) {
                this.handleErrorMessage(response.description);
  
                this.addToCartButton.setAttribute('aria-disabled', true);
                this.submitButtonText.classList.add('hidden');
                this.error = true;
                return;
              } else if (!this.cart) {
                window.location = window.routes.cart_url;
                return;
              }
  
              if (!this.error)
                publish(PUB_SUB_EVENTS.cartUpdate, {
                  source: 'product-form',
                  productVariantId: formData.get('id'),
                  cartData: response,
                });
              this.error = false;
              const quickAddModal = this.closest('quick-add-modal');
              if (quickAddModal) {
                document.body.addEventListener(
                  'modalClosed',
                  () => {
                    setTimeout(() => {
                      this.cart.renderContents(response);
                    });
                  },
                  { once: true }
                );
                quickAddModal.hide(true);
              } else {
                this.cart.renderContents(response);
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              this.addToCartButton.classList.remove('loading');
              if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
              if (!this.error) this.addToCartButton.removeAttribute('aria-disabled');
              this.querySelector('.loading__spinner').classList.add('hidden');
            });
        }
  
        handleErrorMessage(errorMessage = false) {
          if (this.hideErrors) return;
  
          this.errorMessageWrapper =
            this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
          if (!this.errorMessageWrapper) return;
          this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
  
          this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
  
          if (errorMessage) {
            this.errorMessage.textContent = errorMessage;
          }
        }
  
        handleAddProductClick(event){
          const product = event.target;
          const productData = {
            variantId : product.dataset.variantId,
            image : product.dataset.imageSrc,
            price : product.dataset.price,
            handle : product.dataset.handle
          };
          this.addProduct(productData);
        }
  
        renderBlock(){
          
          // const block = this.productBundleList.querySelector('.item-block:not(.filled)');
          this.productBundleList.querySelectorAll('.item-block').forEach((itemBlock) => {
            itemBlock.innerHTML = '';
            itemBlock.classList.remove('filled');
          });
          if(this.addedProductList.length == 12){
            this.addProductButtons.forEach((button) => {
              button.disabled = true;
            });
          }else{
            this.addProductButtons.forEach((button) => {
              button.disabled = false;
            });
          }
          if(this.addedProductList.length == 8 || this.addedProductList.length == 10 || this.addedProductList.length == 12){
            this.addToCartButton.disabled = false;
          }else{
            this.addToCartButton.disabled = true;
          }
          this.currentLimitReached = 0;
          this.addedProductList.forEach((product, index) =>{
            const block = this.productBundleList.querySelector('.item-block:not(.filled)');
            block.innerHTML = `<div class="bundle-item-product">
              <button class="remove-btn"><span class="remove-icon"></span></button>
              <div class="product-image-wrapper media media--transparent media--adapt" style="padding-top:100%;">
                <img src="${product.image}">
              </div>
            </div>`;
            this.currentLimitReached += parseInt(product.price);
            block.classList.add('filled');
            block.querySelector('.remove-btn').addEventListener('click', () => {
              this.addedProductList.splice(index, 1);
              this.renderBlock();
            });
          });
          this.differenceAmount = parseInt(this.priceLimit) - parseInt(this.currentLimitReached);
          // console.log(this.priceLimit, this.currentLimitReached, this.differenceAmount);
          this.renderProgressBar();
          this.updateMessage();
        }
  
        renderProgressBar(){
          const countPercentageAdded = (this.currentLimitReached / this.priceLimit) * 100;
          this.bundleProgressBar.querySelector('.progress').style.width = `${countPercentageAdded}%`;
        }
  
        updateMessage(){
          if(this.currentLimitReached >= this.priceLimit){
            this.messageBar.innerHTML = `<p>${this.limitReachMessage}</p>`
          }else{
            let message = `${this.belowLimitMessage}`;
            const newAmount = parseFloat(this.differenceAmount/100);
            message = message.replace('amount', `<strong>Rs. ${newAmount}</strong>`)
            this.messageBar.innerHTML = `<p>${message}</p>`;
            this.totalAmountWrapper.innerText = `Rs. ${this.currentLimitReached/100}`
          }
        }
  
        addProduct(productData){
          this.addedProductList.push(productData);
          this.renderBlock();
        }
  
      }
    );
  }
  