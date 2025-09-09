const API_BASE = "https://openapi.programming-hero.com/api/plants";

let allTrees = [];
let categories = [];
let cart = [];

//  page loads
document.addEventListener("DOMContentLoaded", function () {
    initializeWebsite();
    setupModal();
    setupForm();
});

// Main function
async function initializeWebsite() {
    try {
        // Show loading spinners
        showElement("categories-loading");
        showElement("trees-loading");

        // Fetch all data from API
        const response = await fetch(API_BASE);
        const data = await response.json();
        allTrees = data.plants;


        categories = [...new Set(allTrees.map(tree => tree.category))];


        displayCategories();


        displayAllTrees();

        // Hide loading spinners and show content
        hideElement("categories-loading");
        hideElement("trees-loading");
        showElement("categories-list");
        showElement("trees-grid");

    } catch (error) {
        console.error("Error loading data:", error);
        hideElement("categories-loading");
        hideElement("trees-loading");
        showError("trees-grid", "Failed to load trees. Please refresh the page.");
    }
}

//  "All Trees" selected by default
function displayCategories() {
    const categoriesList = document.getElementById("categories-list");
    categoriesList.innerHTML = "";


    const allButton = createCategoryButton("All Trees", null, true);
    categoriesList.appendChild(allButton);


    categories.forEach(category => {
        const button = createCategoryButton(category, category, false);
        categoriesList.appendChild(button);
    });
}

// Create category button
function createCategoryButton(name, categoryId, isActive) {
    const button = document.createElement("button");
    button.className = `w-full text-left px-4 py-2 rounded-md transition-colors ${isActive
        ? "bg-green-600 text-white"
        : "bg-gray-100 hover:bg-green-100 text-gray-700"
        }`;
    button.textContent = name;
    button.onclick = () => selectCategory(categoryId, button);
    return button;
}


function selectCategory(categoryId, buttonElement) {

    // reset all buttons to inactive
    document.querySelectorAll("#categories-list button").forEach(btn => {
        btn.className = "w-full text-left px-4 py-2 rounded-md transition-colors bg-gray-100 hover:bg-green-100 text-gray-700";
    });

    // mark the clicked button active
    buttonElement.className = "w-full text-left px-4 py-2 rounded-md transition-colors bg-green-600 text-white";

    // show spinner while (re)loading trees and hide the grid
    showElement("trees-loading");
    hideElement("trees-grid");

    // simulate a short load so the spinner is visible and then render
    setTimeout(() => {
        if (categoryId) {
            displayTreesByCategory(categoryId);
        } else {
            displayAllTrees();
        }

        // hide spinner and show grid after rendering
        hideElement("trees-loading");
        showElement("trees-grid");
    }, 250);
}

// Display all trees
function displayAllTrees() {
    displayTrees(allTrees);
}

// Display trees by category
function displayTreesByCategory(categoryId) {
    const filteredTrees = allTrees.filter(tree => tree.category === categoryId);
    displayTrees(filteredTrees);
}


function displayTrees(treesToShow) {
    const treesGrid = document.getElementById("trees-grid");
    treesGrid.innerHTML = "";

    treesToShow.forEach(tree => {
        const treeCard = createTreeCard(tree);
        treesGrid.appendChild(treeCard);
    });
}

// Create individuallll tree card
function createTreeCard(tree) {
    const card = document.createElement("div");
    card.className = "tree-card bg-white rounded-lg shadow-md overflow-hidden";

    card.innerHTML = `
        <img src="${tree.image}" alt="${tree.name}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-bold text-green-800 mb-2 cursor-pointer hover:text-green-600" onclick="openTreeModal(${tree.id})">${tree.name}</h3>
          <p class="text-gray-600 mb-3 text-sm">${tree.description.length > 100 ? tree.description.substring(0, 100) + '...' : tree.description}</p>
          <div class="flex justify-between items-center mb-3">
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">${tree.category}</span>
            <span class="text-lg font-bold text-black">৳${tree.price}</span>
          </div>
          <button onclick="handleAddToCart(${tree.id}, '${tree.name}', ${tree.price})" 
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-[15px] transition-colors">
            Add to Cart
          </button>
        </div>
      `;

    return card;
}

// Open tree modal with details
function openTreeModal(treeId) {
    const tree = allTrees.find(t => t.id == treeId);

    if (!tree) {
        alert("Tree details not found.");
        return;
    }

    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `
        <div class="relative">
          <img src="${tree.image}" class="w-full h-80 object-cover rounded-lg mb-6" alt="${tree.name}">
          <div class="absolute top-4 left-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            ${tree.category}
          </div>
        </div>
        <h2 class="text-3xl font-bold text-green-800 mb-2">${tree.name}</h2>
        <div class="text-2xl font-bold text-green-600 mb-4">৳${tree.price}</div>
        <p class="text-gray-700 leading-relaxed mb-6">${tree.description}</p>
        <button onclick="handleAddToCart(${tree.id}, '${tree.name}', ${tree.price}, true);" 
                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Add to Cart
        </button>
      `;

    showElement("tree-modal");
    document.body.style.overflow = 'hidden';
}

// Setup modal 
function setupModal() {
    document.getElementById("close-modal").onclick = closeModal;
    document.getElementById("tree-modal").onclick = function (e) {
        if (e.target === e.currentTarget) closeModal();
    };
}

// Close modal
function closeModal() {
    hideElement("tree-modal");
    document.body.style.overflow = 'auto';
}


function handleAddToCart(id, name, price, fromModal = false) {
    const confirmed = confirm(`Do you want to add "${name}" (৳${price}) to your cart?`);

    if (confirmed) {
        addToCart(id, name, price);
        if (fromModal) {
            closeModal();
        }
    }
}

// Add tree to cart 
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCartDisplay();
}

// Remove tree from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">No trees selected yet</p>';
        cartTotal.textContent = "৳0";
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center bg-[#F0FDF4] p-3 rounded-lg">
          <div>
            <div class="font-semibold text-green-800">${item.name}</div>
            <div class="text-sm text-gray-600">Qty: ${item.quantity} × ৳${item.price}</div>
          </div>
          <button onclick="removeFromCart(${item.id})" class=" hover:text-red-700"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `৳${total}`;
}

// Setup form
function setupForm() {
    document.getElementById("plant-form-element").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const treesCount = document.getElementById("trees").value;

        alert(`Thank you ${name}! Your request to plant ${treesCount} trees has been submitted. We'll contact you at ${email} soon.`);
        this.reset();
    });
}

// Navigation functions
function scrollToTrees() {
    document.getElementById("trees").scrollIntoView({ behavior: "smooth" });
}

function scrollToPlantForm() {
    document.getElementById("plant-form").scrollIntoView({ behavior: "smooth" });
}


function showElement(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hideElement(id) {
    document.getElementById(id).classList.add("hidden");
}

function showError(containerId, message) {
    document.getElementById(containerId).innerHTML = `
        <div class="col-span-full text-center py-20 text-red-500">
          <div class="text-4xl mb-4">⚠</div>
          <p class="text-lg">${message}</p>
        </div>
      `;
    showElement(containerId);
}