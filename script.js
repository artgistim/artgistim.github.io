/**
 * Tim Cho Portfolio
 */
(() => {
  "use strict";

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const themeToggle = document.getElementById("themeToggle");
  const backTop = document.getElementById("backTop");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Theme */
  const THEME_KEY = "timcho-theme";

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, theme);
  }

  applyTheme(getPreferredTheme());
  themeToggle?.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light");
  });

  /* Mobile nav */
  function closeNav() {
    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    if (document.getElementById("lightbox")?.hidden !== false) {
      document.body.style.overflow = "";
    }
  }

  function openNav() {
    navMenu?.classList.add("open");
    navToggle?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  navToggle?.addEventListener("click", () => {
    if (navMenu?.classList.contains("open")) closeNav();
    else openNav();
  });

  navMenu?.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => closeNav());
  });

  /* Scroll UI */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];

  function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 24);
    backTop?.classList.toggle("show", y > 480);

    let current = "";
    for (const section of sections) {
      if (y >= section.offsetTop - 100) current = section.id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("active", href === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const mqCompact = window.matchMedia("(max-width: 900px)");

  /* Timeline — 手機預設全收合；桌機展開第一筆 */
  const timelineItems = document.querySelectorAll(".timeline-item");
  function setTimelineDefaultOpen() {
    const openFirst = !mqCompact.matches;
    timelineItems.forEach((item, i) => {
      const headerBtn = item.querySelector(".timeline-header");
      const shouldOpen = openFirst && i === 0;
      item.classList.toggle("open", shouldOpen);
      headerBtn?.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    });
  }
  timelineItems.forEach((item) => {
    const headerBtn = item.querySelector(".timeline-header");
    headerBtn?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      timelineItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".timeline-header")?.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        headerBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
  setTimelineDefaultOpen();
  mqCompact.addEventListener?.("change", setTimelineDefaultOpen);

  /* STAR 實績 — 摺疊（手機預設收；桌機預設展開） */
  const starCards = document.querySelectorAll(".star-card");
  function setStarDefaultOpen() {
    const openAll = !mqCompact.matches;
    starCards.forEach((card) => {
      const btn = card.querySelector(".star-card-top");
      card.classList.toggle("open", openAll);
      btn?.setAttribute("aria-expanded", openAll ? "true" : "false");
    });
  }
  starCards.forEach((card) => {
    const btn = card.querySelector(".star-card-top");
    btn?.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");
      if (mqCompact.matches) {
        // 手機：手風琴，一次只開一張
        starCards.forEach((other) => {
          other.classList.remove("open");
          other.querySelector(".star-card-top")?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          card.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      } else {
        card.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      }
    });
  });
  setStarDefaultOpen();
  mqCompact.addEventListener?.("change", setStarDefaultOpen);

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let lightboxItems = [];
  let lightboxIndex = 0;

  function openLightbox(items, index) {
    if (!lightbox || !items.length) return;
    lightboxItems = items;
    lightboxIndex = index;
    const item = lightboxItems[lightboxIndex];
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.caption || "";
    }
    if (lightboxCaption) lightboxCaption.textContent = item.caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = "";
    if (!navMenu?.classList.contains("open")) document.body.style.overflow = "";
  }

  function stepLightbox(delta) {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
    const item = lightboxItems[lightboxIndex];
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.caption || "";
    }
    if (lightboxCaption) lightboxCaption.textContent = item.caption || "";
  }

  document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev")?.addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lightboxNext")?.addEventListener("click", () => stepLightbox(1));
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.hidden) closeLightbox();
      else closeNav();
    }
    if (lightbox && !lightbox.hidden) {
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    }
  });

  /* Reveal helper */
  function observeReveals(root) {
    const nodes = (root || document).querySelectorAll(".reveal:not(.visible)");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );
      nodes.forEach((el) => io.observe(el));
    } else {
      nodes.forEach((el) => el.classList.add("visible"));
    }
  }

  /* Portfolio + award photos */
  const portfolioGrid = document.getElementById("portfolioGrid");
  const awardPhotosRail = document.getElementById("awardPhotosRail");
  let portfolioLightboxItems = [];
  let awardLightboxItems = [];

  const portfolioAlbum = document.getElementById("portfolioAlbum");
  const albumBook = document.getElementById("albumBook");
  const albumOver = document.getElementById("albumOver");
  const albumUnder = document.getElementById("albumUnder");
  const albumPrev = document.getElementById("albumPrev");
  const albumNext = document.getElementById("albumNext");
  const albumPageLabel = document.getElementById("albumPageLabel");
  let portfolioItemsCache = [];
  let albumIndex = 0;
  let albumBusy = false;

  function portImgSrc(p, idx) {
    const isWide = p.id === "nasa-art";
    return isWide || idx < 6 ? p.image || p.thumb : p.thumb || p.image;
  }

  function albumLeafHtml(p, idx) {
    if (!p) return "";
    const workId = escapeHtml(p.id || `work-${idx}`);
    return `
<article class="album-page" data-idx="${idx}" id="work-${workId}" data-work-id="${workId}">
  <div class="album-page-media">
    <img src="${escapeHtml(portImgSrc(p, idx))}" alt="${escapeHtml(p.title)}" draggable="false" />
    <span class="port-badge">${escapeHtml(p.badge || "")}</span>
  </div>
  <div class="album-page-body">
    <h3>${escapeHtml(p.title)}</h3>
    <p>${escapeHtml(p.desc)}</p>
  </div>
</article>`;
  }

  function updateAlbumChrome() {
    const n = portfolioItemsCache.length;
    if (albumPageLabel) albumPageLabel.textContent = n ? `${albumIndex + 1} / ${n}` : "0 / 0";
    if (albumPrev) albumPrev.disabled = albumIndex <= 0 || albumBusy;
    if (albumNext) albumNext.disabled = albumIndex >= n - 1 || albumBusy;
  }

  function paintAlbumLeaves(overIdx, underIdx) {
    if (albumOver) {
      albumOver.innerHTML = albumLeafHtml(portfolioItemsCache[overIdx], overIdx);
      albumOver.querySelector(".album-page")?.addEventListener("click", () => {
        openLightbox(portfolioLightboxItems, overIdx);
      });
    }
    if (albumUnder) {
      if (underIdx != null && portfolioItemsCache[underIdx]) {
        albumUnder.innerHTML = albumLeafHtml(portfolioItemsCache[underIdx], underIdx);
        albumUnder.hidden = false;
      } else {
        albumUnder.innerHTML = "";
        albumUnder.hidden = true;
      }
    }
  }

  function showAlbumPage(idx, { animate = false, dir = "next" } = {}) {
    const n = portfolioItemsCache.length;
    if (!n || !albumOver) return;
    const nextIdx = Math.max(0, Math.min(n - 1, idx));

    if (!animate || nextIdx === albumIndex) {
      albumIndex = nextIdx;
      paintAlbumLeaves(albumIndex, null);
      albumBook?.classList.remove("is-turning-next", "is-turning-prev", "is-animating");
      albumBusy = false;
      updateAlbumChrome();
      return;
    }

    if (albumBusy) return;
    albumBusy = true;
    updateAlbumChrome();

    const from = albumIndex;
    const turningNext = dir === "next";
    // under 先放目標頁，over 翻開露出 underneath
    paintAlbumLeaves(from, nextIdx);
    albumBook?.classList.remove("is-turning-next", "is-turning-prev");
    // force reflow
    void albumBook?.offsetWidth;
    albumBook?.classList.add("is-animating", turningNext ? "is-turning-next" : "is-turning-prev");

    const done = () => {
      albumIndex = nextIdx;
      paintAlbumLeaves(albumIndex, null);
      albumBook?.classList.remove("is-turning-next", "is-turning-prev", "is-animating");
      albumBusy = false;
      updateAlbumChrome();
    };

    window.setTimeout(done, 620);
  }

  let albumInited = false;

  function initPortfolioAlbum() {
    if (!portfolioAlbum || !portfolioItemsCache.length) return;

    const syncMode = () => {
      const compact = mqCompact.matches;
      portfolioAlbum.hidden = !compact;
      if (compact) {
        showAlbumPage(albumIndex, { animate: false });
      }
    };

    if (!albumInited) {
      albumInited = true;
      albumPrev?.addEventListener("click", () => {
        if (albumIndex > 0) showAlbumPage(albumIndex - 1, { animate: true, dir: "prev" });
      });
      albumNext?.addEventListener("click", () => {
        if (albumIndex < portfolioItemsCache.length - 1) {
          showAlbumPage(albumIndex + 1, { animate: true, dir: "next" });
        }
      });

      let touchX = 0;
      let touchY = 0;
      albumBook?.addEventListener(
        "touchstart",
        (e) => {
          const t = e.changedTouches[0];
          touchX = t.clientX;
          touchY = t.clientY;
        },
        { passive: true }
      );
      albumBook?.addEventListener(
        "touchend",
        (e) => {
          const t = e.changedTouches[0];
          const dx = t.clientX - touchX;
          const dy = t.clientY - touchY;
          if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
          if (dx < 0 && albumIndex < portfolioItemsCache.length - 1) {
            showAlbumPage(albumIndex + 1, { animate: true, dir: "next" });
          } else if (dx > 0 && albumIndex > 0) {
            showAlbumPage(albumIndex - 1, { animate: true, dir: "prev" });
          }
        },
        { passive: true }
      );

      document.addEventListener("keydown", (e) => {
        if (!mqCompact.matches || portfolioAlbum?.hidden) return;
        const section = document.getElementById("portfolio");
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 80 || rect.top > window.innerHeight) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          albumNext?.click();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          albumPrev?.click();
        }
      });

      mqCompact.addEventListener?.("change", syncMode);
    }

    syncMode();
  }

  function renderPortfolio(items) {
    if (!portfolioGrid) return;
    portfolioItemsCache = items;
    portfolioLightboxItems = items.map((p) => ({
      src: p.image,
      caption: p.title || "",
    }));

    portfolioGrid.innerHTML = items
      .map((p, idx) => {
        const isWide = p.id === "nasa-art";
        const imgSrc = portImgSrc(p, idx);
        const workId = escapeHtml(p.id || `work-${idx}`);
        const wideClass = isWide ? " port-card-wide" : "";
        return `
<article class="port-card port-card-visual reveal${wideClass}" id="work-grid-${workId}" data-work-id="${workId}" data-idx="${idx}">
  <div class="port-media">
    <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.title)}" loading="${idx < 4 || isWide ? "eager" : "lazy"}" />
    <div class="port-media-overlay">
      <span class="port-badge">${escapeHtml(p.badge || "")}</span>
    </div>
  </div>
  <div class="port-body">
    <h3>${escapeHtml(p.title)}</h3>
    <p>${escapeHtml(p.desc)}</p>
  </div>
</article>`;
      })
      .join("");

    portfolioGrid.querySelectorAll(".port-card-visual").forEach((card) => {
      card.addEventListener("click", () => openLightbox(portfolioLightboxItems, Number(card.dataset.idx) || 0));
    });
    observeReveals(portfolioGrid);
    initPortfolioAlbum();
    highlightWorkFromHash();
  }

  function highlightWorkFromHash() {
    const hash = window.location.hash || "";
    if (!hash.startsWith("#work-")) return;
    const workKey = hash.slice(1); // work-xxx
    const id = workKey.replace(/^work-/, "");
    const idx = portfolioItemsCache.findIndex((p) => (p.id || "") === id);

    if (mqCompact.matches && idx >= 0) {
      showAlbumPage(idx, { animate: false });
      document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
      albumBook?.classList.add("album-flash");
      window.setTimeout(() => albumBook?.classList.remove("album-flash"), 1200);
      return;
    }

    const card =
      document.getElementById(`work-grid-${id}`) ||
      document.querySelector(`[data-work-id="${CSS.escape(id)}"]`);
    if (!card) return;
    card.classList.add("port-card-target");
    requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    window.setTimeout(() => card.classList.remove("port-card-target"), 2200);
  }

  window.addEventListener("hashchange", highlightWorkFromHash);

  function renderAwardPhotos(photos) {
    if (!awardPhotosRail) return;
    awardLightboxItems = photos.map((p) => ({ src: p.src, caption: p.caption || "" }));

    awardPhotosRail.innerHTML = photos
      .map(
        (p, idx) => `
<figure class="award-photo-card reveal" data-idx="${idx}" role="button" tabindex="0" aria-label="${escapeHtml(p.caption || "合照")}">
  <span class="award-photo-year">${escapeHtml(String(p.year || ""))}</span>
  <img src="${escapeHtml(p.thumb || p.src)}" alt="${escapeHtml(p.caption || "")}" loading="lazy" />
  <figcaption>${escapeHtml(p.caption || "")}</figcaption>
</figure>`
      )
      .join("");

    awardPhotosRail.querySelectorAll(".award-photo-card").forEach((card) => {
      const open = () => openLightbox(awardLightboxItems, Number(card.dataset.idx) || 0);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
    observeReveals(awardPhotosRail);
  }

  /* Awards list */
  const awardsList = document.getElementById("awardsList");

  function renderAwards(awards) {
    if (!awardsList) return;
    const sorted = [...awards].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return (b.featured === true) - (a.featured === true);
    });

    awardsList.innerHTML = sorted
      .map((a, idx) => {
        const links = Array.isArray(a.links) ? a.links : [];
        const team = a.team ? `<div>${escapeHtml(a.team)}</div>` : "";
        const linksHtml =
          links.length > 0
            ? `<div class="award-links">${links
                .map(
                  (l) =>
                    `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
                )
                .join("")}</div>`
            : "";

        const previewLimit = 4;
        const extraClass = idx >= previewLimit ? " award-item-extra" : "";
        return `
<article class="award-item reveal${extraClass}" data-year="${a.year}" data-featured="${a.featured ? "1" : "0"}">
  <button type="button" class="award-header" aria-expanded="false">
    <span class="award-year">${a.year}</span>
    <div class="award-info">
      <span class="award-rank">${escapeHtml(a.rank || "")}</span>
      <h3>${escapeHtml(a.title)}</h3>
      <div class="award-meta">
        <div><strong>${escapeHtml(a.issuer || "")}</strong></div>
        <div>${escapeHtml(a.event || "")}</div>
        ${team}
      </div>
    </div>
    <span class="award-chevron" aria-hidden="true">▾</span>
  </button>
  <div class="award-body">
    <div class="award-body-inner">
      ${a.work_summary ? `<div class="award-work">${escapeHtml(a.work_summary)}</div>` : ""}
      <p class="award-desc">${escapeHtml(a.description || "")}</p>
      ${linksHtml}
    </div>
  </div>
</article>`;
      })
      .join("");

    awardsList.querySelectorAll(".award-item").forEach((item) => {
      item.querySelector(".award-header")?.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        awardsList.querySelectorAll(".award-item").forEach((other) => {
          other.classList.remove("open");
          other.querySelector(".award-header")?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          item.querySelector(".award-header")?.setAttribute("aria-expanded", "true");
        }
      });
    });

    const awardsExpandBtn = document.getElementById("awardsExpandBtn");
    const extraAwards = awardsList.querySelectorAll(".award-item-extra");
    if (awardsExpandBtn && extraAwards.length) {
      awardsExpandBtn.hidden = false;
      awardsExpandBtn.textContent = `展開全部獎項（+${extraAwards.length}）`;
      awardsExpandBtn.setAttribute("aria-expanded", "false");
      awardsList.classList.add("awards-list-collapsed");
      awardsExpandBtn.onclick = () => {
        const expanded = awardsList.classList.toggle("awards-list-expanded");
        awardsList.classList.toggle("awards-list-collapsed", !expanded);
        awardsExpandBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
        awardsExpandBtn.textContent = expanded
          ? "收合獎項列表"
          : `展開全部獎項（+${extraAwards.length}）`;
      };
    } else if (awardsExpandBtn) {
      awardsExpandBtn.hidden = true;
    }

    observeReveals(awardsList);
  }

  /* Lectures */
  const lecturesGrid = document.getElementById("lecturesGrid");

  /** 講義日期只顯示年、月（不顯示日） */
  function formatLectureYearMonth(dateStr, yearFallback) {
    if (dateStr && /^\d{4}-\d{2}/.test(dateStr)) {
      const [y, m] = dateStr.split("-");
      const month = String(Number(m));
      return `${y}年${month}月`;
    }
    if (yearFallback) return `${yearFallback}年`;
    return "";
  }

  function renderLectures(lectures) {
    if (!lecturesGrid) return;
    const sorted = [...lectures].sort((a, b) => (b.year || 0) - (a.year || 0));

    lecturesGrid.innerHTML = sorted
      .map((lec) => {
        const topics = Array.isArray(lec.topics) ? lec.topics : [];
        const outline = Array.isArray(lec.outline) ? lec.outline : [];
        const file = escapeHtml(lec.file || "#");
        const ym = formatLectureYearMonth(lec.date, lec.year);
        return `
<article class="lecture-card reveal">
  <button type="button" class="lecture-card-top" aria-expanded="false">
    <div class="lecture-top">
      <span class="lecture-year">${escapeHtml(String(lec.year || ""))}</span>
    </div>
    <h3>${escapeHtml(lec.title)}</h3>
    ${lec.title_en ? `<p class="lecture-sub">${escapeHtml(lec.title_en)}</p>` : ""}
    <p class="lecture-meta">${escapeHtml(ym)}</p>
    <span class="lecture-chevron" aria-hidden="true">▾</span>
  </button>
  <div class="lecture-card-body">
    <div class="lecture-card-body-inner">
      <p class="lecture-summary">${escapeHtml(lec.summary || "")}</p>
      ${
        outline.length
          ? `<ul class="lecture-outline">${outline.map((o) => `<li>${escapeHtml(o)}</li>`).join("")}</ul>`
          : ""
      }
      ${
        topics.length
          ? `<div class="lecture-tags">${topics.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>`
          : ""
      }
      <div class="lecture-actions">
        <a class="btn-open" href="${file}" target="_blank" rel="noopener noreferrer">開啟 PDF</a>
        <a class="btn-dl" href="${file}" download>下載</a>
      </div>
    </div>
  </div>
</article>`;
      })
      .join("");

    lecturesGrid.querySelectorAll(".lecture-card").forEach((card) => {
      const btn = card.querySelector(".lecture-card-top");
      // 桌機預設展開；手機收合
      const openDesktop = !mqCompact.matches;
      card.classList.toggle("open", openDesktop);
      btn?.setAttribute("aria-expanded", openDesktop ? "true" : "false");
      btn?.addEventListener("click", () => {
        const isOpen = card.classList.contains("open");
        if (mqCompact.matches) {
          lecturesGrid.querySelectorAll(".lecture-card").forEach((other) => {
            other.classList.remove("open");
            other.querySelector(".lecture-card-top")?.setAttribute("aria-expanded", "false");
          });
          if (!isOpen) {
            card.classList.add("open");
            btn.setAttribute("aria-expanded", "true");
          }
        } else {
          card.classList.toggle("open", !isOpen);
          btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
        }
      });
    });

    observeReveals(lecturesGrid);
  }

  /* Stats */
  const statNums = document.querySelectorAll(".stat-num[data-count]");

  function animateCount(el) {
    const target = Number(el.dataset.count) || 0;
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && statNums.length) {
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach((el) => countIo.observe(el));
  } else {
    statNums.forEach((el) => {
      el.textContent = el.dataset.count || "0";
    });
  }

  /* Load data — 必須用本機伺服器或 GitHub Pages（file:// 無法 fetch JSON） */
  function showFileProtocolHint() {
    if (location.protocol !== "file:") return false;
    const bar = document.createElement("div");
    bar.setAttribute("role", "alert");
    bar.style.cssText =
      "position:fixed;inset:auto 12px 12px 12px;z-index:3000;padding:14px 16px;border-radius:12px;" +
      "background:#0f172a;color:#e2e8f0;border:1px solid #2dd4bf;font-size:14px;line-height:1.55;" +
      "box-shadow:0 12px 40px rgba(0,0,0,.4);max-width:520px;margin:0 auto;left:12px;right:12px;";
    bar.innerHTML =
      "<strong style='color:#2dd4bf'>請用本機伺服器開啟</strong><br>" +
      "直接雙擊 index.html 無法載入作品／獎項資料。<br>" +
      "請在 Terminal 執行：<code style='color:#38bdf8'>cd portfolio-site && python3 -m http.server 8080</code><br>" +
      "然後用瀏覽器開啟：<a href='http://127.0.0.1:8080/' style='color:#2dd4bf'>http://127.0.0.1:8080/</a>";
    document.body.appendChild(bar);
    return true;
  }

  async function loadAll() {
    if (showFileProtocolHint()) {
      observeReveals(document);
      return;
    }

    try {
      const [galleryRes, awardsRes, lecturesRes] = await Promise.all([
        fetch("data/gallery.json", { cache: "no-cache" }),
        fetch("data/awards.json", { cache: "no-cache" }),
        fetch("data/lectures.json", { cache: "no-cache" }),
      ]);

      if (galleryRes.ok) {
        const gallery = await galleryRes.json();
        if (Array.isArray(gallery.portfolio)) renderPortfolio(gallery.portfolio);
        if (Array.isArray(gallery.awards_photos)) renderAwardPhotos(gallery.awards_photos);
      }

      if (awardsRes.ok) {
        const awardsData = await awardsRes.json();
        if (Array.isArray(awardsData.awards)) renderAwards(awardsData.awards);
      }

      if (lecturesRes.ok) {
        const lecturesData = await lecturesRes.json();
        if (Array.isArray(lecturesData.lectures)) renderLectures(lecturesData.lectures);
      }
    } catch (err) {
      console.error(err);
    }

    observeReveals(document);
  }

  loadAll();
})();
