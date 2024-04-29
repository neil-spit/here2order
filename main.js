// Sample food items data
const menuItems = [
  { id: 1, name: 'Soy Burger', price: 238, image: 'veggie_burger.jpeg' },
  { id: 2, name: 'Beef Burger', price: 2430, image: 'beef_burger.jpeg' },
  { id: 3, name: 'Chicken Burger', price: 753, image: 'chicken_burger.jpeg' },
  // Add more items as needed
];

// Initialize cart
let cart = [];

// Function to display menu
function displayMenu() {
  const menuElement = document.getElementById('menu');
  menuElement.innerHTML = ''; // Clear previous content

  // Add image at the top of the menu
  const menuImage = document.createElement('img');
  menuImage.src = 'logo.png'; // Replace with the path to your menu image
  menuImage.alt = 'Menu Image';
  menuElement.appendChild(menuImage);

  // Add some spacing between the image and the menu items
  const spacingElement = document.createElement('div');
  spacingElement.style.marginBottom = '1rem'; // Adjust spacing as needed
  menuElement.appendChild(spacingElement);

  // Add menu items
  menuItems.forEach((item) => {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    menuItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>${item.price}L</p>
          <button onclick="addToCart(${item.id})">Add to Cart</button>
      `;
    menuElement.appendChild(menuItem);
  });
}

// Function to add item to cart
function addToCart(itemId) {
  const selectedItem = menuItems.find((item) => item.id === itemId);
  cart.push(selectedItem);
  updateCart();
}

// Function to update cart
function updateCart() {
  const cartElement = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  cartElement.innerHTML = '';

  let total = 0;
  cart.forEach((item) => {
    total += item.price;
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
          <p>${item.name} - ${item.price}L</p>
      `;
    cartElement.appendChild(cartItem);
  });

  cartTotalElement.textContent = `Total: ${total}L`;

  // Show cart if it has items
  const cartContainer = document.getElementById('cart');
  if (cart.length > 0) {
    cartContainer.classList.remove('hidden');
  } else {
    cartContainer.classList.add('hidden');
  }
}

// Initialize
displayMenu();



// Event listener for checkout button
document.getElementById('checkout').addEventListener('click', function () {
  alert('Thank you for your order!');
  cart = [];
  updateCart();
});

window.onload = displayMenu;
