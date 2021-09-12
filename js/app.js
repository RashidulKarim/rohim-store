const loadProducts = () => {
  // const url = `https://fakestoreapi.com/products`;
  fetch("../data.json")
  // fetch(url)
    .then((response) => response.json())
    .then((data) => showProducts(data));
};
loadProducts();

// search filed 
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
  const allProductsField = document.getElementById("all-products");
  allProductsField.textContent = ''; 
  const allProducts = products.map((pd) => pd);
  for (const product of allProducts) {
    const image = product.image;
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `<div class="single-product">
      <div>
    <img class="product-image" src=${image}></img>
      </div>
      <h2 class='product-title'>${product.title.slice(0,20)}</h2>
      <p>Category: ${product.category}</p>
      <p><span>${product.rating.rate}<i class="fas fa-star"></i>.
      </span><span>${product.rating.count} reviews.</span></p>
      <h3>Price: $ ${product.price}</h3>
      <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
      <button id="details-btn" data-toggle="modal" data-target="#myModal" onclick=loadDetails(${product.id}) class="btn btn-danger">Details</button></div>
      `;
    allProductsField.appendChild(div);
  }
};
let count = 0;
const addToCart = (id, price) => {
  document.getElementById("orderCompleteMassage").innerText = '';
  count = count + 1;
  updatePrice("price", price);

  updateTaxAndCharge();
  updateTotal();
  document.getElementById("total-Products").innerText = count;
};

const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = Math.round(value);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if (priceConverted > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", priceConverted * 0.2);
  }
  if (priceConverted > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", priceConverted * 0.3);
  }
  if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", priceConverted * 0.4);
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
  const massageField = document.getElementById("orderCompleteMassage");
  if(count>0){
    massageField.innerText = "Thank You for Your Order.";
    massageField.style.color = "green";
    count = 0;
    document.getElementById("total-Products").innerText = "0";
    document.getElementById("price").innerText = "0";
    document.getElementById("delivery-charge").innerText = "20";
    document.getElementById("total-tax").innerText = "0";
    document.getElementById("total").innerText = "0";

  }
  else{
    massageField.innerText = "Please add to cart any product to order";
    massageField.style.color = "red";
  }
}

//show product details

const loadDetails = id => {
  const url = `https://fakestoreapi.com/products/${id}`
  fetch(url)
  .then(res => res.json())
  .then(data => productDetails(data)
  )
  
}

const productDetails = (product) => {
  console.log(product);
  
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