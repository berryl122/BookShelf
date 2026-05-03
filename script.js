let books = []; // Масив всіх товарів
let cart = []; // Масив товарів у кошику
async function fetchBooks() {
    const response = await fetch('books.json');
    const data = await response.json();
    books = data; // Оновлюємо глобальний масив для роботи addToCart
    displayProducts(data);

}
function createBookCard(book) {
    return `<div class="col">
        <div class="card h-100">
          <img src="${book.cover}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.author}</p>
            <span class="badge text-bg-secondary">${book.genre}</span>
            <div class="d-flex justify-content-between align-items-center mt-3">
                <button class="btn btn-dark" onclick="addToCart(${book.id})"><i class="ti ti-shopping-cart-plus"></i></button>
                <span class="fw-bold">${book.price} грн</span>
            </div>
          </div>
        </div>
      </div>`
}
function displayProducts(products) {
    productsBlock.innerHTML = ''; // Очищаємо блок товарів
    books.forEach(book => {
        const card = createBookCard(book);
        productsBlock.innerHTML += card;
    });
}

function getJsonCookie(cookieName) {
    const allCookies = document.cookie.split('; ');
    const targetCookie = allCookies.find(row => row.startsWith(cookieName +
        '='));
    if (targetCookie) {

        const encodedData = targetCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(encodedData));
    }
    return null;
}
function saveJsonCookie(cookieName, data, seconds) {
    const jsonString = JSON.stringify(data);
    const safeString = encodeURIComponent(jsonString);
    document.cookie = `${cookieName}=${safeString}; max-age=${seconds};
path=/`;
}

function addToCart(bookId) {
    let book = books.find(b => b.id == bookId);
    if (!book) return;

    let item = cart.find(i => i.id == bookId);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }
    console.log(cart);
    saveJsonCookie('cart', cart, 3600 * 24);
    displayCart();

}
function displayCart() {
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Ваш кошик порожній</p>';
       
        return;
    }

    cart.forEach((book) => {
        cartContainer.innerHTML += `
        <div class="card border-0 border-bottom rounded-0">
        <div class="card-body d-flex align-items-center gap-3 p-3">
            <img src="img/${book.cover}" height="80">
                <div class="flex-grow-1">
                    <h5 class="card-title mb-1">${book.title}</h5>
                    <p class="card-text text-muted mb-1">Кількість:${book.quantity}</p>
                    <p class="card-text text-primary fw-bold mb-0">Ціна:${book.price} грн</p>
                </div>
            </div>
        </div>
        `;
    });
}
function loadCart() {
    const savedCart = getJsonCookie('cart');
    if (savedCart !== null) {
        cart = savedCart;
        displayCart();
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const productsBlock = document.querySelector('#productsBlock');
    fetchBooks();
    const cartContainer = document.querySelector('#cartItems');
})