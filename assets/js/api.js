let cart = [];
let products = []
let productsSize = null
let mainCategory = null

const sortingData = []

let shoppingList = document.querySelector('.shopping__list')
let shoppingInfoPrice = document.querySelector('.shopping__info-price span')
let shoppingPrice = document.querySelector('.shopping-price')

// Get products
const productGrid = document.querySelector('.product-grid')

let limit = 20
let thisPage = 1

async function loading(type) {
  // loader
  let loader = document.querySelector('.loader')
  if (type == 'add') {
    loader.classList.add('loaderActive')
  } else {
    setTimeout(() => {
      loader.classList.remove('loaderActive')
    }, 1000);
  }
}

async function init() {
  await loading('add')
  await getProducts()
  await loading('remove')
}
init()

function saveCategory() {
  let categores = null
  let filter = document.querySelector('.filter')
  
  filter.innerHTML = '<option value="all" selected>All</option>'

  fetch('https://dummyjson.com/products/categories/')
  .then(res => res.json())
  .then(rest => categores = rest)
  .then(save => saveInit())

  function saveInit() {
    categores.forEach(async value => {
      let option = document.createElement('option')
      option.setAttribute('value', value)
      option.innerText = value

      filter.appendChild(option)
      // console.log(option);
    });
  }
}
saveCategory()

function seeApi(category=null) {
  if (category) {
    // https://dummyjson.com/products?limit=10&skip=90
    // let path = `https://dummyjson.com/products/category/${category.value}`
    let path = `https://dummyjson.com/products/category/${category.value}`
    fetch(path)
    .then(res => res.json())
    .then(rest => productsSize = rest?.products?.length)
    .then(page => listPage())
  } else {
    let path = `https://dummyjson.com/products?limit=100&skip=0`
    fetch(path)
    .then(res => res.json())
    .then(rest => productsSize = rest?.products?.length)
    .then(page => listPage())
  } 
}
seeApi()

async function listPage () {
  let page = document.querySelector('.page')
  let count = Math.ceil(productsSize / limit)

  page.innerHTML = ''

  if (thisPage != 1) {
    let prev = document.createElement('ion-icon')
    prev.innerText = "PREV"
    prev.setAttribute('onclick', "changePage(" + (thisPage - 1) + ")")
    prev.setAttribute('name', "arrow-back-outline")
    page.appendChild(prev)
  }


  for (let i = 1; i <= count; i++) {
    let newPage = document.createElement('li')
    newPage.innerText = i
    if (i == thisPage) {  
      newPage.classList.add('activePage')
    }
    newPage.setAttribute('onclick', "changePage(" + i + ")")
    newPage.classList.add('page__item')
    page.appendChild(newPage)
  }

  if (thisPage != count) {
    let next = document.createElement('ion-icon')
    next.innerText = "NEXT"
    next.setAttribute('onclick', "changePage(" + (thisPage + 1) + ")")
    next.setAttribute('name', "arrow-forward-outline")
    page.appendChild(next)
  }
}

async function changePage(i) {
  if (i != thisPage) {
    thisPage = i

    listPage()
    await init()
  }
}

// Get Products

async function getProducts () {
  let beginGet = limit * (thisPage - 1)
  let endGet = limit * thisPage - 1

  if (beginGet != null && endGet != null) {
    let path = `https://dummyjson.com/products?limit=${limit}&skip=${beginGet}`
    fetch(path)
    .then(res => res.json())
    .then(rest => products = rest?.products)
    .then(item => initApp())
    .then(card => initCard())
    // .then(load => loading('remove'))
  } else {
    let path = `https://dummyjson.com/products/`
    fetch(path)
    .then(res => res.json())
    .then(rest => products = rest?.products)
    .then(item => initApp())
    .then(card => initCard())
    // .then(load => loading('remove'))
  }
}

function sortCategory(category) {
  if (category.value != 'all') {
    mainCategory = category
    // loader
    loading('add')

    let path = `https://dummyjson.com/products/category/${category.value}`
    fetch(path)
    .then(res => res.json())
    .then(rest => products = rest?.products)
    .then(item => initApp())
    .then(load =>loading('remove'))

    seeApi(category)
  } else {
    getProducts()
    seeApi()
  }
}

