// Toggle del menú en móviles
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Navegación entre secciones
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');

menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remover clase active de todos los items
        menuItems.forEach(mi => mi.classList.remove('active'));
        // Agregar clase active al item clickeado
        item.classList.add('active');
        
        // Ocultar todas las secciones
        contentSections.forEach(section => section.classList.remove('active'));
        
        // Mostrar la sección correspondiente
        const sectionId = item.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Cerrar sidebar en móviles después de seleccionar
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    });
});

// Ventas: datos y lógica
const products = [];

const productSelect = document.getElementById('product-select');
const quantityInput = document.getElementById('quantity-input');
const totalAmount = document.getElementById('total-amount');
const saleForm = document.getElementById('sale-form');
const salesList = document.getElementById('sales-list');
const saleMessage = document.getElementById('sale-message');
const ventasHoyMetric = document.getElementById('ventas-hoy-metric');

const customerNameInput = document.getElementById('customer-name');
const customerPhoneInput = document.getElementById('customer-phone');
const customerIdInput = document.getElementById('customer-id');
const customerAddressInput = document.getElementById('customer-address');
const saleDateInput = document.getElementById('sale-date');

// Reportes
const reportFromInput = document.getElementById('report-from');
const reportToInput = document.getElementById('report-to');
const reportCustomerInput = document.getElementById('report-customer');
const reportRefreshBtn = document.getElementById('report-refresh');
const reportTotalCount = document.getElementById('report-total-count');
const reportTotalAmount = document.getElementById('report-total-amount');
const reportTableBody = document.getElementById('report-table-body');

// Configuración
const languageSelect = document.getElementById('language-select');
const themeSelect = document.getElementById('theme-select');
const currencySelect = document.getElementById('currency-select');
const saveSettingsBtn = document.getElementById('save-settings');
const settingsMessage = document.getElementById('settings-message');

// Productos
const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productStockInput = document.getElementById('product-stock');
const productMessage = document.getElementById('product-message');
const productTableBody = document.getElementById('product-table-body');

let ventasHoyTotal = 5678; // valor inicial simulador
let sales = [];
let currencySymbol = '$';
let editingProductId = null;

function setProductFormState(editing = false) {
    const submitBtn = productForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = editing ? 'Guardar cambios' : (languageSelect.value === 'en' ? 'Add Product' : 'Agregar producto');
    }
    productNameInput.focus();
}

