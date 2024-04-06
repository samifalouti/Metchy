const products = [
  { name: 'Product 1', price: '90 DA', image: './images/item1.png' },
  { name: 'Product 2', price: '130 DA', image: './images/item2.png' },
  { name: 'Product 3', price: '$20', image: './images/item3.png' },
  { name: 'Product 4', price: '$15', image: './images/item1.png' },
  { name: 'Product 5', price: '$10', image: './images/item2.png' },
  { name: 'Product 6', price: '$20', image: './images/item3.png' },
  { name: 'Product 7', price: '$15', image: './images/item1.png' },
  { name: 'Product 8', price: '$15', image: './images/item2.png' },
  { name: 'Product 9', price: '$15', image: './images/item3.png' },
  { name: 'Product 10', price: '$15', image: './images/item1.png' },
  { name: 'Product 11', price: '$15', image: './images/item2.png' },
  { name: 'Product 12', price: '$15', image: './images/item3.png' }
];

const carousel = document.getElementById('carousel');
const cartIcon = document.getElementById('cart-icon');
const cartItems = document.getElementById('cart-items');
const cartWindow = document.getElementById('cart-window');
const confirmButton = document.getElementById('confirmButton');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const cartItemsContainer = document.getElementById('cart-items-container');
const menuIcon = document.getElementById('menu-icon');
const overlay = document.getElementById('overlay');
const fullNameInput = document.getElementById('fullNameInput');
const numberInput = document.getElementById('numberInput');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const contactButton = document.querySelector('.social-link[href="#"]');
const footer = document.querySelector('footer');

// Define menuIcon here
menuIcon.addEventListener('click', () => {
  overlay.style.width = overlay.style.width === '190px' ? '0' : '190px';
});

// Close overlay when clicking outside
window.addEventListener('click', (event) => {
  if (event.target !== overlay && event.target !== menuIcon) {
    overlay.style.width = '0';
  }
});

// Toggle cart window function
cartIcon.addEventListener('click', () => {
  cartWindow.classList.toggle('show');
});

// Close cart window when clicking outside
window.addEventListener('click', (event) => {
  if (!cartWindow.contains(event.target) && event.target !== cartIcon) {
    cartWindow.classList.remove('show');
  }
});

confirmButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  
  // Get the total number of items (cards) in the window
  const totalItems = document.querySelectorAll('.copied-card').length;
  
  // Check if all required fields are filled
  if (name !== '' && phone !== '' && totalItems > 0) {
      // Prepare the email body
      const emailBody = `Name: ${name}\nPhone Number: ${phone}\nTotal Items: ${totalItems}`;
      
      // Send the email
      fetch('send_email.php', {
          method: 'POST',
          body: JSON.stringify({ 
              email: 'samifalouti02@gmail.com', 
              body: emailBody 
          }),
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (response.ok) {
              // Form submission successful
              alert('Email sent successfully!');
              // Optionally, reset the form
              nameInput.value = '';
              phoneInput.value = '';
          } else {
              // Form submission failed
              alert('Failed to send email. Please try again later.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while sending the email. Please try again later.');
      });
  } else {
      // Show an error message if any of the fields are empty or there are no items in the window
      alert('Please fill in all the fields and add items to the cart.');
  }
});


// Function to add item to the cart
function createCard(product) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.productId = product.name; // Set data attribute for product ID

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;

  const price = document.createElement('div');
  price.classList.add('price');
  price.textContent = product.price;

  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = product.name;

  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  const addButton = document.createElement('button');
  addButton.classList.add('add');
  addButton.textContent = '+';

  const counter = document.createElement('input');
  counter.type = 'text';
  counter.classList.add('counter');
  counter.value = '0';
  counter.readOnly = true;

  const lessButton = document.createElement('button');
  lessButton.classList.add('less');
  lessButton.textContent = '-';
  lessButton.style.opacity = '0.5'; // Set initial opacity to 50%
  
  fullNameInput.addEventListener('input', validateForm);
  numberInput.addEventListener('input', validateForm);
  messageInput.addEventListener('input', validateForm);

  buttons.appendChild(addButton);
  buttons.appendChild(counter);
  buttons.appendChild(lessButton);

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(buttons);

  return card;
}

// Define the createCardContainer function here
function createCardContainer() {
  const container = document.createElement('div');
  container.classList.add('card-container');
  return container;
}

// Split products into groups of 3
const productGroups = products.reduce((acc, product) => {
  const groupIndex = Math.floor(acc.length / 3);
  if (!acc[groupIndex]) {
      acc[groupIndex] = [];
  }
  acc[groupIndex].push(product);
  return acc;
}, []);

// Create card containers and append cards to them
productGroups.forEach(group => {
  const cardContainer = createCardContainer();
  group.forEach(product => {
      const card = createCard(product);
      cardContainer.appendChild(card);
  });
  carousel.appendChild(cardContainer);
});

// Define the updateCart function here
function updateCart(action, counter) {
  const itemCount = parseInt(counter.value);
  const card = counter.parentElement.parentElement;

  if (action === 'add' && itemCount < 10) {
    counter.value = itemCount + 1;
    const copiedCard = card.cloneNode(true);
    copiedCard.classList.add('copied-card');
    cartItemsContainer.appendChild(copiedCard);
    const buttons = copiedCard.querySelector('.buttons');
    buttons.remove();
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.textContent = 'X';
    copiedCard.appendChild(removeButton); // Add the "X" button to the copied card
    
    // Add event listener to the "X" button
    removeButton.addEventListener('click', () => removeCardFromWindow(copiedCard, counter));
  } else if (action === 'remove' && itemCount > 0) {
    counter.value = itemCount - 1;
    const productId = card.dataset.productId; // Get the product ID from the card
    const copiedCard = document.querySelector(`.copied-card[data-product-id="${productId}"]`);
    if (copiedCard) {
      copiedCard.remove();
    }
  }
  
  updateButtonOpacity(counter);
  updateCartIcon();
}

