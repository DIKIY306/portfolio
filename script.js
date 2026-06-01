const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

$$(".reveal").forEach((item) => revealObserver.observe(item));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    $$("[data-value]", entry.target).forEach((bar) => {
      bar.style.width = `${bar.dataset.value}%`;
    });
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

skillObserver.observe($(".skills-panel"));

const nav = $(".main-nav");
const navToggle = $(".nav-toggle");
navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.classList.toggle("active", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

$$(".main-nav a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
}));

const sections = $$("main section[id]");
const navLinks = $$(".main-nav a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -58%", threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

const progress = $(".page-progress span");
const glow = $(".cursor-glow");
window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;
});
window.addEventListener("pointermove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

$$(".filters button").forEach((button) => button.addEventListener("click", () => {
  $$(".filters button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  const filter = button.dataset.filter;
  $$(".work-card").forEach((card) => {
    const matches = filter === "all" || card.dataset.category.split(" ").includes(filter);
    card.classList.toggle("hidden", !matches);
  });
}));

const projects = {
  dropship: { title: "Dropship", description: "Реальный SaaS-лендинг сервиса для e-commerce.", task: "Продуктовый сайт / SaaS", done: ["Светлая UI-система", "Карточки возможностей", "Чёткий CTA", "Понятный продуктовый сценарий"], result: "Сложный сервис объясняется через спокойную и последовательную структуру.", stack: ["SaaS", "Minimal", "Product UI", "Landing"] },
  voxr: { title: "Voxr AI", description: "Реальный лендинг AI-продукта в тёмной технологичной стилистике.", task: "AI-продукт / SaaS", done: ["Контрастный hero", "Карточная сетка", "Сильная типографика", "Тёмная тема"], result: "Визуальный характер поддерживает ощущение современного AI-сервиса.", stack: ["AI", "Dark UI", "Cards", "SaaS"] },
  lisa: { title: "Lisa La Profe", description: "Реальный персональный лендинг образовательного проекта.", task: "Образование / личный бренд", done: ["Понятный оффер", "Личная подача", "Воздушная композиция", "Блоки курсов"], result: "Сайт быстро создаёт доверие и сохраняет лёгкий, современный характер.", stack: ["Education", "Personal Brand", "Typography", "Landing"] },
  ixfluence: { title: "IXFLUENCE", description: "Реальный лендинг маркетинговой платформы.", task: "Маркетинг / digital-платформа", done: ["Крупные заголовки", "Сдержанная палитра", "Чистая композиция", "Продуктовые акценты"], result: "Минимум визуального шума помогает сфокусироваться на ценности продукта.", stack: ["Marketing", "Platform", "Minimal", "UX"] },
  avanta: { title: "Avanta", description: "Реальный сайт beauty-направления в премиальной стилистике.", task: "Beauty / услуги", done: ["Спокойная палитра", "Мягкая типографика", "Много воздуха", "Эмоциональный визуал"], result: "Сайт выглядит аккуратно и дорого без лишних декоративных эффектов.", stack: ["Beauty", "Premium", "Service", "Visual"] },
  runtime: { title: "Runtime Radar", description: "Реальный технологичный лендинг для IT-продукта.", task: "IT / продуктовый сайт", done: ["Тёмный фон", "Минималистичная графика", "Чёткая иерархия", "Выразительный hero"], result: "Строгая структура и контрастная подача сразу задают профессиональный тон.", stack: ["IT", "Dark UI", "Product", "Landing"] }
};

const modal = $("#project-modal");
const fillModal = (project) => {
  $("#modal-title").textContent = project.title;
  $("#modal-description").textContent = project.description;
  $("#modal-task").textContent = project.task;
  $("#modal-result").textContent = project.result;
  $("#modal-done").innerHTML = project.done.map((item) => `<li>${item}</li>`).join("");
  $("#modal-stack").innerHTML = project.stack.map((item) => `<span>${item}</span>`).join("");
};
const openModal = (card) => {
  fillModal(projects[card.dataset.project]);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal-close").focus();
};
const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

$$(".details").forEach((button) => button.addEventListener("click", () => openModal(button.closest(".work-card"))));
$$("[data-close-modal]").forEach((item) => item.addEventListener("click", closeModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

let toastTimer;
$("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const toast = $("#toast");
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4500);
  event.target.reset();
});

$("#year").textContent = new Date().getFullYear();
