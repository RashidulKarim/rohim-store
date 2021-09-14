//load data onLoad
const loadProducts = () => {
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => showProducts(data));
};
loadProducts();

// search by catagory && get data by fetch 
const search = () => {
  const searchField = document.getElementById('search-field');
  const errorField = document.getElementById('searchError');
  const searchFieldvalue = searchField.value;
  searchField.value = '';
  if(searchFieldvalue){
    errorField.textContent = '';
    const url = `https://fakestoreapi.com/products/category/${searchFieldvalue}`;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    if(!data.length){
      document.getElementById("all-products").textContent = '';
      errorField.innerHTML = `Didn't find any product for ${searchFieldvalue}.`
    }
    else{
      showProducts(data)
    }
  })
  }else{
    errorField.innerText = 'Please write your favorite categoty to get result'
  }
}


// show all product in UI 
const showProducts = (products) => {   
  const allProductsArea = document.getElementById("all-products");
  allProductsArea.textContent = ''; 
  for (const product of products) {
    const image = product.image;
    const ratting = product.rating.rate;
    console.log(ratting);
    
    let star = '';
    let count = 0;
    for(i=0; i<5;i++){
      if(Math.floor(ratting)>i){
        star += '<i class="fas fa-star"></i>'
      }
      else if (ratting.toString().includes(".") && count ===0){
        star += '<i class="fas fa-star-half-alt"></i>'
        count++
      }
      else{
        star += '<i class="far fa-star"></i>'
      }
    }
    
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `<div class="single-product">
      <div>
    <img class="product-image" src=${image}></img>
      </div>
      <h2 class='product-title'>${product.title.slice(0,20)}</h2>
      <p>Category: ${product.category}</p>
      <p>Ratting: <span class='ratting'>${star} (${ratting})</i>.
      </span></p>
      <p><i class="fas fa-user"></i> ${product.rating.count} rated the product.</p>
      <h3>Price: $ ${product.price}</h3>
      <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
      <button id="details-btn" data-toggle="modal" data-target="#myModal" onclick=loadDetails(${product.id}) class="btn btn-danger">Details</button>
      </div>
      `;
    allProductsArea.appendChild(div);
  }
};
let count = 0;
const totalProducts = document.getElementById("total-Products");
const orderCompleteMassage = document.getElementById("orderCompleteMassage");
// add product to cart 
const addToCart = (id, price) => {
  orderCompleteMassage.innerText = '';
  count = count + 1;
  updatePrice("price", price);
  updateTaxAndCharge();
  updateTotal();
  totalProducts.innerText = count;
};

const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const previousProductPrice = getInputValue(id);
  const currentProductPrice = parseFloat(value);
  const total = previousProductPrice  + currentProductPrice;
  document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = value.toFixed(2);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const price = getInputValue("price");
  if (price > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", price * 0.2);
  }
  if (price > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", price * 0.3);
  }
  if (price > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", price * 0.4);
  }
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal =
    getInputValue("price") + getInputValue("delivery-charge") +
    getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal.toFixed(2);
};


//buy now btn 

const completeOrder = () => {
  if(count>0){
    orderCompleteMassage.innerText = "Order placed successfully.";
    orderCompleteMassage.style.color = "green";
    count = 0;
    totalProducts.innerText = count;
    document.getElementById("price").innerText = "0";
    document.getElementById("delivery-charge").innerText = "20";
    document.getElementById("total-tax").innerText = "0";
    document.getElementById("total").innerText = "0";

  }
  else{
    orderCompleteMassage.innerText = "Please add to cart any product to order";
    orderCompleteMassage.style.color = "red";
  }
}


//load product details
const loadDetails = id => {
  const url = `https://fakestoreapi.com/products/${id}`
  fetch(url)
  .then(res => res.json())
  .then(data => productDetails(data)
  )
  
}
//show product details into modal
const productDetails = (product) => {
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function() {
    modal.style.display = "none";
}
    window.onclick = function(event) {
    if (event.target == modal) {
  modal.style.display = "none";
}}

const modalBody = document.getElementById('modal-body');
modalBody.innerHTML = `
<div>
<div class='text-center'>
<img class='product-img' src='${product.image}'/>
</div>
<h2 class='title'>${product.title}</h2>
<p > ${product.description}</p>
</div>
`          
}