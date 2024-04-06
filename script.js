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

menuIcon.addEventListener('click', () => {
  overlay.style.width = overlay.style.width === '190px' ? '0' : '190px';
});

window.addEventListener('click', (event) => {
  if (event.target !== overlay && event.target !== menuIcon) {
    overlay.style.width = '0';
  }
});

cartIcon.addEventListener('click', () => {
  cartWindow.classList.toggle('show');
});

window.addEventListener('click', (event) => {
  if (!cartWindow.contains(event.target) && event.target !== cartIcon) {
    cartWindow.classList.remove('show');
  }
});

confirmButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  
  const totalItems = document.querySelectorAll('.copied-card').length;
  
  if (name !== '' && phone !== '' && totalItems > 0) {
      const emailBody = `Name: ${name}\nPhone Number: ${phone}\nTotal Items: ${totalItems}`;
      
      fetch('YOUR_EMAIL_SERVICE_API_ENDPOINT', {
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
              alert('Email sent successfully!');
              nameInput.value = '';
              phoneInput.value = '';
          } else {
              alert('Failed to send email. Please try again later.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while sending the email. Please try again later.');
      });
  } else {
      alert('Please fill in all the fields and add items to the cart.');
  }
});


function createCard(product) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.productId = product.name; 

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
  lessButton.style.opacity = '0.5'; 
  
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

function createCardContainer() {
  const container = document.createElement('div');
  container.classList.add('card-container');
  return container;
}

const productGroups = products.reduce((acc, product) => {
  const groupIndex = Math.floor(acc.length / 3);
  if (!acc[groupIndex]) {
      acc[groupIndex] = [];
  }
  acc[groupIndex].push(product);
  return acc;
}, []);

productGroups.forEach(group => {
  const cardContainer = createCardContainer();
  group.forEach(product => {
      const card = createCard(product);
      cardContainer.appendChild(card);
  });
  carousel.appendChild(cardContainer);
});

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
    copiedCard.appendChild(removeButton); 
    
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
  
  if (itemCount === 1) {
    const lessButton = counter.parentElement.querySelector('.less');
    lessButton.style.opacity = '0.5';
  }
  
  counter.value = Math.max(itemCount - 1, 0); 
  updateCartIcon(); 
  
  card.remove();
}

document.querySelectorAll('.remove').forEach(removeButton => {
  removeButton.addEventListener('click', () => {
    const card = removeButton.parentElement;
    removeCardFromWindow(card);
  });
});


function updateCartIcon() {
  let totalCount = 0;
  document.querySelectorAll('.counter').forEach(counter => {
      totalCount += parseInt(counter.value);
  });
  cartItems.textContent = totalCount;
  const emptyCartMessage = document.getElementById('empty-cart-message');
  if (totalCount === 0) {
      emptyCartMessage.style.display = 'block';
  } else {
      emptyCartMessage.style.display = 'none';
  }
}

function updateButtonOpacity(counter) {
  const lessButton = counter.parentElement.querySelector('.less');
  const addButton = counter.parentElement.querySelector('.add');
  const itemCount = parseInt(counter.value);
  
  if (itemCount === 0) {
      lessButton.style.opacity = '0.5'; 
  } else {
      lessButton.style.opacity = '1'; 
  }
  
  if (itemCount === 10) {
      addButton.style.opacity = '0.5'; 
  } else {
      addButton.style.opacity = '1'; 
  }
}

function validateForm() {
  if (fullNameInput.value.trim() !== '' && numberInput.value.trim() !== '' && messageInput.value.trim() !== '') {
      sendButton.disabled = false;
      sendButton.style.opacity = 1;
  } else {
      sendButton.disabled = true;
      sendButton.style.opacity = 0.5;
  }
}

document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(this);

  fetch('YOUR_EMAIL_SERVICE_API_ENDPOINT', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (response.ok) {
          alert('Form submitted successfully!');
          this.reset();
      } else {
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

  contactLink.addEventListener('click', scrollToFooter);
});


document.addEventListener('DOMContentLoaded', function() {
  const aboutLink = document.querySelector('a[href="#about-link"]');
  const aboutSection = document.getElementById('about-us');

  const scrollToAbout = (event) => {
    event.preventDefault();
    const aboutPosition = aboutSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: aboutPosition,
      behavior: 'smooth'
    });
  };

  aboutLink.addEventListener('click', scrollToAbout);
});

