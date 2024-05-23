const menuItems = [
  { id: 1, name: 'Soy Burger', price: 238, image: 'veggie_burger.jpeg', description1: 'Deliciously plant-based and eco-friendly, the burger patty is made from curdled soybeans.', description2: 'This burger is a must try!' },
  { id: 2, name: 'Beef Burger', price: 2430, image: 'beef_burger.jpeg', description1: 'Pure beef, sourced from our very own cows. 100% meat.', description2: 'We have a habit of naming each burger after the cow that made it. Slaughter for today: Mary!' },
  { id: 3, name: 'Chicken Burger', price: 753, image: 'chicken_burger.jpeg', description1: 'Why not opt for a chicken burger, made from the freshest of breasts?', description2: 'This meal is a must-have, chicken so fresh you can hear it cluck!' },
];

// Function to display menu
function displayMenu() {
  const menuElement = document.getElementById('menu');
  menuElement.innerHTML = '';

  // Add image at the top of the menu
  const menuImage = document.createElement('img');
  menuImage.src = 'logo.png'; // Replace with the path to your menu image
  menuImage.alt = 'Menu Image';
  menuElement.appendChild(menuImage);

  // Add some spacing between the image and the menu items
  const spacingElement = document.createElement('div');
  spacingElement.style.marginBottom = '1rem';
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
  const overlay = document.querySelector('.overlay'); // Get the overlay element
  
  // Show the overlay when the item details dialog is shown
  overlay.classList.remove('hidden');

  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', () => {
    dialog.classList.add('hidden');
    overlay.classList.add('hidden');
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
    overlay.classList.add('hidden');
  };

  cancelButton.classList.add('cancel-button');
  dialog.appendChild(cancelButton);
  document.body.appendChild(overlay);
  dialog.classList.remove('hidden');
}

// Function to place order
function placeOrder(item) {
  const socket = io();
  socket.emit('placeOrder', item);
}

// Initialize
displayMenu();

const socket = io();
window.onload = displayMenu;

socket.on('hideThankYouDialog', function () {
  hideThankYouDialog();
});

// Function to handle the "Order Now" button click
document.getElementById('order-button').addEventListener('click', function () {
  const itemDetails = document.getElementById('item-details').innerText;
  const burgerType = itemDetails;
  let fillerDuration;
  let drainDuration;

  if (burgerType.includes('Beef Burger')) {
    fillerDuration = 31000; // 31 seconds for filler pump
    drainDuration = 31000;  // 31 seconds for drain pump
  } else if (burgerType.includes('Chicken Burger')) {
    fillerDuration = 9500; // 9.5 seconds for filler pump
    drainDuration = 9500;  // 9.5 seconds for drain pump
  } else if (burgerType.includes('Soy Burger')) {
    fillerDuration = 3000; // 3 seconds for filler pump
    drainDuration = 3000;  // 3 seconds for drain pump
  } else {
    fillerDuration = 0; // Default duration for filler pump
    drainDuration = 0; // Default duration for drain pump
  }

  // Create a message with the durations
  const message = `${fillerDuration},${drainDuration}`;

  // Send the durations to the Arduino
  socket.emit('togglePump', { fillerDuration, drainDuration });

  showThankYouDialog();

  setTimeout(() => {
    hideThankYouDialog();
  }, fillerDuration + 15000 + drainDuration);
});

function showThankYouDialog() {
  document.getElementById('thank-you-dialog').classList.remove('hidden');
  document.querySelector('.overlay').classList.remove('hidden');
}

function hideThankYouDialog() {
  document.getElementById('thank-you-dialog').classList.add('hidden');
  document.querySelector('.overlay').classList.add('hidden');
}
