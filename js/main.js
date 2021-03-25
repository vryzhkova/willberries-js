const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

// cart

const buttonCart = document.querySelector(".button-cart");
const modalCart = document.querySelector("#modal-cart");

const openModal = function () {
  modalCart.classList.add("show");
};

const closeModal = function () {
  modalCart.classList.remove("show");
};

buttonCart.addEventListener("click", openModal);

modalCart.addEventListener("click", function (event) {
  const target = event.target;
  if (
    target.classList.contains("overlay") ||
    target.classList.contains("modal-close")
  ) {
    closeModal();
  }
});
// csroll smooth

{
  const scrollLinks = document.querySelectorAll("a.scroll-link");

  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener("click", function (event) {
      event.preventDefault();
      const id = scrollLink.getAttribute("href");
      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
}

// goods

const more = document.querySelector(".more");
const navigationLink = document.querySelectorAll(".navigation-link");
const longGoodsList = document.querySelector(".long-goods-list");

// Функция получения товаров

const getGoods = async function () {
  const result = await fetch("db/db.json");
  if (!result.ok) {
    throw "Ошибочка вышла: " + result.status;
  }
  return await result.json();
};

// Создаем карточки

const createCard = function ({ label, name, img, description, id, price }) {
  const card = document.createElement("div");
  card.className = "col-lg-3 col-sm-6";

  card.innerHTML = `
          <div class="goods-card">
            ${label ? `<span class="label">${label}</span>` : ""}
              <img src="db/${img}" alt="${name}" class="goods-image"/>
              <h3 class="goods-title">${name}</h3>
              <p class="goods-description">${description}</p>
              <button class="button goods-card-btn add-to-cart" data-id="${id}">
                <span class="button-price">$${price}</span>
              </button>
          </div>
                `;

  return card;
};

// Выводим на страницу (рендерим) карточки

const renderCards = function (data) {
  longGoodsList.textContent = "";
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add("show-goods");
};

more.addEventListener("click", function (event) {
  event.preventDefault();
  getGoods().then(renderCards);
});

const filterCards = function (field, value) {
  getGoods()
    .then(function (data) {
      const filterGoods = data.filter(function (good) {
        return good[field] === value;
      });
      return filterGoods;
    })
    .then(renderCards);
};

navigationLink.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    filterCards(field, value);
  });
});
