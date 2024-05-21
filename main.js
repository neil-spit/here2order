const menuItems = [
  { id: 1, name: 'Soy Burger', price: 238, image: 'veggie_burger.jpeg', description1: 'Deliciously plant-based and eco-friendly, the burger patty is made from curdled soybeans.', description2: 'This burger is a must try!' },
  { id: 2, name: 'Beef Burger', price: 2430, image: 'beef_burger.jpeg', description1: 'Pure beef, sourced from our very own cows. 100% meat.', description2: 'We have a habit of naming each burger after the cow that made it. Slaughter for today: Mary!' },
  { id: 3, name: 'Chicken Burger', price: 753, image: 'chicken_burger.jpeg', description1: 'Why not opt for a chicken burger, made from the freshest of breasts?', description2: 'This meal is a must-have, chicken so fresh you can hear it cluck!' },
];

let duration;

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
          <h1>${item.name}</h1>
          <h2>Price: ${item.price}L</h2>
          <p>${item.description1}</p>
          <p>${item.description2}</p>
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

const socket = io(); 
window.onload = displayMenu;

socket.on('togglePump', function () {
  console.log('Received togglePump event from the server');
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

// Function to handle the "Order Now" button click
document.getElementById('order-button').addEventListener('click', function () {
  document.getElementById('item-details-dialog').classList.add('hidden');

  document.getElementById('thank-you-dialog').classList.remove('hidden');

  // Send a message to the server to toggle the LED
  const itemDetails =
    document.getElementById('item-details').innerText;
  const burgerType = itemDetails;
  console.log(burgerType);
  if (burgerType.includes('Beef Burger')) {
    duration = 10000; // 10 seconds for Beef Burger
  } else if (burgerType.includes('Chicken Burger')) {
    duration = 5000; // 5 seconds for Chicken Burger
  } else if (burgerType.includes('Soy Burger')) {
    duration = 2000; // 2 seconds for Soy Burger
  } else {
    // Default duration if burger type is not recognized
    duration = 0; // Change this as needed
  }

  console.log(duration);
  socket.emit('togglePump', { duration });

  setTimeout(() => {
    document.getElementById('thank-you-dialog').classList.add('hidden');
  }, duration);
});

function showThankYouDialog() {
  document.getElementById('thank-you-dialog').classList.add('active');
  document.querySelector('.overlay').classList.add('active');
}

function hideThankYouDialog() {
  document.getElementById('thank-you-dialog').classList.remove('active');
  document.querySelector('.overlay').classList.remove('active');
}

document.getElementById('order-button').addEventListener('click', function() {
  showThankYouDialog();
  setTimeout(function() {
      hideThankYouDialog();
  }, duration); 
});