// Event listener setup for add and less buttons
const buttons = document.querySelectorAll('.add, .less');
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const counter = button.parentElement.querySelector('.counter');
    const action = button.classList.contains('add') ? 'add' : 'remove';
    updateCart(action, counter);
  });
});

function removeCardFromWindow(card, counter) {
  const itemCount = parseInt(counter.value);
  
  // If the card counter is 1, decrement the opacity of the less button
  if (itemCount === 1) {
    const lessButton = counter.parentElement.querySelector('.less');
    lessButton.style.opacity = '0.5';
  }
  
  // Decrement both the card counter and the cart counter
  counter.value = Math.max(itemCount - 1, 0); // Ensure the counter doesn't go below 0
  updateCartIcon(); // Update the cart counter
  
  // Remove the card from the window
  card.remove();
}

// Event listener setup for the "X" button
document.querySelectorAll('.remove').forEach(removeButton => {
  removeButton.addEventListener('click', () => {
    const card = removeButton.parentElement;
    removeCardFromWindow(card);
  });
});


// Define the updateCartIcon function here
function updateCartIcon() {
  let totalCount = 0;
  document.querySelectorAll('.counter').forEach(counter => {
      totalCount += parseInt(counter.value);
  });
  cartItems.textContent = totalCount;
  // Show or hide "Empty Cart" message based on total count
  const emptyCartMessage = document.getElementById('empty-cart-message');
  if (totalCount === 0) {
      emptyCartMessage.style.display = 'block';
  } else {
      emptyCartMessage.style.display = 'none';
  }
}

// Define the updateButtonOpacity function here
function updateButtonOpacity(counter) {
  const lessButton = counter.parentElement.querySelector('.less');
  const addButton = counter.parentElement.querySelector('.add');
  const itemCount = parseInt(counter.value);
  
  if (itemCount === 0) {
      lessButton.style.opacity = '0.5'; // Less button opacity 50%
  } else {
      lessButton.style.opacity = '1'; // Less button opacity 100%
  }
  
  if (itemCount === 10) {
      addButton.style.opacity = '0.5'; // Add button opacity 50%
  } else {
      addButton.style.opacity = '1'; // Add button opacity 100%
  }
}

// Define the validateForm function here
function validateForm() {
  // Check if all required fields are filled
  if (fullNameInput.value.trim() !== '' && numberInput.value.trim() !== '' && messageInput.value.trim() !== '') {
      // Enable the "Send" button
      sendButton.disabled = false;
      sendButton.style.opacity = 1;
  } else {
      // Disable the "Send" button
      sendButton.disabled = true;
      sendButton.style.opacity = 0.5;
  }
}

// Define the event listener for the form submission here
document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the form data
  const formData = new FormData(this);

  // Send the form data to the server
  fetch('send_email.php', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (response.ok) {
          // Form submission successful
          alert('Form submitted successfully!');
          // Optionally, reset the form
          this.reset();
      } else {
          // Form submission failed
          alert('Form submission failed. Please try again later.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while submitting the form. Please try again later.');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const homeLink = document.querySelector('a[href="#"]');
  const homeSection = document.getElementById('home');

  // Function to handle smooth scrolling to the home section
  const scrollToHome = (event) => {
    event.preventDefault();
    const homePosition = homeSection.getBoundingClientRect().top;
    window.scrollTo({
      top: homePosition,
      behavior: 'smooth'
    });
  };

  // Add click event listener to the home link
  homeLink.addEventListener('click', scrollToHome);
});

document.addEventListener('DOMContentLoaded', function() {
  const servicesLink = document.querySelector('a[href="#services"]');
  const servicesSection = document.getElementById('services');

  // Function to handle smooth scrolling to the services section
  const scrollToServices = (event) => {
    event.preventDefault();
    const servicesPosition = servicesSection.getBoundingClientRect().top;
    window.scrollTo({
      top: servicesPosition,
      behavior: 'smooth'
    });
  };

  // Add click event listener to the services link
  servicesLink.addEventListener('click', scrollToServices);
});

document.addEventListener('DOMContentLoaded', function() {
  const contactLink = document.getElementById('contact-link');
  const footer = document.querySelector('footer');

  // Function to handle smooth scrolling to the footer
  const scrollToFooter = (event) => {
    event.preventDefault();
    const footerPosition = footer.getBoundingClientRect().top;
    window.scrollTo({
      top: footerPosition,
      behavior: 'smooth'
    });
  };

  // Add click event listener to the contact link
  contactLink.addEventListener('click', scrollToFooter);
});


document.addEventListener('DOMContentLoaded', function() {
  const aboutLink = document.querySelector('a[href="#about-link"]');
  const aboutSection = document.getElementById('about-us');

  // Function to handle smooth scrolling to the about section
  const scrollToAbout = (event) => {
    event.preventDefault();
    const aboutPosition = aboutSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: aboutPosition,
      behavior: 'smooth'
    });
  };

  // Add click event listener to the about link
  aboutLink.addEventListener('click', scrollToAbout);
});
