/* ============================================
   LUSSO INTERIOR - 意式轻奢室内设计官网
   全局 JavaScript 交互脚本
   包含: 导航栏、轮播、滚动动画、灯箱、筛选、表单
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // 1. 导航栏滚动效果 (Navbar Scroll)
  // ==========================================
  const header = document.getElementById("header");
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 80) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  // 页面加载时立即检查一次
  handleNavScroll();

  // ==========================================
  // 2. 移动端菜单切换 (Mobile Menu)
  // ==========================================
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
      // 切换汉堡图标
      const spans = menuToggle.querySelectorAll("span");
      spans.forEach(function (s) { s.classList.toggle("active"); });
    });

    // 点击菜单项后关闭菜单
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
      });
    });
  }

  // ==========================================
  // 3. Hero 轮播 (Carousel)
  // ==========================================
  function initHeroSlider() {
    const slider = document.querySelector(".hero-slider");
    if (!slider) return;

    const slides = slider.querySelectorAll(".hero-slide");
    const dots = slider.querySelectorAll(".hero-dot");
    let currentIndex = 0;
    let interval;

    function goToSlide(index) {
      slides.forEach(function (s, i) {
        s.classList.toggle("active", i === index);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === index);
      });
      currentIndex = index;
    }

    function nextSlide() {
      const next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }

    function startAutoplay() {
      if (slides.length <= 1) return;
      stopAutoplay();
      interval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }

    // 点击指示点切换
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        stopAutoplay();
        goToSlide(index);
        startAutoplay();
      });
    });

    // 鼠标悬停暂停轮播
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);

    // 初始化
    if (slides.length > 0) goToSlide(0);
    startAutoplay();
  }
  initHeroSlider();

  // ==========================================
  // 4. 滚动渐入动画 (Scroll Reveal)
  // ==========================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }
  initScrollReveal();

  // ==========================================
  // 5. 图片灯箱 (Lightbox)
  // ==========================================
  function initLightbox() {
    // 创建灯箱 DOM 结构
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="关闭">&times;</button><img src="" alt="预览大图" />';
    document.body.appendChild(overlay);

    const img = overlay.querySelector("img");
    const closeBtn = overlay.querySelector(".lightbox-close");

    function openLightbox(src) {
      img.src = src;
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    // 所有带有 lightbox-trigger 类的图片点击触发灯箱
    document.addEventListener("click", function (e) {
      const trigger = e.target.closest(".lightbox-trigger");
      if (trigger) {
        const src = trigger.getAttribute("src") || trigger.dataset.src;
        if (src) {
          openLightbox(src);
          e.preventDefault();
        }
      }
    });

    // 关闭
    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }
  initLightbox();

  // ==========================================
  // 6. 案例分类筛选 (Case Filtering)
  // ==========================================
  function initCaseFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const caseItems = document.querySelectorAll(".case-item");
    if (!filterBtns.length || !caseItems.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        // 更新按钮状态
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        const filter = btn.dataset.filter || "all";

        caseItems.forEach(function (item) {
          const category = item.dataset.category || "";
          if (filter === "all" || category === filter) {
            item.style.display = "block";
            // 重新触发入场动画
            item.classList.remove("revealed");
            // 延迟一帧后重新观察
            requestAnimationFrame(function () {
              item.classList.add("reveal");
              item.classList.remove("reveal");
              // 手动触发显示
              item.style.opacity = "0";
              item.style.transform = "translateY(40px)";
              requestAnimationFrame(function () {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
              });
            });
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }
  initCaseFilter();

  // ==========================================
  // 7. 表单提交处理 (Form Submit)
  // ==========================================
  function initForms() {
    const forms = document.querySelectorAll(".booking-form");
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // 简单表单验证
        let valid = true;
        const requiredFields = form.querySelectorAll("[required]");

        requiredFields.forEach(function (field) {
          field.classList.remove("error");
          if (!field.value.trim()) {
            field.classList.add("error");
            valid = false;
          }
          // 电话验证（至少11位数字）
          if (
            field.type === "tel" &&
            field.value.trim() &&
            field.value.trim().replace(/\D/g, "").length < 11
          ) {
            field.classList.add("error");
            valid = false;
          }
        });

        if (!valid) {
          // 滚动到第一个错误字段
          const firstError = form.querySelector(".error");
          if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }

        // 收集表单数据
        const formData = new FormData(form);
        const data = {};
        formData.forEach(function (value, key) {
          data[key] = value;
        });

        // 显示成功提示
        showToast("感谢您的预约！我们将在24小时内与您联系。");

        // 重置表单
        form.reset();
      });
    });

    // 输入时清除错误状态
    document.addEventListener("input", function (e) {
      if (e.target.classList.contains("error")) {
        e.target.classList.remove("error");
      }
    });
  }
  initForms();

  // ==========================================
  // 8. Toast 提示组件
  // ==========================================
  function showToast(message, duration) {
    duration = duration || 4000;

    // 移除已有 toast
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // 触发动画
    requestAnimationFrame(function () {
      toast.classList.add("show");
    });

    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        toast.remove();
      }, 400);
    }, duration);
  }

  // 暴露到全局供其他内联脚本使用
  window.showToast = showToast;

  // ==========================================
  // 9. 计数器动画 (用于数字统计)
  // ==========================================
  function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10) || 0;
            const suffix = el.dataset.suffix || "";
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuad
              const eased = progress * (2 - progress);
              const current = Math.round(eased * target);
              el.textContent = current + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = target + suffix;
              }
            }

            requestAnimationFrame(updateCounter);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (c) {
      observer.observe(c);
    });
  }
  initCounters();

  // ==========================================
  // 10. 案例页面滚动加载更多动画
  // ==========================================
  // 页面加载完成后对案例做延迟动画
  function animateCaseItems() {
    const items = document.querySelectorAll(".case-item .case-animate");
    items.forEach(function (item, index) {
      setTimeout(function () {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 100 + index * 80);
    });
  }
  animateCaseItems();

}); // DOMContentLoaded 结束

// Page-specific nav highlight
(function() {
  var page = location.pathname.split("/").pop() || "index.html";
  var links = document.querySelectorAll(".nav-link");
  links.forEach(function(link) {
    var href = link.getAttribute("href");
    if (href === page) link.classList.add("active");
    else link.classList.remove("active");
  });
})();
