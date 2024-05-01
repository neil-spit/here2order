//const io = require('socket.io');

// Sample food items data
const menuItems = [
  { id: 1, name: 'Soy Burger', price: 238, image: 'veggie_burger.jpeg' },
  { id: 2, name: 'Beef Burger', price: 2430, image: 'beef_burger.jpeg' },
  { id: 3, name: 'Chicken Burger', price: 753, image: 'chicken_burger.jpeg' },
  // Add more items as needed
];

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
          <button onclick="showItemDetails(${item.id})">Order Now</button>
      `;
    menuElement.appendChild(menuItem);
  });
}

// Function to show item details dialog
function showItemDetails(itemId) {
  const selectedItem = menuItems.find((item) => item.id === itemId);
  const dialog = document.getElementById('item-details-dialog');
  const itemDetails = document.getElementById('item-details');
  const orderButton = document.getElementById('order-button');

  itemDetails.innerHTML = `
    <h2>${selectedItem.name}</h2>
    <p>Price: ${selectedItem.price}L</p>
  `;

  orderButton.onclick = () => {
    placeOrder(selectedItem);
    dialog.classList.add('hidden');
  };

  dialog.classList.remove('hidden');
}

// Function to place order
function placeOrder(item) {
  // Send the order details to the server using Socket.IO
  const socket = io();
  socket.emit('placeOrder', item);
}

// Initialize
displayMenu();

const socket = io(); // Establish WebSocket connection with the server

window.onload = displayMenu;

// Event listener for the 'toggleLED' event
socket.on('toggleLED', function () {
  // Perform the action to toggle the LED
  // For example, you can change the color of an LED icon or display a message
  console.log('Received toggleLED event from the server');
  // Add your code to toggle the LED here
});

// Function to show item details dialog
function showItemDetails(itemId) {
  const selectedItem = menuItems.find((item) => item.id === itemId);
  const dialog = document.getElementById('item-details-dialog');
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', () => {
    dialog.classList.add('hidden');
    overlay.remove();
  });

  // Remove any existing cancel button before appending the new one
  const existingCancelButton = dialog.querySelector('.cancel-button');
  if (existingCancelButton) {
    existingCancelButton.remove();
  }

  const itemDetails = document.getElementById('item-details');
  const orderButton = document.getElementById('order-button');

  itemDetails.innerHTML = `
    <h2>${selectedItem.name}</h2>
    <p>Price: ${selectedItem.price}L</p>
  `;

  orderButton.onclick = () => {
    placeOrder(selectedItem);
    dialog.classList.add('hidden');
    overlay.remove();
  };

  cancelButton.classList.add('cancel-button');
  dialog.appendChild(cancelButton); // Append the cancel button to the dialog
  document.body.appendChild(overlay);
  dialog.classList.remove('hidden');
}

document.getElementById('order-button').addEventListener('click', function () {
  socket.emit('toggleLED'); // Send a message to the server to toggle the LED
});

