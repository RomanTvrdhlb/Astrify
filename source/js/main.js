//-----vars--------------------------------------------
const activeMode = "active-mode",
  activeClass = "active",
  windowEl = window,
  documentEl = document,
  htmlEl = document.documentElement,
  bodyEl = document.body,
  overlay = document.querySelector("[data-overlay]"),
  modals = [...document.querySelectorAll("[data-popup]")],
  modalsButton = [...document.querySelectorAll("[data-btn-modal]")],
  innerButtonModal = [...document.querySelectorAll("[data-btn-inner]")];
//-----------------------------------------------------

//-----custom-functions--------------------------------
const removeCustomClass = (item, customClass = "active") => {
  item.classList.remove(customClass);
};

const addCustomClass = (item, customClass = "active") => {
  item.classList.add(customClass);
};

const addClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.add(customClass);
  });
};

const removeClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.remove(customClass);
  });
};

const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const pagePosition = window.scrollY;
  const paddingOffset = `${window.innerWidth - bodyEl.offsetWidth}px`;

  htmlEl.style.scrollBehavior = "none";
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  bodyEl.style.paddingRight = paddingOffset;
  bodyEl.classList.add("dis-scroll");
  bodyEl.dataset.position = pagePosition;
  bodyEl.style.top = `-${pagePosition}px`;
};

const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const pagePosition = parseInt(bodyEl.dataset.position, 10);
  fixBlocks.forEach((el) => {
    el.style.paddingRight = "0px";
  });
  bodyEl.style.paddingRight = "0px";

  bodyEl.style.top = "auto";
  bodyEl.classList.remove("dis-scroll");
  window.scroll({
    top: pagePosition,
    left: 0,
  });
};

const fadeIn = (el, timeout, display) => {
  el.style.opacity = 0;
  el.style.display = display || "block";
  el.style.transition = `all ${timeout}ms`;
  setTimeout(() => {
    el.style.opacity = 1;
  }, 10);
};

const fadeOut = (el, timeout) => {
  el.style.opacity = 1;
  el.style.transition = `all ${timeout}ms ease`;
  el.style.opacity = 0;

  setTimeout(() => {
    el.style.display = "none";
  }, timeout);
};
//-----------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const copyForms = document.querySelectorAll("[data-parent-copy]");

  copyForms &&
    copyForms.forEach(function (copyForm) {
      const copyButton = copyForm.querySelector("[data-copy]");
      const input = copyForm.querySelector("input");
      const originalValue = input.value;

      copyButton.addEventListener("click", async function (e) {
        e.preventDefault();
        if (input.value === originalValue) {
          try {
            await navigator.clipboard.writeText(input.value);
            input.value = "Success";
            input.style.color = "rgb(42 233 42)";
            input.style.fontWeight = "500";
          } catch (err) {
            console.error("Failed to copy: ", err);
          }
        }
      });
    });
});


//-------------------modals----------------------------

let innerButton;
const commonFunction = function () {
  removeCustomClass(overlay, activeMode);
  removeCustomClass(overlay, activeClass);
  removeCustomClass(overlay, "mode");
  removeClassInArray(modals, activeClass);

  modals.forEach((modal) => fadeOut(modal, 300));
  enableScroll();
};

function findAttribute(element, attributeName) {
  let target = element;
  while (target && target !== document) {
    if (target.hasAttribute(attributeName)) {
      return target.getAttribute(attributeName);
    }
    target = target.parentNode;
  }
  return null;
}

function buttonClickHandler(e, buttonAttribute, activeClass) {
  e.preventDefault();
  const currentModalId = findAttribute(e.target, buttonAttribute);
  if (!currentModalId) {
    return;
  }

  const currentModal = overlay.querySelector(
    `[data-popup="${currentModalId}"]`
  );

  removeClassInArray(modals, activeClass);

  if (currentModal && currentModal.getAttribute("data-popup") === "filter") {
    addCustomClass(overlay, "mode");
  }

  addCustomClass(overlay, activeClass);
  addCustomClass(overlay, activeMode);
  addCustomClass(currentModal, activeClass);
  fadeIn(currentModal, 200, "flex");

  disableScroll();
  innerButton = overlay.querySelector(
    `${"[data-popup]"}.${activeClass} .close`
  );
}