// function sortPrice() {
//   let minPrice = document.querySelector('.minPrice')
//   let maxPrice = document.querySelector('.maxPrice')
//   if (minPrice.value > 0 && maxPrice.value > 0) {
//     products = products.filter(prod => prod.price >= minPrice.value && prod.price <= maxPrice.value)
//     initApp()
//     initCard()
    
//     productsSize = products.length
//     listPage()
//   } else {
//     getProducts()
//     seeApi()
//     minPrice.value = ''
//     maxPrice.value = ''
//   }
// }

// Init App
function initApp(){
  productGrid.innerHTML = ''
  products.forEach((value, key) =>{
      let showcase = document.createElement('div');
      showcase.classList.add('showcase')
      showcase.innerHTML = `
      <div class="showcase-banner">

        <img src="${value.thumbnail}" alt="Product image" class="product-img">

        <p class="showcase-badge">${Math.floor(value.discountPercentage)}%</p>

        <div class="showcase-actions">

          <button 
          onclick="addToCart(this)" 
          class="btn-action" 
          data-id="${value.id}"
          data-title="${value.title}"
          data-description="${value.description}"
          data-price="${value.price}"
          data-kik="${value.discountPercentage}"
          data-thumbnail="${value.thumbnail}"
          >
            <ion-icon name="bag-handle-outline"></ion-icon>
          </button>

        </div>

      </div>

      <div class="showcase-content">
      ${value.id}
      ${value.category}
        <a href="#" class="showcase-category">${value.title}</a>

        <a href="#">
          <h3 class="showcase-title">${value.description}</h3>
        </a>

        <div class="showcase-rating">
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
        </div>

        <div class="price-box">
          <p class="price">$${getPrice(value.price, value.discountPercentage)}</p>
          <del>$${value.price}</del>
        </div>

      </div>`;
      productGrid.appendChild(showcase);
  })
}
function getStars(num) {
}

// Get price
function getPrice(price, percentage) {
  return +(price - (price * (Math.floor(percentage) / 100))).toFixed(2)
}

// Add to cart

function initCard() {
  shoppingList.innerHTML = ''
  let totalPrice = 0
  cart.forEach((value) => {
    totalPrice += (getPrice(value.price, value.arg) * value.count)
    shoppingList.innerHTML += `<li class="shopping__list-item">
      <img 
      class="shopping__list-item__img"
      src="${value.thumbnail}" alt="">
      
      <span class="shopping__list-item__info">
        <h2>${value.title}</h2>
        <p>$${getPrice(value.price, value.arg)}<del>$${value.price}</del></p>
      </span>

      <span class="shopping__list-item__control">
        <button onclick="plusOrMinus(${value.id}, 'minus')">-</button>
        <p>${value.count}</p>
        <button onclick="plusOrMinus(${value.id}, 'plus')">+</button>
      </span>

      <button class="deleteBtn" onclick="delProd(${value.index})">
        <ion-icon name="trash-outline" style="color: red;"></ion-icon>
      </button>
    </li>`;
  });
  shoppingInfoPrice.innerHTML = totalPrice.toFixed(2)
  shoppingPrice.innerHTML = cart.length;
}

function addToCart (arg) {
  const bool = cart.some(e => e.id === +arg.dataset.id)

  if (!bool) {
    let newObj = {
      id: +arg.dataset.id,
      title: arg.dataset.title,
      description: arg.dataset.description,
      price: +arg.dataset.price,
      arg: +arg.dataset.kik,
      thumbnail: arg.dataset.thumbnail,
      count: 1,
    }
    cart.push(newObj)
    initCard()
  } else {
    alert("Mahsulot savatga qo'shilgan")
  }
}

function openCart(type) {
  let shopping = document.querySelector('.shopping')
  if (type == 'open') {
    shopping.classList.add('shoppingActive')
  } else {
    shopping.classList.remove('shoppingActive')
  }
}

function plusOrMinus(id, type) {
  cart.forEach((prod,index) => {
    if (prod.id === id) {
      if (type == 'minus' && prod.count > 1) {
        prod.count--
      } else if (type == 'plus') {
        prod.count++
      } else {
        cart.splice(index, 1)
      }
    }
  });
  initCard()
}
function delProd(index) {
  cart.splice(index, 1)
  initCard()
}

function buyProd() {
  clearCart()
  openCart('close')
}

function clearCart() {
  cart = []

  initCard()
}