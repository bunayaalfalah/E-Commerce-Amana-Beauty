/* =========================================================
   AMANA BEAUTY — script.js
   Product data, cart (in-memory), quick view, day/night
   toggle, filters, scroll reveal, header & nav behaviour.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     0. CONFIG — edit these to match the real store
     --------------------------------------------------------- */
  var WHATSAPP_NUMBER = "625817118526"; // ganti dengan nomor WhatsApp admin (format 62xxxxxxxxxx)

  /* ---------------------------------------------------------
     1. PRODUCT DATA
     --------------------------------------------------------- */
  var PRODUCTS = [
    {
      id: "facewash",
      name: "Brightening Face Wash",
      vol: "200 ml",
      tag: "Cleanse",
      category: "cleanse",
      price: 79000,
      img: "assets/images/facewash.webp",
      tagline: "Deep Cleansing, Brightening &amp; Moisturizing",
      desc: "Pembersih wajah harian dengan formula lembut yang membersihkan kotoran secara mendalam, mencerahkan, dan tetap menjaga kelembapan kulit setiap kali dipakai.",
      features: [
        "Deep Cleansing — Membersihkan Mendalam",
        "Brightening — Mencerahkan Kulit",
        "Moisturizing — Melembabkan Kulit"
      ]
    },
    {
      id: "toner",
      name: "Brightening Toner",
      vol: "200 ml",
      tag: "Treat",
      category: "treat",
      price: 89000,
      img: "assets/images/toner.webp",
      tagline: "Menyegarkan, Menyeimbangkan &amp; Mencerahkan",
      desc: "Toner ringan yang menyegarkan kulit, menjaga keseimbangan pH alami, dan memperkuat lapisan pelindung kulit setelah dibersihkan.",
      features: [
        "Menyegarkan Kulit",
        "Keseimbangan pH",
        "Memperkuat Perlindungan"
      ]
    },
    {
      id: "serum",
      name: "Brightening Serum",
      vol: "20 ml",
      tag: "Niacinamide 10%",
      category: "treat",
      price: 139000,
      img: "assets/images/serum.webp",
      tagline: "Niacinamide 10% untuk Kulit Cerah &amp; Halus",
      desc: "Serum dengan Niacinamide 10% yang membantu mencerahkan kulit, menyamarkan noda hitam, dan menjaga kulit terasa halus serta sehat.",
      features: [
        "Brightening — Mencerahkan kulit",
        "Fade Dark Spot — Menyamarkan noda hitam",
        "Smooth & Healthy Skin"
      ]
    },
    {
      id: "moisturizer",
      name: "Hydra-Glow Moisturizer",
      vol: "100 ml",
      tag: "Ceramides + HA",
      category: "treat",
      price: 169000,
      img: "assets/images/moisturizer.webp",
      tagline: "Ceramides + Hyaluronic Acid, 24H Lasting",
      desc: "Pelembap dengan Ceramides dan Hyaluronic Acid untuk meningkatkan hidrasi, memperbaiki skin barrier, dengan formula non-greasy yang tahan hingga 24 jam.",
      features: [
        "Hydration Boost — Peningkatan Hidrasi",
        "Barrier Repair — Perbaikan Penghalang Kulit",
        "Non-Greasy Formula, 24H Lasting"
      ]
    },
    {
      id: "sunscreen",
      name: "Daily Defense Sunscreen",
      vol: "100 ml",
      tag: "SPF 50+ PA+++",
      category: "protect",
      price: 99000,
      img: "assets/images/sunscreen.webp",
      tagline: "SPF 50+ PA+++ — Sun-Smart Skin, Everyday Confidence",
      desc: "Sunscreen harian dengan SPF 50+ PA+++ yang melindungi dari UVA/UVB dan polusi, dengan formula non-greasy yang nyaman dipakai setiap hari.",
      features: [
        "UVA/UVB Protection",
        "Pollution Guard — Melindungi dari Polusi",
        "Non-Greasy Formula, Daily Hydration"
      ]
    },
    {
      id: "daycream",
      name: "Morning Radiance Day Cream",
      vol: "100 ml",
      tag: "Niacinamide + Vit C + SPF 30",
      category: "cream",
      price: 189000,
      img: "assets/images/daycream.webp",
      tagline: "Niacinamide + Vitamin C + SPF 30",
      desc: "Krim pagi yang melindungi dari UV dan polusi, mencerahkan kulit, serta memberi hidrasi tahan lama dengan formula ringan yang cepat meresap.",
      features: [
        "Proteksi UV & Polusi",
        "Mencerahkan Kulit",
        "Hidrasi Pagi yang Tahan Lama",
        "Formula Ringan & Cepat Meresap"
      ]
    },
    {
      id: "nightcream",
      name: "Deep Night Hydration Cream",
      vol: "100 ml",
      tag: "Niacinamide + Vit C",
      category: "cream",
      price: 199000,
      img: "assets/images/nightcream.webp",
      tagline: "Cream Malam — Nutrisi &amp; Regenerasi Kulit",
      desc: "Krim malam bertekstur kaya yang menutrisi dan membantu regenerasi kulit, menenangkan dan memulihkan kulit lelah sepanjang malam.",
      features: [
        "Nutrisi & Regenerasi Kulit",
        "Menenangkan & Memulihkan",
        "Formula Tekstur Kaya",
        "Tekstur Halus & Rata"
      ]
    }
  ];

  var productById = {};
  PRODUCTS.forEach(function (p) { productById[p.id] = p; });

  /* ---------------------------------------------------------
     2. STATE — in-memory cart (resets on page reload by design;
        no browser storage is used)
     --------------------------------------------------------- */
  var cart = {}; // { id: qty }

  function formatRupiah(n) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  /* ---------------------------------------------------------
     3. DOM REFS
     --------------------------------------------------------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var grid = $("#productGrid");
  var cartBtn = $("#cartBtn");
  var cartDrawer = $("#cartDrawer");
  var cartItemsEl = $("#cartItems");
  var cartEmptyEl = $("#cartEmpty");
  var cartFooterEl = $("#cartFooter");
  var cartSubtotalEl = $("#cartSubtotal");
  var cartCountEl = $("#cartCount");
  var overlay = $("#overlay");
  var modalOverlay = $("#modalOverlay");
  var quickview = $("#quickview");
  var quickviewBody = $("#quickviewBody");
  var toastEl = $("#toast");

  /* ---------------------------------------------------------
     4. RENDER PRODUCT GRID
     --------------------------------------------------------- */
  function featureIcon() {
    return '<svg viewBox="0 0 24 24" width="14" height="14"><use href="#ic-sparkle"/></svg>';
  }

  function renderGrid() {
    var html = PRODUCTS.map(function (p) {
      var feats = p.features.slice(0, 3).map(function (f) {
        return "<li>" + featureIcon() + "<span>" + f + "</span></li>";
      }).join("");
      return (
        '<article class="product-card" data-id="' + p.id + '" data-category="' + p.category + '">' +
          '<div class="product-card-media">' +
            '<span class="product-tag">' + p.tag + "</span>" +
            '<button class="product-quick" data-quickview="' + p.id + '" aria-label="Lihat detail ' + p.name + '">' +
              '<svg viewBox="0 0 24 24" width="16" height="16"><use href="#ic-sparkle"/></svg>' +
            "</button>" +
            '<img src="' + p.img + '" alt="Amana Beauty ' + p.name + '" loading="lazy">' +
          "</div>" +
          '<div class="product-card-body">' +
            '<span class="product-vol">' + p.vol + "</span>" +
            '<h3 class="product-name">' + p.name + "</h3>" +
            '<ul class="product-features">' + feats + "</ul>" +
            '<div class="product-bottom">' +
              '<span class="product-price">' + formatRupiah(p.price) + "</span>" +
              '<button class="product-add" data-add="' + p.id + '" aria-label="Tambah ' + p.name + ' ke keranjang">' +
                '<svg viewBox="0 0 24 24" width="18" height="18"><use href="#ic-plus"/></svg>' +
              "</button>" +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
    grid.innerHTML = html;
  }

  /* ---------------------------------------------------------
     5. CART LOGIC
     --------------------------------------------------------- */
  function addToCart(id, qty) {
    qty = qty || 1;
    cart[id] = (cart[id] || 0) + qty;
    renderCart();
    var p = productById[id];
    showToast((p ? p.name : "Produk") + " ditambahkan ke keranjang");
    bumpCartIcon();
  }

  function setQty(id, qty) {
    if (qty <= 0) { delete cart[id]; }
    else { cart[id] = qty; }
    renderCart();
  }

  function removeFromCart(id) {
    delete cart[id];
    renderCart();
  }

  function cartCount() {
    return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id]; }, 0);
  }

  function cartTotal() {
    return Object.keys(cart).reduce(function (sum, id) {
      return sum + (productById[id] ? productById[id].price * cart[id] : 0);
    }, 0);
  }

  function bumpCartIcon() {
    cartCountEl.classList.remove("show");
    requestAnimationFrame(function () { cartCountEl.classList.add("show"); });
  }

  function renderCart() {
    var ids = Object.keys(cart);
    cartCountEl.textContent = cartCount();
    cartCountEl.classList.toggle("show", cartCount() > 0);

    if (ids.length === 0) {
      cartEmptyEl.style.display = "flex";
      cartFooterEl.classList.remove("show");
      $$(".cart-line", cartItemsEl).forEach(function (el) { el.remove(); });
      return;
    }

    cartEmptyEl.style.display = "none";
    cartFooterEl.classList.add("show");
    cartSubtotalEl.textContent = formatRupiah(cartTotal());

    var html = ids.map(function (id) {
      var p = productById[id];
      var qty = cart[id];
      if (!p) return "";
      return (
        '<div class="cart-line" data-id="' + id + '">' +
          '<img src="' + p.img + '" alt="' + p.name + '">' +
          '<div class="cart-line-info">' +
            '<span class="cart-line-name">' + p.name + "</span>" +
            '<span class="cart-line-price">' + formatRupiah(p.price) + "</span>" +
            '<div class="cart-line-actions">' +
              '<div class="qty-control">' +
                '<button data-qty="dec" aria-label="Kurangi jumlah"><svg viewBox="0 0 24 24" width="12" height="12"><use href="#ic-minus"/></svg></button>' +
                "<span>" + qty + "</span>" +
                '<button data-qty="inc" aria-label="Tambah jumlah"><svg viewBox="0 0 24 24" width="12" height="12"><use href="#ic-plus"/></svg></button>' +
              "</div>" +
              '<button class="cart-remove" data-remove aria-label="Hapus dari keranjang"><svg viewBox="0 0 24 24" width="16" height="16"><use href="#ic-trash"/></svg></button>' +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    var existingLines = $$(".cart-line", cartItemsEl);
    existingLines.forEach(function (el) { el.remove(); });
    cartItemsEl.insertAdjacentHTML("beforeend", html);
  }

  cartItemsEl.addEventListener("click", function (e) {
    var line = e.target.closest(".cart-line");
    if (!line) return;
    var id = line.getAttribute("data-id");

    if (e.target.closest("[data-qty='inc']")) { setQty(id, (cart[id] || 0) + 1); }
    else if (e.target.closest("[data-qty='dec']")) { setQty(id, (cart[id] || 0) - 1); }
    else if (e.target.closest("[data-remove]")) { removeFromCart(id); }
  });

  /* ---------------------------------------------------------
     6. CART DRAWER OPEN / CLOSE
     --------------------------------------------------------- */
  function openCart() {
    cartDrawer.classList.add("show");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartDrawer.classList.remove("show");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  }
  cartBtn.addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  $("#emptyShopBtn").addEventListener("click", closeCart);

  /* ---------------------------------------------------------
     7. CHECKOUT VIA WHATSAPP
     --------------------------------------------------------- */
  $("#checkoutBtn").addEventListener("click", function () {
    var ids = Object.keys(cart);
    if (ids.length === 0) { showToast("Keranjang masih kosong"); return; }

    var lines = ids.map(function (id) {
      var p = productById[id];
      var qty = cart[id];
      return "• " + p.name + " (" + p.vol + ") x" + qty + " — " + formatRupiah(p.price * qty);
    });

    var msg = "Halo Amana Beauty, saya ingin memesan:\n\n" +
      lines.join("\n") +
      "\n\nTotal: " + formatRupiah(cartTotal()) +
      "\n\nMohon info ketersediaan & cara pembayarannya. Terima kasih!";

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  });

  /* set generic floating WA button (no pre-filled order) */
  $("#waFloat").setAttribute(
    "href",
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Halo Amana Beauty, saya ingin tanya tentang produk skincare-nya 🌿")
  );

  /* ---------------------------------------------------------
     8. ADD-TO-CART CLICK DELEGATION (grid + quickview + routine)
     --------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var addBtn = e.target.closest("[data-add]");
    if (addBtn) { addToCart(addBtn.getAttribute("data-add")); return; }

    var qvBtn = e.target.closest("[data-quickview]");
    if (qvBtn) { openQuickview(qvBtn.getAttribute("data-quickview")); return; }

    var productImg = e.target.closest(".product-card-media img");
    if (productImg) {
      var card = e.target.closest(".product-card");
      if (card) openQuickview(card.getAttribute("data-id"));
    }
  });

  /* routine section's "Tambah Day/Night Cream" button — id swaps with mode */
  var routineSection = $("#rutinitas");
  $(".routine-add").addEventListener("click", function () {
    var mode = routineSection.getAttribute("data-mode");
    addToCart(mode === "night" ? "nightcream" : "daycream");
  });

  /* ---------------------------------------------------------
     9. QUICK VIEW MODAL
     --------------------------------------------------------- */
  function openQuickview(id) {
    var p = productById[id];
    if (!p) return;
    var feats = p.features.map(function (f) {
      return "<li>" + featureIcon() + "<span>" + f + "</span></li>";
    }).join("");

    quickviewBody.innerHTML =
      '<div class="qv-media"><img src="' + p.img + '" alt="Amana Beauty ' + p.name + '"></div>' +
      '<div class="qv-info">' +
        '<span class="product-tag">' + p.tag + "</span>" +
        "<h3>" + p.name + "</h3>" +
        '<span class="qv-vol">' + p.vol + "</span>" +
        "<p>" + p.desc + "</p>" +
        '<ul class="qv-features">' + feats + "</ul>" +
        '<div class="qv-price-row">' +
          '<span class="qv-price">' + formatRupiah(p.price) + "</span>" +
        "</div>" +
        '<div class="qv-actions">' +
          '<button class="btn btn-primary" data-add="' + p.id + '">Tambah ke Keranjang</button>' +
          '<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent("Halo, saya ingin tanya tentang " + p.name) + '">Tanya via WhatsApp</a>' +
        "</div>" +
      "</div>";

    quickview.classList.add("show");
    modalOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeQuickview() {
    quickview.classList.remove("show");
    modalOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }
  $("#closeQuickview").addEventListener("click", closeQuickview);
  modalOverlay.addEventListener("click", closeQuickview);

  /* ---------------------------------------------------------
     10. PRODUCT FILTER CHIPS
     --------------------------------------------------------- */
  $("#filterBar").addEventListener("click", function (e) {
    var chip = e.target.closest(".filter-chip");
    if (!chip) return;
    $$(".filter-chip", $("#filterBar")).forEach(function (c) { c.classList.remove("is-active"); });
    chip.classList.add("is-active");
    var filter = chip.getAttribute("data-filter");
    $$(".product-card", grid).forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-category") === filter;
      card.classList.toggle("is-hidden", !match);
    });
  });

  /* ---------------------------------------------------------
     11. DAY / NIGHT ROUTINE TOGGLE (signature interaction)
     --------------------------------------------------------- */
  var routineSwitch = $("#routineSwitch");
  var modeBtns = $$("[data-mode-btn]");

  function setRoutineMode(mode) {
    routineSection.setAttribute("data-mode", mode);
    routineSwitch.setAttribute("aria-checked", mode === "night");
    modeBtns.forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-mode-btn") === mode);
    });
  }
  routineSwitch.addEventListener("click", function () {
    setRoutineMode(routineSection.getAttribute("data-mode") === "day" ? "night" : "day");
  });
  routineSwitch.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      routineSwitch.click();
    }
  });
  modeBtns.forEach(function (b) {
    b.addEventListener("click", function () { setRoutineMode(b.getAttribute("data-mode-btn")); });
  });

  /* auto-cycle once into view for delight, then leave to user control */
  var autoCycled = false;
  var routineObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !autoCycled) {
        autoCycled = true;
        setTimeout(function () { setRoutineMode("night"); }, 1200);
        setTimeout(function () { setRoutineMode("day"); }, 3600);
      }
    });
  }, { threshold: .5 });
  routineObserver.observe(routineSection);

  /* ---------------------------------------------------------
     12. TOAST
     --------------------------------------------------------- */
  var toastTimer = null;
  function showToast(message) {
    toastEl.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><use href="#ic-sparkle"/></svg><span>' + message + "</span>";
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }

  /* ---------------------------------------------------------
     13. HEADER SCROLL STATE + BACK TO TOP
     --------------------------------------------------------- */
  var header = $("#siteHeader");
  var backTop = $("#backTop");
  window.addEventListener("scroll", function () {
    var scrolled = window.scrollY > 30;
    header.classList.toggle("is-scrolled", scrolled);
    backTop.classList.toggle("show", window.scrollY > 500);
  });
  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------------------------------------
     14. MOBILE NAV TOGGLE + SCROLLSPY
     --------------------------------------------------------- */
  var mainNav = $("#mainNav");
  var navToggle = $("#navToggle");
  navToggle.addEventListener("click", function () { mainNav.classList.toggle("open"); });
  $$(".nav-link", mainNav).forEach(function (link) {
    link.addEventListener("click", function () { mainNav.classList.remove("open"); });
  });

  var sections = $$("section[id]");
  var navLinks = $$(".nav-link");
  function scrollSpy() {
    var current = sections[0];
    sections.forEach(function (sec) {
      if (window.scrollY + 140 >= sec.offsetTop) current = sec;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", scrollSpy);

  /* footer "produk" quick links: open quickview directly */
  $$("[data-scroll-id]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("#produk").scrollIntoView({ behavior: "smooth" });
      setTimeout(function () { openQuickview(link.getAttribute("data-scroll-id")); }, 550);
    });
  });

  /* ---------------------------------------------------------
     15. NEWSLETTER FORM (demo only — no backend)
     --------------------------------------------------------- */
  $("#newsletterForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("#newsletterEmail").value.trim();
    if (!email) return;
    showToast("Terima kasih! Kode promo akan dikirim ke " + email);
    this.reset();
  });

  /* ---------------------------------------------------------
     16. SCROLL REVEAL
     --------------------------------------------------------- */
  var revealEls = $$("[data-reveal]");
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------------------------------------------------------
     17. FOOTER YEAR + PRELOADER + INIT
     --------------------------------------------------------- */
  $("#year").textContent = new Date().getFullYear();

  function init() {
    renderGrid();
    renderCart();
    setRoutineMode("day");
    var preloader = $("#preloader");
    window.addEventListener("load", function () {
      setTimeout(function () { preloader.classList.add("is-hidden"); }, 350);
    });
    /* fallback in case load already fired */
    setTimeout(function () { preloader.classList.add("is-hidden"); }, 1800);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