function overlayClickHandler(e, activeClass) {
  if (e.target === overlay || e.target === innerButton || e.target === document.querySelector('.overlay__bg')) commonFunction();
}

function modalInit(buttonsArray, buttonAttribute, activeClass) {
  buttonsArray.map(function (btn) {
    btn.addEventListener("click", (e) =>
      buttonClickHandler(e, buttonAttribute, activeClass)
    );
  });
}

document.addEventListener("DOMContentLoaded", function (e) {
  overlay &&
    overlay.addEventListener("click", function (e) {
      overlayClickHandler(e, activeClass);
    });

  modalInit(modalsButton, "data-btn-modal", activeClass);

  innerButtonModal &&
    innerButtonModal.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        enableScroll();
        e.preventDefault();

        const prevId = findAttribute(
          this.closest("[data-popup]"),
          "data-popup"
        );
        if (!prevId) {
          return;
        }

        const currentModalId = this.getAttribute("data-btn-inner");
        const currentModal = overlay.querySelector(
          `[data-popup="${currentModalId}"]`
        );

        const isProfileModal = currentModal.classList.contains('profile-modal');
    
        if (isProfileModal) {
          removeClassInArray(modals, activeClass);
          fadeOut(document.querySelector(`[data-popup="${prevId}"]`), 0);
        } else {
          addCustomClass(overlay, 'mode');
        }
      
        fadeIn(currentModal, 200);
        addCustomClass(currentModal, activeClass);
        disableScroll();

        innerButton = overlay.querySelector(
          `${"[data-popup]"}.${activeClass} .close`
        );
      });
    });
});

// loader-modal
function initCustomModalLoader(buttonAttribute, loaderClass, activeClass) {
  const customButtons = document.querySelectorAll(`[${buttonAttribute}]`);
  const loader = document.querySelector(loaderClass);

  customButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const modalId = findAttribute(e.target, buttonAttribute);
      if (!modalId) return;

      loader && addCustomClass(loader, 'show');

      setTimeout(() => {
        loader && removeCustomClass(loader, 'show');
        
        const targetModal = overlay.querySelector(`[data-popup="${modalId}"]`);
        
        if (targetModal) {
          removeClassInArray(modals, activeClass);
          addCustomClass(overlay, activeClass);
          addCustomClass(overlay, activeMode);
          addCustomClass(targetModal, activeClass);
          fadeIn(targetModal, 200, "flex");
          disableScroll();
          innerButton = overlay.querySelector(`${"[data-popup]"}.${activeClass} .close`);
        }
      }, 2000);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initCustomModalLoader('data-open-modal', '.loader', activeClass);
});

// loader
const loader = document.querySelector('.start-loader');

if(loader){
  document.addEventListener("DOMContentLoaded", function () {
      setTimeout(function(){
          addCustomClass(loader, 'loaded');
          window.loaderLoaded = true;
      },2500)
  });
}

//request-form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".request-form");
  if (!form) return;

  const textarea = form.querySelector(".request-form__area");
  const counter = form.querySelector(".request-form__symbol b");
  const maxLength = parseInt(textarea.dataset.maxlength) || 1000;

  if (!textarea || !counter) return;

  textarea.setAttribute("maxlength", maxLength);

  textarea.addEventListener("input", () => {
    counter.textContent = textarea.value.length;

    textarea.scrollTop = textarea.scrollHeight;
  });

  counter.textContent = textarea.value.length;
});

// tabs 

