
const bar= document.getElementById('bar');
const close= document.getElementById('close');
const nav=document.getElementById('navbar');

if(bar){
    bar.addEventListener('click', ()=>{
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click', ()=>{
        nav.classList.remove('active');
    })
}



// variables and constants
const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');
let cartItemID = 1;
let Quantity = 1;

eventListeners();

// all event listeners
function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });
    // toggle navbar when toggle button is clicked
    // document.querySelector('.navbar-toggler').addEventListener('click', () => {
    //     document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
    // });

    // show/hide cart container
    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });

    // add to cart
    productList.addEventListener('click', purchaseProduct);

    // delete from cart
    cartList.addEventListener('click', deleteProduct);
}

// update cart info
function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

var file;

// load product items content form JSON file
function loadJSON(){
    fetch('../json/products.json')
    .then(response => response.json())
    .then(data =>{
        let html = '';
        file=data;
        data.forEach(product => {
            html += `
                <div class = "product-item">
                    <div class = "product-img">
                        <img src = "${product.imgSrc}" alt = "product image">
                        <button type = "button" class = "add-to-cart-btn">
                        Add To <i class = "fas fa-shopping-cart"></i>
                        </button>
                    </div>
                    <div class = "product-content">
                        <h3 class = "product-name">${product.name}</h3>
                        <span class = "product-category">${product.category}</span>
                        <p class = "product-price">$${product.price}</p>
                    </div>
                </div>
            `;
        });
        productList.innerHTML = html;
        // console.log(file);
    })
 
}

function sorting(id){
    let product1=file;
    console.log(product1);
    if(id.match('asc'))
    {
        product1.sort((a,b) => a.price-b.price);
    }
    else{
        product1.sort((a,b) => b.price-a.price);
    }
    console.log(product1);
    let html='';
    product1.forEach(product => {
        html += `
            <div class = "product-item">
                <div class = "product-img">
                    <img src = "${product.imgSrc}" alt = "product image">
                    <button type = "button" class = "add-to-cart-btn">
                    Add To <i class = "fas fa-shopping-cart"></i>
                    </button>
                </div>
                <div class = "product-content">
                    <h3 class = "product-name">${product.name}</h3>
                    <span class = "product-category">${product.category}</span>
                    <p class = "product-price">$${product.price}</p>
                </div>
            </div>
        `;
    });
    productList.innerHTML = html;
}

function filterByName(name){
    let name1=file;
    name1=name1.filter(x=>x.category==name);
    console.log(name1);
    let html='';

    name1.forEach(product => {
        html += `
            <div class = "product-item">
                <div class = "product-img">
                    <img src = "${product.imgSrc}" alt = "product image">
                    <button type = "button" class = "add-to-cart-btn">
                    Add To <i class = "fas fa-shopping-cart"></i>
                    </button>
                </div>
                <div class = "product-content">
                    <h3 class = "product-name">${product.name}</h3>
                    <span class = "product-category">${product.category}</span>
                    <p class = "product-price">$${product.price}</p>
                </div>
            </div>
        `;
    });
    productList.innerHTML = html;
}

// CART PAGE SEPARATE CODE

function loadCartPage(){
    let totalCost = 0;
    let html='';
    let cartitems=JSON.parse(localStorage.getItem('products'));
    cartitems.forEach(product => {
        html += `
            <div class = "productitem">
                <div class = "productimg">
                    <img src = "${product.imgSrc}" alt = "product image">

                </div>
                <div class = "productcontent">
                    <h3 class = "productname">${product.name}</h3>
                    <span class = "productcategory">${product.category}</span>
                    <div class="adder"><a onclick = "">+</a></div>
                    <p class = "Quantity">1</p>
                    <div class="subtract"><a onclick = "">-</a></div>
                    <p class = "productprice">${product.price}</p>
                    <a class="removeCartitem" onclick = "deletecartproduct(${product.id});"href="#">Remove From Cart</a>
                </div>
            </div>
        `;
        console.log(product.price);
        totalCost += parseFloat(product.price.substr(1));
        localStorage.setItem('totalCost',totalCost);
    });
   
    document.querySelector('.cartlist').innerHTML=html;
    let total =localStorage.getItem('totalCost');
    let pro = JSON.parse(localStorage.getItem('products'));
    if(pro.length == 0)
    total = 0;
    html = "";
    html += `

    <h3>Total: $ ${total.toString()}</h3>
    <span id="cart-total-value"></span>
    <span id="purchase-span"><button id="purchase-btn" onclick = "Alert('Your order has been placed.')">Purchase Order</button></span>`;
  console.log(html);
  
  document.querySelector('#cart-total').innerHTML = html;
  updateCartInfo();

    
}
function Alert(message){
    // console.log("reached");
    //  alert(message);
    if(confirm(alert(message))){
        localStorage.clear();
        window.location.href  = "../index.html";
    }
}

function deletecartproduct(id){
    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== id;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
 
    updateCartInfo();
    loadCartPage();

}



// purchase product
function purchaseProduct(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

// get product info after add to cart button click
function getProductInfo(product){
    console.log(product);
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent,
        quant: Quantity 
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

// add the selected product to the cart list
function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src = "${product.imgSrc}" alt = "product image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${product.name}</h3>
            <span class = "cart-item-category">${product.category}</span>
            <span class = "cart-item-price">${product.price}</span>
        </div>
        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

// save the product in the local storage
function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

// get all the products info if there is any in the local storage
function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // returns empty array if there isn't any product info
}

// load carts product
function loadCart(){
    console.log("I am here");
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; // if there is no any product in the local storage
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // else get the id of the last product and increase it by 1
    }
    products.forEach(product => addToCartList(product));

    // calculate and update UI of cart info 
    updateCartInfo();

}

// calculate total price of the cart and other info
function findCartInfo(){
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); // removing dollar sign
        return acc += price;
    }, 0); // adding all the prices

    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}

// delete product from cart list and local storage
function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
    updateCartInfo();




    // PART 2 SHOP.JSON 


}

// Owlcarousel
$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        loop:true,
      margin:10,
      nav:true,
      autoplay:true,
      autoplayTimeout:3000,
      autoplayHoverPause:true,
      center: true,
      navText: [
          "<i class='fa fa-angle-left'></i>",
          "<i class='fa fa-angle-right'></i>"
      ],
      responsive:{
          0:{
              items:1
          },
          600:{
              items:1
          },
          1000:{
              items:3
          }
      }
    });
  });