function populateProductOptions() {
    productSelect.innerHTML = '<option value="" disabled selected>Seleccione un producto</option>';
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - $${product.price.toFixed(2)} (${product.stock} en stock)`;
        if (product.stock <= 0) {
            option.disabled = true;
        }
        productSelect.appendChild(option);
    });
}

function renderProductTable() {
    productTableBody.innerHTML = '';
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td class="${product.stock <= 0 ? 'out-of-stock' : ''}">${product.stock}</td>
            <td>
                <button class="action-btn" data-id="${product.id}" data-action="edit">Editar</button>
                <button class="action-btn" data-id="${product.id}" data-action="delete">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });
}

function refreshProductAreas() {
    populateProductOptions();
    renderProductTable();
    if (productMessage) {
        productMessage.textContent = '';
    }
}

function updateTotal() {
    const selectedProductId = productSelect.value;
    const quantity = Number(quantityInput.value);

    if (!selectedProductId || quantity < 1) {
        totalAmount.textContent = '$0.00';
        return;
    }

    const product = products.find(p => p.id === selectedProductId);
    const total = product.price * quantity;
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

const translations = {
    es: {
        appTitle: 'Mi Dashboard',
        menuDashboard: '📊 Dashboard',
        menuUsuarios: '👥 Usuarios',
        menuProductos: '📦 Productos',
        menuVentas: '💰 Ventas',
        menuConfiguracion: '⚙️ Configuración',
        menuReportes: '📈 Reportes',
        dashboardTitle: 'Dashboard Principal',
        usuariosTitle: 'Gestión de Usuarios',
        productosTitle: 'Gestión de Productos',
        ventasTitle: 'Ventas',
        configuracionTitle: 'Configuración',
        reportesTitle: 'Reportes',
        customerName: 'Nombre Cliente:',
        customerPhone: 'Teléfono:',
        customerId: 'Cédula / DNI:',
        customerAddress: 'Dirección:',
        saleDate: 'Fecha de Venta:',
        productSelect: 'Producto:',
        quantity: 'Cantidad:',
        total: 'Total:',
        saleBtn: 'Realizar venta',
        salesHistory: 'Ventas realizadas',
        productName: 'Nombre:',
        productPrice: 'Precio:',
        productStock: 'Stock:',
        addProductBtn: 'Agregar producto',
        delete: 'Eliminar',
        reportFrom: 'Desde',
        reportTo: 'Hasta',
        reportCustomer: 'Cliente',
        reportRefresh: 'Actualizar',
        reportTotalSales: 'Total ventas:',
        reportTotalAmount: 'Monto total:',
        reportDate: 'Fecha',
        reportCust: 'Cliente',
        reportProd: 'Producto',
        reportQty: 'Cantidad',
        reportTotal: 'Total',
        theme: 'Tema',
        currency: 'Moneda',
        language: 'Idioma',
        saveConfig: 'Guardar configuración',
        settingsSaved: 'Configuración guardada.'
    },
    en: {
        appTitle: 'My Dashboard',
        menuDashboard: '📊 Dashboard',
        menuUsuarios: '👥 Users',
        menuProductos: '📦 Products',
        menuVentas: '💰 Sales',
        menuConfiguracion: '⚙️ Settings',
        menuReportes: '📈 Reports',
        dashboardTitle: 'Main Dashboard',
        usuariosTitle: 'User Management',
        productosTitle: 'Product Management',
        ventasTitle: 'Sales',
        configuracionTitle: 'Settings',
        reportesTitle: 'Reports',
        customerName: 'Customer Name:',
        customerPhone: 'Phone:',
        customerId: 'ID / DNI:',
        customerAddress: 'Address:',
        saleDate: 'Sale Date:',
        productSelect: 'Product:',
        quantity: 'Quantity:',
        total: 'Total:',
        saleBtn: 'Process Sale',
        salesHistory: 'Sales History',
        productName: 'Name:',
        productPrice: 'Price:',
        productStock: 'Stock:',
        addProductBtn: 'Add Product',
        delete: 'Delete',
        reportFrom: 'From',
        reportTo: 'To',
        reportCustomer: 'Customer',
        reportRefresh: 'Refresh',
        reportTotalSales: 'Total sales:',
        reportTotalAmount: 'Total amount:',
        reportDate: 'Date',
        reportCust: 'Customer',
        reportProd: 'Product',
        reportQty: 'Quantity',
        reportTotal: 'Total',
        theme: 'Theme',
        currency: 'Currency',
        language: 'Language',
        saveConfig: 'Save settings',
        settingsSaved: 'Settings saved.'
    }
};

function formatCurrency(value) {
    return `${currencySymbol}${Number(value).toFixed(2)}`;
}

function applyLanguage() {
    const lang = languageSelect.value;
    const t = translations[lang] || translations.es;

    document.querySelector('h1').textContent = t.appTitle;
    document.querySelector('[data-section="dashboard"]').textContent = t.menuDashboard;
    document.querySelector('[data-section="usuarios"]').textContent = t.menuUsuarios;
    document.querySelector('[data-section="productos"]').textContent = t.menuProductos;
    document.querySelector('[data-section="ventas"]').textContent = t.menuVentas;
    document.querySelector('[data-section="configuracion"]').textContent = t.menuConfiguracion;
    document.querySelector('[data-section="reportes"]').textContent = t.menuReportes;

    document.querySelector('#dashboard h2').textContent = t.dashboardTitle;
    document.querySelector('#usuarios h2').textContent = t.usuariosTitle;
    document.querySelector('#productos h2').textContent = t.productosTitle;
    document.querySelector('#ventas h2').textContent = t.ventasTitle;
    document.querySelector('#configuracion h2').textContent = t.configuracionTitle;
    document.querySelector('#reportes h2').textContent = t.reportesTitle;

    document.querySelector('label[for="customer-name"]').textContent = t.customerName;
    document.querySelector('label[for="customer-phone"]').textContent = t.customerPhone;
    document.querySelector('label[for="customer-id"]').textContent = t.customerId;
    document.querySelector('label[for="customer-address"]').textContent = t.customerAddress;
    document.querySelector('label[for="sale-date"]').textContent = t.saleDate;
    document.querySelector('label[for="product-select"]').textContent = t.productSelect;
    document.querySelector('label[for="quantity-input"]').textContent = t.quantity;
    document.querySelector('.total-row span:first-child').textContent = t.total;
    document.querySelector('#sale-form button').textContent = t.saleBtn;
    document.querySelector('.sales-history h3').textContent = t.salesHistory;

    document.querySelector('label[for="product-name"]').textContent = t.productName;
    document.querySelector('label[for="product-price"]').textContent = t.productPrice;
    document.querySelector('label[for="product-stock"]').textContent = t.productStock;
    document.querySelector('#product-form button').textContent = t.addProductBtn;

    document.querySelector('label[for="report-from"]').textContent = t.reportFrom;
    document.querySelector('label[for="report-to"]').textContent = t.reportTo;
    document.querySelector('label[for="report-customer"]').textContent = t.reportCustomer;
    document.querySelector('#report-refresh').textContent = t.reportRefresh;
    const p1 = document.querySelector('.report-summary p:nth-child(1)');
    const p2 = document.querySelector('.report-summary p:nth-child(2)');
    if (p1) p1.childNodes[0].textContent = `${t.reportTotalSales} `;
    if (p2) p2.childNodes[0].textContent = `${t.reportTotalAmount} `;

    const productHeader = document.querySelectorAll('.product-table th');
    if (productHeader.length >= 4) {
        productHeader[0].textContent = t.reportProd;
        productHeader[1].textContent = t.productPrice;
        productHeader[2].textContent = t.productStock;
        productHeader[3].textContent = t.delete;
    }

    const reportHeader = document.querySelectorAll('.report-table th');
    if (reportHeader.length >= 5) {
        reportHeader[0].textContent = t.reportDate;
        reportHeader[1].textContent = t.reportCust;
        reportHeader[2].textContent = t.reportProd;
        reportHeader[3].textContent = t.reportQty;
        reportHeader[4].textContent = t.reportTotal;
    }

    document.querySelector('label[for="theme-select"]').textContent = t.theme;
    document.querySelector('label[for="currency-select"]').textContent = t.currency;
    document.querySelector('label[for="language-select"]').textContent = t.language;
    document.querySelector('#save-settings').textContent = t.saveConfig;

    setProductFormState(!!editingProductId);
}

function applySettings() {
    const theme = themeSelect.value;
    document.body.classList.toggle('light-theme', theme === 'light');

    currencySymbol = currencySelect.value;
    applyLanguage();
    updateTotal();
    refreshSalesUI();
}

function setSaleDate() {
    const now = new Date();
    saleDateInput.value = now.toLocaleString('es-ES', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function refreshSalesUI() {
    salesList.innerHTML = '';
    sales.slice(-10).reverse().forEach(sale => {
        const li = document.createElement('li');
        li.textContent = `${sale.timestamp} - ${sale.customerName} (${sale.customerPhone}) - ${sale.productName} x${sale.quantity} - ${formatCurrency(sale.subtotal)}`;
        li.title = `Cédula: ${sale.customerId} | Dirección: ${sale.customerAddress}`;
        salesList.appendChild(li);
    });
    ventasHoyMetric.textContent = formatCurrency(ventasHoyTotal);
    updateReport();
}

function updateReport() {
    const fromDate = reportFromInput.value ? new Date(reportFromInput.value) : null;
    const toDate = reportToInput.value ? new Date(reportToInput.value) : null;
    const customerFilter = reportCustomerInput.value.trim().toLowerCase();

    const filteredSales = sales.filter(sale => {
        const saleDateTime = new Date(sale.saleDate.split(' ')[0].split('/').reverse().join('-'));

        const matchesFrom = fromDate ? saleDateTime >= fromDate : true;
        const matchesTo = toDate ? saleDateTime <= toDate : true;
        const matchesCustomer = customerFilter ? sale.customerName.toLowerCase().includes(customerFilter) : true;

        return matchesFrom && matchesTo && matchesCustomer;
    });

    reportTableBody.innerHTML = '';

    let totalAmount = 0;
    filteredSales.forEach(sale => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sale.saleDate}</td>
            <td>${sale.customerName}</td>
            <td>${sale.productName}</td>
            <td>${sale.quantity}</td>
            <td>${formatCurrency(sale.subtotal)}</td>
        `;
        reportTableBody.appendChild(tr);
        totalAmount += sale.subtotal;
    });

    reportTotalCount.textContent = filteredSales.length;
    reportTotalAmount.textContent = formatCurrency(totalAmount);
}


