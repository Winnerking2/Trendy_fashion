const products = [
  {
    id: "sunday-dress",
    name: "The Sunday Dress",
    detail: "Cotton · Poppy red",
    price: 128,
    tag: "",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=82",
    alt: "Flowing red dress with a clean, feminine silhouette",
  },
  {
    id: "everyday-tote",
    name: "Everyday Tote",
    detail: "Leather · Poppy red",
    price: 164,
    tag: "",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=82",
    alt: "Structured red leather handbag",
  },
  {
    id: "soft-structure-blazer",
    name: "Soft Structure Blazer",
    detail: "Linen blend · Sand",
    price: 198,
    compareAt: 248,
    tag: "Sale",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=82",
    alt: "Tailored neutral blazer in a soft linen blend",
  },
  {
    id: "the-weekender",
    name: "The Weekender",
    detail: "Relaxed fit · Natural",
    price: 96,
    tag: "",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=82",
    alt: "Relaxed everyday fashion in soft natural tones",
  },
  {
    id: "daylight-knit",
    name: "Daylight Knit",
    detail: "Fine merino · Oat",
    price: 112,
    tag: "",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=82",
    alt: "Soft neutral knitwear with a timeless shape",
  },
  {
    id: "city-loafer",
    name: "City Loafer",
    detail: "Leather · Dark espresso",
    price: 146,
    tag: "",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=82",
    alt: "Classic leather shoes styled for everyday wear",
  },
  {
    id: "studio-trouser",
    name: "Studio Trouser",
    detail: "Fluid twill · Stone",
    price: 118,
    tag: "",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=82",
    alt: "Modern tailored trousers in a light neutral shade",
  },
  {
    id: "golden-hour-scarf",
    name: "Golden Hour Scarf",
    detail: "Silk blend · Printed",
    price: 68,
    tag: "",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=82",
    alt: "Silk scarf in a refined, warm-toned print",
  },
];

const productGrid = document.querySelector("#product-grid");
const bagCounts = document.querySelectorAll(".bag-count");
const bagButtons = document.querySelectorAll(".bag-button");
const drawerCount = document.querySelector(".drawer-count");
const cartDrawer = document.querySelector(".cart-drawer");
const cartBackdrop = document.querySelector(".cart-backdrop");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartSubtotal = document.querySelector(".cart-subtotal strong");
const checkoutButton = document.querySelector(".checkout-button");
const toast = document.querySelector(".toast");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const cart = new Map();
let toastTimeout;
let cartTrigger;

const money = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrap">
            <img class="product-image" src="${product.image}" alt="${product.alt}" loading="lazy" />
            ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
            <button class="quick-add" type="button" data-add="${product.id}" aria-label="Add ${product.name} to bag">Quick add <span aria-hidden="true">+</span></button>
          </div>
          <div class="product-meta">
            <div><h3>${product.name}</h3><p>${product.detail}</p></div>
            <span class="product-price">${product.compareAt ? `<del>${money(product.compareAt)}</del> ` : ""}${money(product.price)}</span>
          </div>
        </article>`,
    )
    .join("");
}

function getItemCount() {
  return [...cart.values()].reduce((total, item) => total + item.quantity, 0);
}

function renderCart() {
  const count = getItemCount();
  bagCounts.forEach((element) => {
    element.textContent = count;
  });
  drawerCount.textContent = `(${count})`;
  cartEmpty.hidden = count > 0;
  cartItems.innerHTML = [...cart.values()]
    .map(
      ({ product, quantity }) => `
        <article class="cart-line">
          <img src="${product.image}" alt="" />
          <div>
            <h3>${product.name}</h3>
            <p>${product.detail}</p>
            <div class="quantity-controls" aria-label="Quantity for ${product.name}">
              <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
              <span>${quantity}</span>
              <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button>
            </div>
          </div>
          <span class="cart-line-price">${money(product.price * quantity)}</span>
          <button class="remove-item" type="button" data-remove="${product.id}">Remove</button>
        </article>`,
    )
    .join("");
  cartSubtotal.textContent = money(
    [...cart.values()].reduce((total, item) => total + item.product.price * item.quantity, 0),
  );
  checkoutButton.disabled = count === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function openCart(event) {
  cartTrigger = event.currentTarget;
  cartBackdrop.hidden = false;
  requestAnimationFrame(() => cartBackdrop.classList.add("is-visible"));
  cartDrawer.classList.add("is-open");
  cartDrawer.removeAttribute("inert");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  document.querySelector(".cart-close").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartBackdrop.classList.remove("is-visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.setAttribute("inert", "");
  document.body.classList.remove("no-scroll");
  window.setTimeout(() => {
    if (!cartDrawer.classList.contains("is-open")) cartBackdrop.hidden = true;
  }, 250);
  cartTrigger?.focus();
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.add);
  if (!product) return;
  const existing = cart.get(product.id);
  cart.set(product.id, { product, quantity: (existing?.quantity ?? 0) + 1 });
  renderCart();
  showToast(`${product.name} added to your bag`);
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const item = cart.get(quantityButton.dataset.quantity);
    if (!item) return;
    const quantity = item.quantity + Number(quantityButton.dataset.change);
    if (quantity <= 0) cart.delete(item.product.id);
    else cart.set(item.product.id, { ...item, quantity });
    renderCart();
  } else if (removeButton) {
    cart.delete(removeButton.dataset.remove);
    renderCart();
  }
});

bagButtons.forEach((button) => button.addEventListener("click", openCart));
document.querySelector(".cart-close").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartDrawer.classList.contains("is-open")) closeCart();
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  if (getItemCount() > 0) showToast("Your bag is ready for checkout.");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#email-address");
  const feedback = document.querySelector("#newsletter-feedback");
  if (!input.validity.valid) {
    feedback.textContent = input.value.trim() ? "Please enter a valid email address." : "Please enter your email address to join us.";
    feedback.className = "newsletter-feedback error";
    input.focus();
    return;
  }
  feedback.textContent = "Thanks for your interest. Newsletter updates will be available soon.";
  feedback.className = "newsletter-feedback success";
  input.value = "";
});

renderProducts();
renderCart();
