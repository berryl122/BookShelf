let books = []; // Масив всіх товарів
let cart = []; // Масив товарів у кошику
async function fetchBooks() {
    const response = await fetch('books.json');
    const data = await response.json();
 books = data; // Оновлюємо глобальний масив для роботи addToCart
    displayProducts(data);
}
function createBookCard (book) {
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
    let book = books.find(b=>b.id == bookId);
    if (!book) return;

    let item = cart.find(i=>i.id == bookId);
    if (item) {
         item.quantity+=1;
    }else {
        cart.push({...book, quantity: 1});
    }
    console.log(cart);
    saveJsonCookie('cart', cart, 3600*24);

}

document.addEventListener('DOMContentLoaded', () =>{
    const productsBlock = document.querySelector ('#productsBlock');
    fetchBooks();
})