populateProductOptions();
renderProductTable();
updateTotal();
setSaleDate();
applyLanguage();

productSelect.addEventListener('change', updateTotal);
quantityInput.addEventListener('input', updateTotal);

reportRefreshBtn.addEventListener('click', (e) => {
    e.preventDefault();
    updateReport();
});

reportFromInput.addEventListener('change', updateReport);
reportToInput.addEventListener('change', updateReport);
reportCustomerInput.addEventListener('input', updateReport);

saveSettingsBtn.addEventListener('click', () => {
    applySettings();
    settingsMessage.textContent = 'Configuración guardada.';
    settingsMessage.style.color = '#a5ffb3';
});

themeSelect.addEventListener('change', applySettings);
currencySelect.addEventListener('change', applySettings);
languageSelect.addEventListener('change', applyLanguage);

productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = productNameInput.value.trim();
    const price = Number(productPriceInput.value);
    const stock = Number(productStockInput.value);

    if (!name || price <= 0 || stock < 0) {
        productMessage.textContent = 'Complete datos válidos de producto.';
        productMessage.style.color = '#ff6868';
        return;
    }

    const existing = products.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
        productMessage.textContent = 'Producto ya existe, use otro nombre.';
        productMessage.style.color = '#ff6868';
        return;
    }

    if (editingProductId) {
        const product = products.find(p => p.id === editingProductId);
        if (product) {
            product.name = name;
            product.price = price;
            product.stock = stock;
            productMessage.textContent = `Producto actualizado: ${name}`;
            productMessage.style.color = '#a5ffb3';
        }
        editingProductId = null;
        setProductFormState(false);
    } else {
        const newProduct = {
            id: `prod-${Date.now()}`,
            name,
            price,
            stock
        };

        products.push(newProduct);
        productMessage.textContent = `Producto agregado: ${name}`;
        productMessage.style.color = '#a5ffb3';
    }

    renderProductTable();
    populateProductOptions();

    productNameInput.value = '';
    productPriceInput.value = '';
    productStockInput.value = '1';
    setProductFormState(false);
});

