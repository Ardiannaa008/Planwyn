// DOM elements
const openInputBtn = document.getElementById('openInput');
const inputForm = document.getElementById('inputForm');
const submitGratitudeBtn = document.getElementById('submitGratitude');
const gratitudeText = document.getElementById('gratitudeText');
const gratitudeDate = document.getElementById('gratitudeDate');
const cardsContainer = document.getElementById('cardsContainer');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popupText');
const closePopup = document.getElementById('closePopup');

// Show the input form when clicking the + button
openInputBtn.addEventListener('click', () => {
  inputForm.style.display = 'block';
  openInputBtn.style.display = 'none'; // Hide the button when the form is visible
});

// Submit the gratitude entry and hide the form
submitGratitudeBtn.addEventListener('click', () => {
  const text = gratitudeText.value;
  const date = gratitudeDate.value;
  
  if (text && date) {
    addNewCard(text, date);
    inputForm.style.display = 'none';
    openInputBtn.style.display = 'block'; // Show the + button again
    gratitudeText.value = ''; // Clear input
    gratitudeDate.value = '';
  }
});

// Function to add a new card
function addNewCard(text, date) {
  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <div class="card-header">
      <div class="date">${date}</div>
      <div class="three-dots">...</div>
      <div class="dropdown-menu" style="display: none;">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
    <p>${text}</p>
  `;

  cardsContainer.appendChild(card);
  saveEntriesToLocalStorage(); // Save to local storage when a new card is added
}

// Event listener for clicking on cards and dropdown menu
cardsContainer.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  const dropdown = card?.querySelector('.dropdown-menu');
  
  // If clicking on the three dots, toggle the dropdown
  if (e.target.classList.contains('three-dots')) {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }

  // Edit button functionality
  const editBtn = card?.querySelector('.edit-btn');
  if (e.target === editBtn) {
    const text = card.querySelector('p').innerText;
    const date = card.querySelector('.date').innerText;

    popupText.innerHTML = `
      <div class="date">${date}</div>
      <textarea id="editText" style="width: 100%; height: 100px;">${text}</textarea>
      <button id="saveEdit">Save</button>
    `;
    popup.style.display = 'flex';

    // Save the edited content
    document.getElementById('saveEdit').addEventListener('click', () => {
      const newText = document.getElementById('editText').value;
      card.querySelector('p').innerText = newText;
      saveEntriesToLocalStorage(); // Update local storage after editing
      popup.style.display = 'none';
      dropdown.style.display = 'none'; // Close dropdown after editing
    });
  }

  // Delete button functionality
  const deleteBtn = card?.querySelector('.delete-btn');
  if (e.target === deleteBtn) {
    card.remove();
    saveEntriesToLocalStorage(); // Update local storage after deleting a card
    dropdown.style.display = 'none'; // Close dropdown after deleting
  }
});

// Close the popup when clicking on the 'X'
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Save entries to local storage
function saveEntriesToLocalStorage() {
  const cards = document.querySelectorAll('.card');
  const entries = [];

  cards.forEach(card => {
    const date = card.querySelector('.date').innerText;
    const text = card.querySelector('p').innerText;
    entries.push({ date, text });
  });

  // Save the entries to localStorage
  localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
}

// Load saved entries from local storage on page load
window.addEventListener('load', () => {
  const savedEntries = JSON.parse(localStorage.getItem('gratitudeEntries')) || [];
  savedEntries.forEach(entry => addNewCard(entry.text, entry.date));
});

// Close dropdown when clicking outside the card
document.addEventListener('click', (e) => {
  if (!e.target.closest('.card')) {
    const openDropdowns = document.querySelectorAll('.dropdown-menu');
    openDropdowns.forEach(dropdown => dropdown.style.display = 'none');
  }
});