const tabsFunction = function (
  tabsDataInitArray,
  tabsNavAttr,
  tabsContentAttr,
  active = "active"
) {
  tabsDataInitArray &&
    tabsDataInitArray.forEach((tabParent) => {
      if (tabParent) {
        const tabNav = [...tabParent.querySelectorAll(`[${tabsNavAttr}]`)];
        const tabContent = [
          ...tabParent.querySelectorAll(`[${tabsContentAttr}]`),
        ];

        tabNav.map((nav) => {
          nav.addEventListener("click", (e) => {
            e.preventDefault();
            const activeTabAttr = e.target.getAttribute(`${tabsNavAttr}`);
            removeClassInArray(tabNav, active);
            removeClassInArray(tabContent, active);
            addCustomClass(
              tabParent.querySelector(`[${tabsNavAttr}="${activeTabAttr}"]`),
              active
            );
            addCustomClass(
              tabParent.querySelector(
                `[${tabsContentAttr}="${activeTabAttr}"]`
              ),
              active
            );
          });
        });
      }
    });
};

document.addEventListener("DOMContentLoaded", function () {
  tabsFunction(document.querySelectorAll("[data-tabs-parrent]"), "data-tab", "data-tab-content");
});

// slider 

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector('.main-slider')

  if (slider) {
    const swiper = new Swiper(slider.querySelector(".swiper-container"), {
      spaceBetween: 8,
      observer: true,
      observeParents: true,
      speed: 1000,
      slidesPerView: 'auto',
    });
  }
});

// chat-area

document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.querySelector(".chat-bar__area");

  if (textarea) {
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const maxSingleLineHeight = lineHeight * 1.5;

    textarea.addEventListener("input", () => {
      if (textarea.scrollHeight > maxSingleLineHeight) {
        textarea.style.maxHeight = "none"; 
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
      }
    });
  }
});

// translator
document.addEventListener("DOMContentLoaded", function () {
  const translateMenu = document.querySelector('.translator');
  const translateBtn = document.querySelector('[data-translate-btn]');

  if(translateBtn && translateMenu){
    translateBtn.addEventListener('click', function(e){
      e.preventDefault();
      translateBtn.classList.toggle('active');
      translateMenu.classList.toggle('active');
    })
  }
});

// format inputs
document.addEventListener("DOMContentLoaded", function () {
  const cardNumberInput = document.getElementById("cardNumber");
  const expireDateInput = document.getElementById("expireDate");

  if(cardNumberInput){
    cardNumberInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{4})/g, "$1 ").trim();
      e.target.value = value;
    });
  }
  if(expireDateInput){
    expireDateInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 6);
      }
      
      e.target.value = value;
    });
  }
});

// pagination
document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector(".modal__list");
  const bullets = document.querySelectorAll(".pagination__bullet");

  const itemWidth = 153;
  const gap = 10;
  const itemFullWidth = itemWidth + gap;

  function updatePagination() {
      let scrollLeft = list.scrollLeft;
      let maxScrollLeft = list.scrollWidth - list.clientWidth;
      let index = maxScrollLeft === 0 ? 0 : Math.round((scrollLeft / maxScrollLeft) * (bullets.length - 1));

      bullets.forEach((bullet, i) => {
          bullet.classList.toggle("active", i === index);
      });
  }

  function smoothScrollTo(position) {
      list.scrollTo({
          left: position,
          behavior: "smooth"
      });
  }

  bullets.forEach((bullet, index) => {
      bullet.addEventListener("click", () => {
          let maxScrollLeft = list.scrollWidth - list.clientWidth;

          if (index === 0) {
              smoothScrollTo(0);
          } else if (index === 1) {
              smoothScrollTo(maxScrollLeft / 2);
          } else if (index === 2) {
              smoothScrollTo(maxScrollLeft);
          }
      });
  });

  list.addEventListener("scroll", updatePagination);

  setTimeout(updatePagination, 0);
});