productTableBody.addEventListener('click', (event) => {
    const target = event.target;
    const productId = target.dataset.id;

    if (!productId) return;

    if (target.matches('[data-action="delete"]')) {
        const index = products.findIndex(p => p.id === productId);
        if (index >= 0) {
            products.splice(index, 1);
            renderProductTable();
            populateProductOptions();
        }
    }

    if (target.matches('[data-action="edit"]')) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        editingProductId = productId;
        productNameInput.value = product.name;
        productPriceInput.value = product.price;
        productStockInput.value = product.stock;
        setProductFormState(true);
        productMessage.textContent = 'Editando producto...';
        productMessage.style.color = '#a5ffb3';
    }
});

saleForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedProductId = productSelect.value;
    const quantity = Number(quantityInput.value);
    const customerName = customerNameInput.value.trim();
    const customerPhone = customerPhoneInput.value.trim();
    const customerId = customerIdInput.value.trim();
    const customerAddress = customerAddressInput.value.trim();
    const saleDate = saleDateInput.value.trim();

    if (!customerName || !customerPhone || !customerId || !customerAddress) {
        saleMessage.textContent = 'Por favor completa los datos del cliente.';
        saleMessage.style.color = '#ff6868';
        return;
    }

    if (!selectedProductId || quantity < 1) {
        saleMessage.textContent = 'Por favor selecciona producto y cantidad válida.';
        saleMessage.style.color = '#ff6868';
        return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product || product.stock <= 0) {
        saleMessage.textContent = 'El producto no tiene stock disponible.';
        saleMessage.style.color = '#ff6868';
        return;
    }

    if (quantity > product.stock) {
        saleMessage.textContent = `Cantidad superior al stock disponible (${product.stock}).`;
        saleMessage.style.color = '#ff6868';
        return;
    }

    const subtotal = product.price * quantity;

    const sale = {
        customerName,
        customerPhone,
        customerId,
        customerAddress,
        saleDate,
        productName: product.name,
        quantity,
        subtotal,
        timestamp: new Date().toLocaleString('es-ES', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
        })
    };

    sales.push(sale);
    ventasHoyTotal += subtotal;
    product.stock -= quantity;

    refreshSalesUI();
    refreshProductAreas();

    saleMessage.textContent = `Venta realizada: ${customerName} - ${product.name} x${quantity} - ${formatCurrency(subtotal)}`;
    saleMessage.style.color = '#a5ffb3';

    customerNameInput.value = '';
    customerPhoneInput.value = '';
    customerIdInput.value = '';
    customerAddressInput.value = '';
    productSelect.value = '';
    quantityInput.value = 1;
    setSaleDate();
    updateTotal();
});
