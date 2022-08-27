const root = document.querySelector(".grid-container");
const totalItem = document.querySelector(".totalItems");

const btnCart = document.querySelector(".btn-cart");
const cartArea = document.querySelector(".cart");
const tprice = document.querySelector(".tprice");
const tqty = document.querySelector(".tqty");
const cartProduct = document.querySelector(".cart-product");

btnCart.addEventListener("click", () => {
  cartArea.classList.toggle("showSideBar");
});

window.addEventListener("scroll", () => {
  cartArea.classList.value.includes("showSideBar") &&
    cartArea.classList.remove("showSideBar");
});

let cart = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

class Products {
  async getProducts() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error.message);
    }
  }
}

class UI {
  showProduct(product) {
    const { id, title, image, price } = product;

    return root.insertAdjacentHTML(
      "beforeend",
      `<div class="col-span-1" id=${id}>
              <div class="img-area">
                <img
                  src="${image}"
                  alt="${title}"
                />
              </div>
              <div class="description">
                <h2>${title}</h2>
                <h3>$${price}</h3>
                <button class="addToCart" data-id="${id}">
                add to cart
                </button>
              </div>
            </div> `
    );
  }

  getAddToCartBtn() {
    const cartBtn = document.querySelectorAll(".addToCart");
    cartBtn.forEach((btn) => {
      const id = btn.getAttribute("data-id");

      const isCartItem = cart.find((pd) => pd.id === id * 1);

      if (isCartItem) {
        btn.innerText = "in cart";
        btn.setAttribute("disabled", true);
        btn.style.cursor = "not-allowed";
        btn.style.backgroundColor = "#f5f5f5";
        btn.style.color = "#000";
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "in cart";
        event.target.setAttribute("disabled", true);
        event.target.style.cursor = "not-allowed";
        event.target.style.backgroundColor = "#f5f5f5";
        event.target.style.color = "#000";
        const product = Storage.getProductById(
          event.target.getAttribute("data-id") * 1
        );
        cart = [{ ...product, qty: 1 }, ...cart];

        Storage.saveCart(cart);
        this.calculateCart(cart);
      });
    });
  }

  calculateCart(cart) {
    const totalPrice = cart.reduce(
      (total, item) => total + item.qty * item.price,
      0
    );
    const totalQty = cart.reduce((total, item) => total + item.qty, 0);
    totalItem.innerText = totalQty;
    tqty.innerText = parseInt(totalQty.toFixed(2));
    tprice.innerText = parseInt(totalPrice.toFixed(2));
  }

  disPlayCartItems(cart) {
    cart.map((pd) => {
      const { title, price, qty, image } = pd;
      cartProduct.insertAdjacentHTML(
        "beforeend",
        `
     <figure class="cart-items">
                  <div class="CartProImg">
                    <img
                      src="${image}"
                      alt="${title}"
                    />
                  </div>
                  <div class="cartTitle">
                    <h3>${title.split(" ").slice(0, 3).join(" ")}</h3>
                    <h3>$${price}</h3>
                  </div>
                  <div class="cartQty">
                    <button><i class="fa-solid fa-angle-up"></i></button>
                    <span>${qty}</span>
                    <button><i class="fa-solid fa-angle-down"></i></button>
                  </div>
                  <div class="cartItemDelete">
                    <button><i class="fa-solid fa-xmark"></i></button>
                  </div>
                </figure>
    
    
    `
      );
    });
  }
}

class Storage {
  static saveProduct(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getProductById(id) {
    const product = [...JSON.parse(localStorage.getItem("products"))].find(
      (pd) => pd.id === id
    );

    return product;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const ui = new UI();

  products
    .getProducts()
    .then((products) => {
      products.map((product) => ui.showProduct(product));
      Storage.saveProduct(products);
      ui.calculateCart(cart);
    })
    .then(() => {
      ui.getAddToCartBtn();
      ui.disPlayCartItems(cart);
    });
});
