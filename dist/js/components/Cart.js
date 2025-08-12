import { settings,select,classNames,templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';
class Cart {
    constructor(element) {
      const thisCart = this;
      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();
      console.log('new Cart', thisCart);
    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    }
    initActions() {
      const thisCart = this;

      if (thisCart.dom.toggleTrigger) {
        thisCart.dom.toggleTrigger.addEventListener('click', function () {
          thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
        });
      }
      thisCart.dom.productList.addEventListener('updated',function(){
        thisCart.update();
      })
      thisCart.dom.productList.addEventListener('remove', function (event) {
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit', function (event) {
        event.preventDefault();      
        thisCart.sendOrder();         
      });
    }
    add(menuProduct) {
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
      console.log('adding product', menuProduct);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      console.log('thisCart.products', thisCart.products);
      thisCart.update();
    }
    update(){
      const thisCart = this;
      const deliveryFee = settings.cart.defaultDeliveryFee;
      let totalNumber = 0;
      let subtotalPrice = 0;
      for (let product of thisCart.products) {
        totalNumber += product.amount;
        subtotalPrice += product.price;
      }
      let totalPrice = 0;
      if (totalNumber > 0) {
        totalPrice = subtotalPrice + deliveryFee;
      }
      thisCart.totalNumber = totalNumber;
      thisCart.subtotalPrice = subtotalPrice;
      thisCart.totalPrice = totalPrice;
      thisCart.dom.deliveryFee.innerHTML = totalNumber > 0 ? deliveryFee : 0;
      thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
      thisCart.dom.totalNumber.innerHTML = totalNumber;

      for (let totalPriceElem of thisCart.dom.totalPrice) {
        totalPriceElem.innerHTML = totalPrice;
      }
      console.log('Cart updated:');
      console.log('Total number:', totalNumber);
      console.log('Subtotal price:', subtotalPrice);
      console.log('Delivery fee:', totalNumber > 0 ? deliveryFee : 0);
      console.log('Total price:', totalPrice);
    }
    remove(cartProduct) {
      const thisCart = this;
      cartProduct.dom.wrapper.remove();
      const index = thisCart.products.indexOf(cartProduct);
      if (index !== -1) {
        thisCart.products.splice(index, 1);
      }
      thisCart.update();
    }
    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;
      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: settings.cart.defaultDeliveryFee,
        products: [],
      };
      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      
      fetch(url, options)
        .then(function(response){
          return response.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse)
        })
      console.log('sendOrder called');
      console.log('Order payload:', payload);
    }
  }
  export default Cart;