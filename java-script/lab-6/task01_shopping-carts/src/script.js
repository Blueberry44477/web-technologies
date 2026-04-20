'use strict';
const DEFAULT_IMAGE = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.L9nN5w58AXKaBiNlnS-6tAHaHa%3Fpid%3DApi&f=1&ipt=60e9c9ecb28b62b2a88982e74f591f3cad76906472e2a9d0ab3480eaf06ce8a5&ipo=images';

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
const getCurrentDate = () => new Date().toISOString();
const formatPrice = (price) => Number(price).toFixed(2);
const calculateTotalPrice = (products) => products.reduce((acc, product) => acc + Number(product.price), 0);

const addProductToState = (state, product) => [...state, product];
const updateProductInState = (state, updatedProduct) => state.map(p => p.id === updatedProduct.id ? updatedProduct : p);
const deleteProductFromState = (state, id) => state.filter(p => p.id !== id);

const filterProducts = (products, category) => category ? products.filter(p => p.category === category) : products;
const sortProductsList = (products, sortBy) => {
    if (!sortBy) return products;
    return [...products].sort((a, b) => {
        if (sortBy === 'price') return Number(a.price) - Number(b.price);
        return new Date(b[sortBy]) - new Date(a[sortBy]);
    });
};

// Global State
let state = {
    products: [],
    filter: '',
    sort: ''
};

// DOM Elements
const DOM = {
    productList: document.getElementById('product-list'),
    emptyState: document.getElementById('empty-state'),
    totalPriceValue: document.getElementById('total-price-value'),
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modal-title'),
    form: document.getElementById('product-form'),
    snackbar: document.getElementById('snackbar'),
    btnAddProduct: document.getElementById('btn-add-product'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    filterControls: document.getElementById('filter-controls'),
    sortControls: document.getElementById('sort-controls'),
    inputs: {
        id: document.getElementById('product-id'),
        name: document.getElementById('product-name'),
        price: document.getElementById('product-price'),
        category: document.getElementById('product-category'),
        image: document.getElementById('product-image')
    }
};

// UI Functions
const showSnackbar = (message) => {
    DOM.snackbar.textContent = message;
    DOM.snackbar.classList.add('show');
    setTimeout(() => {
        DOM.snackbar.classList.remove('show');
    }, 3000);
};

const toggleModal = (show = true, isEdit = false) => {
    if (show) {
        DOM.modal.classList.remove('hidden');
        DOM.modalTitle.textContent = isEdit ? 'Редагувати товар' : 'Додати товар';
    } else {
        DOM.modal.classList.add('hidden');
        DOM.form.reset();
        DOM.inputs.id.value = '';
    }
};

const updateEmptyStateAndTotal = (products) => {
    if (products.length === 0) {
        DOM.emptyState.classList.remove('hidden');
    } else {
        DOM.emptyState.classList.add('hidden');
    }
    DOM.totalPriceValue.textContent = formatPrice(calculateTotalPrice(products));
};

const updateActiveButtons = (container, activeValue, dataAttribute) => {
    const buttons = container.querySelectorAll('.btn');
    buttons.forEach(btn => {
        if (btn.getAttribute(dataAttribute) === activeValue) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

const createProductCard = (product) => {
    const card = document.createElement('div');
    const imageSrc = product.image || DEFAULT_IMAGE;
    card.className = 'product-card anim-enter';
    card.dataset.id = product.id;

    card.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}" class="product-card__img">
        <div class="product-card__info">
            <small>ID: ${product.id}</small>
            <h3>${product.name}</h3>
            <p><strong>Ціна:</strong> ${formatPrice(product.price)} ₴</p>
            <p><strong>Категорія:</strong> ${product.category}</p>
        </div>
        <div class="product-card__actions">
            <button class="btn btn--primary btn-edit">Редагувати</button>
            <button class="btn btn--danger btn-delete">Видалити</button>
        </div>
    `;

    // Event Listeners for buttons inside card
    card.querySelector('.btn-edit').addEventListener('click', () => {
        DOM.inputs.id.value = product.id;
        DOM.inputs.name.value = product.name;
        DOM.inputs.price.value = product.price;
        DOM.inputs.category.value = product.category;
        DOM.inputs.image.value = product.image;
        toggleModal(true, true);
    });

    card.querySelector('.btn-delete').addEventListener('click', () => {
        card.classList.remove('anim-enter');
        card.classList.add('anim-leave');
        setTimeout(() => {
            handleDeleteProduct(product.id);
        }, 400); // Matches CSS animation duration
    });

    return card;
};

const renderProducts = () => {
    const filtered = filterProducts(state.products, state.filter);
    const sorted = sortProductsList(filtered, state.sort);

    DOM.productList.innerHTML = '';
    sorted.forEach(product => {
        DOM.productList.appendChild(createProductCard(product));
    });

    updateEmptyStateAndTotal(state.products);
    updateActiveButtons(DOM.filterControls, state.filter, 'data-category');
    updateActiveButtons(DOM.sortControls, state.sort, 'data-sort');
};

// Handlers
const handleFormSubmit = (e) => {
    e.preventDefault();

    const productData = {
        name: DOM.inputs.name.value,
        price: DOM.inputs.price.value,
        category: DOM.inputs.category.value,
        image: DOM.inputs.image.value
    };

    const editId = DOM.inputs.id.value;

    if (editId) {
        const existingProduct = state.products.find(p => p.id === editId);
        const updatedProduct = {
            ...existingProduct,
            ...productData,
            updatedAt: getCurrentDate()
        };
        state.products = updateProductInState(state.products, updatedProduct);
        showSnackbar(`Successfully updated: [${updatedProduct.id}] ${updatedProduct.name}`);
    } else {
        const newProduct = {
            id: generateId(),
            ...productData,
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate()
        };
        state.products = addProductToState(state.products, newProduct);
        showSnackbar('Successfully added a new product');
    }

    toggleModal(false);
    renderProducts();
};

const handleDeleteProduct = (id) => {
    state.products = deleteProductFromState(state.products, id);
    showSnackbar('Deleted successfully');
    renderProducts();
};

const handleFilter = (e) => {
    if (!e.target.classList.contains('btn--filter')) return;
    state.filter = e.target.getAttribute('data-category');
    renderProducts();
};

const handleSort = (e) => {
    if (!e.target.classList.contains('btn--sort')) return;
    state.sort = e.target.getAttribute('data-sort');
    renderProducts();
};

// Initialization
const initApp = () => {
    DOM.btnAddProduct.addEventListener('click', () => toggleModal(true, false));
    DOM.btnCloseModal.addEventListener('click', () => toggleModal(false));
    DOM.modal.addEventListener('click', (event) => { if (event.target === DOM.modal) toggleModal(false); });
    DOM.form.addEventListener('submit', handleFormSubmit);
    DOM.filterControls.addEventListener('click', handleFilter);
    DOM.sortControls.addEventListener('click', handleSort);

    renderProducts();
};

initApp();