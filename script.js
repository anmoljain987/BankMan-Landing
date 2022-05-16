"use strict";
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const navLinks = document.querySelector(".nav__links");
const header = document.querySelector("header");
const slides = document.querySelectorAll(".slide");
const buttonLeft = document.querySelector(".slider__btn--left");
const buttonRight = document.querySelector(".slider__btn--right");
const slider = document.querySelector(".slider");
const dotContainer = document.querySelector(".dots");
const login = document.querySelector(".login");
const loginSubmit = document.querySelector(".login--submit");
let currSlide = 0;
const maxSlides = slides.length - 1;
////////////////////////////////////////
// Scrolling

btnScrollTo.addEventListener("click", scroll_sec1);
function scroll_sec1(e) {
  section1.scrollIntoView({ behavior: "smooth" });
}

///////////////////////////////////////
// Scrolling Through Navbar

navLinks.addEventListener("click", scroll__positions);
function scroll__positions(e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__section")) {
    const id = e.target.getAttribute("href");

    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
}

loginSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href = "https://bankman.netlify.app";
});
login.addEventListener("click", (e) => {
  window.location.href = "https://bankman.netlify.app";
});

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
/////////////
// Tab Components
tabsContainer.addEventListener("click", tabsSwitch);
function tabsSwitch(e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) {
    return;
  }
  tabs.forEach((el) => el.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");
  const content = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  tabsContent.forEach((el) =>
    el.classList.remove("operations__content--active")
  );
  content.classList.add("operations__content--active");
}

///////////////////////////////////////
///////Menu Fade Animation

nav.addEventListener("mouseover", (e) => handleHover(e, 0.5));
nav.addEventListener("mouseout", (e) => handleHover(e, 1));

function handleHover(e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector(".nav__logo--container");

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
      logo.style.opacity = opacity;
    });
  }
}

////////////
// Sticky navigation ----Intersection Observer
const navHeight = nav.getBoundingClientRect();

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});

observer.observe(header);

/////////
// Lazy Loading
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    return;
  }
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
const sections = document.querySelectorAll("section");
sections.forEach((el) => {
  sectionObserver.observe(el);
  el.classList.add("section--hidden");
});

/////////////////
//lazyloading-images

const pictures = document.querySelectorAll("img[data-src]");

const loadImages = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
const pictureObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.5,
  rootMargin: "-200px",
});
pictures.forEach((el) => pictureObserver.observe(el));
//////////////
/// Slider

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();
const activateDot = (slide) => {
  document
    .querySelectorAll(".dots__dot")
    .forEach((el) => el.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};
///////Slide movement
const moveSlide = (slide) => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
moveSlide(0);
activateDot(0);
const nextSlide = () => {
  if (currSlide === maxSlides) {
    currSlide = 0;
  } else {
    currSlide++;
  }

  moveSlide(currSlide);
  activateDot(currSlide);
};
const prevSlide = () => {
  if (currSlide === 0) {
    currSlide = maxSlides;
  } else {
    currSlide--;
  }
  moveSlide(currSlide);
  activateDot(currSlide);
};

buttonRight.addEventListener("click", nextSlide);

buttonLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevSlide();
  e.key === "ArrowRight" && nextSlide();
});

dotContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dots__dot")) {
    const { slide } = e.target.dataset;
    moveSlide(slide);
    activateDot(slide);
  }
});
