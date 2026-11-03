// CONFIGURACIÓN: Ingresa tu número telefónico con código de país (Ej: Colombia +57)
const PHONE_NUMBER = "573000000000"; 

// ESTADO INICIAL DEL PASTEL
const cakeState = {
  sizeName: "Media Libra",
  sizeMultiplier: 0.5,
  sizeClass: "cake-size-media",
  flavourName: "Vainilla Tradicional",
  basePrice: 35000,
  typeName: "Crema Fría / Chantilly",
  typeCategory: "Fría",
  typeExtraPrice: 0,
  creamColor: "#FFF8DC",
  toppings: [],
  customText: ""
};

// ELEMENTOS DOM
const cakeLayersContainer = document.getElementById('cake-layers');
const totalPriceEl = document.getElementById('total-price');
const flavourSelect = document.getElementById('flavour-select');
const typeSelect = document.getElementById('type-select');
const customTextInput = document.getElementById('custom-text');
const whatsappBtn = document.getElementById('whatsapp-btn');

// 1. Selector de Tamaño (Media Libra < Tres Cuartos < 1 Libra)
document.querySelectorAll('#size-selector .btn-option').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('#size-selector .btn-option').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    cakeState.sizeName = e.target.innerText;
    cakeState.sizeMultiplier = parseFloat(e.target.dataset.multiplier);
    
    const sizeKey = e.target.dataset.size;
    cakeState.sizeClass = `cake-size-${sizeKey}`;
    
    updateGame();
  });
});

// 2. Selector de Tipo de Torta
typeSelect.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  cakeState.typeName = selectedOption.text.split(' (+$')[0];
  cakeState.typeCategory = selectedOption.dataset.category;
  cakeState.typeExtraPrice = parseInt(selectedOption.dataset.priceExtra || 0);
  updateGame();
});

// 3. Selector de Sabor del Bizcocho
flavourSelect.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  cakeState.flavourName = selectedOption.text.split(' ($')[0];
  cakeState.basePrice = parseInt(selectedOption.dataset.price);
  updateGame();
});

// 4. Selector del Color de la Crema
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    cakeState.creamColor = e.target.dataset.color;
    updateGame();
  });
});

// 5. Toppings y Extras (Marcar/Desmarcar)
document.querySelectorAll('.topping-check').forEach(check => {
  check.addEventListener('change', () => {
    cakeState.toppings = Array.from(document.querySelectorAll('.topping-check:checked'))
                              .map(c => c.value);
    updateGame();
  });
});

// 6. Texto personalizado
customTextInput.addEventListener('input', (e) => {
  cakeState.customText = e.target.value;
  updateGame();
});

// RENDERIZAR EL PASTELES Y SUS DECORACIONES EN TIEMPO REAL
function renderCake() {
  cakeLayersContainer.innerHTML = '';

  const tier = document.createElement('div');
  tier.className = `tier ${cakeState.sizeClass}`;
  tier.style.backgroundColor = cakeState.creamColor;

  // EFECTO 1: Extra Chocolate Chorreado (Drip)
  if (cakeState.toppings.includes('Chocolate chorreado')) {
    const drip = document.createElement('div');
    drip.className = 'drip-layer';
    tier.appendChild(drip);
  }

  // EFECTO 2: Chispas de Colores
  if (cakeState.toppings.includes('Chispas de colores')) {
    const sprinkles = document.createElement('div');
    sprinkles.className = 'sprinkles-layer';
    tier.appendChild(sprinkles);
  }

  // EFECTO 3: Chispas de Chocolate
  if (cakeState.toppings.includes('Chispas de chocolate')) {
    const chocoChips = document.createElement('div');
    chocoChips.className = 'choco-chips-layer';
    tier.appendChild(chocoChips);
  }

  // EFECTO 4: Masmelos
  if (cakeState.toppings.includes('Masmelos')) {
    const marshContainer = document.createElement('div');
    marshContainer.className = 'marshmallows-layer';
    marshContainer.innerHTML = `
      <div class="marshmallow"></div>
      <div class="marshmallow"></div>
      <div class="marshmallow"></div>
      <div class="marshmallow"></div>
    `;
    tier.appendChild(marshContainer);
  }

  // Texto personalizado en el pastel
  if (cakeState.customText) {
    const textOverlay = document.createElement('div');
    textOverlay.className = 'cake-text-overlay';
    textOverlay.innerText = cakeState.customText;
    tier.appendChild(textOverlay);
  }

  cakeLayersContainer.appendChild(tier);
}

// CÁLCULO DEL PRECIO TOTAL
function calculatePrice() {
  let total = (cakeState.basePrice + cakeState.typeExtraPrice) * cakeState.sizeMultiplier;
  
  document.querySelectorAll('.topping-check:checked').forEach(c => {
    total += parseInt(c.dataset.price);
  });

  return Math.round(total);
}

// ACTUALIZAR ESTADO DE LA APP
function updateGame() {
  renderCake();
  const total = calculatePrice();
  totalPriceEl.innerText = `$${total.toLocaleString('es-CO')}`;
}

// ENVIAR A WHATSAPP
whatsappBtn.addEventListener('click', () => {
  const total = calculatePrice();
  const toppingsList = cakeState.toppings.length > 0 ? cakeState.toppings.join(', ') : 'Ninguno';
  const textoMsg = cakeState.customText ? `"${cakeState.customText}"` : 'Sin mensaje';

  const message = `👋 ¡Hola! Diseñé un pastel en tu página web y quiero hacer el pedido:%0A%0A` +
    `📏 *Tamaño:* ${cakeState.sizeName}%0A` +
    `🌡️ *Tipo de Torta:* Torta ${cakeState.typeCategory} (${cakeState.typeName})%0A` +
    `🍰 *Sabor de Bizcocho:* ${cakeState.flavourName}%0A` +
    `🍫 *Toppings/Extras:* ${toppingsList}%0A` +
    `✍️ *Texto en pastel:* ${textoMsg}%0A` +
    `💰 *Total Estimado:* $${total.toLocaleString('es-CO')}%0A%0A` +
    `¿Me confirmas disponibilidad para agenda?`;

  window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
});

// Inicializar al cargar
updateGame();
