/* ============================================================
   MAIN — menu, scroll spy, animações, formulário e utilidades
   Depende de config.js e icons.js (carregados antes).
   ============================================================ */

  (function () {
    "use strict";

    var CONFIG = window.SITE_CONFIG || {};

    /* E-mail guardado em base64 no config.js (dificulta a coleta por bots). */
    function decodeB64(value) {
      try {
        return window.atob(String(value || ""));
      } catch (err) {
        return "";
      }
    }
    if (!CONFIG.email) {
      var emailUser = decodeB64(CONFIG.emailUserB64);
      var emailDomain = decodeB64(CONFIG.emailDomainB64);
      if (emailUser && emailDomain) CONFIG.email = emailUser + "@" + emailDomain;
    }

    var ICONS = window.SITE_ICONS || {};
    function renderIcons(root) {
      (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
        var name = el.getAttribute("data-icon");
        var inner = ICONS[name];
        if (!inner) return;
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("class", el.className || "ic");
        svg.innerHTML = inner;
        el.replaceWith(svg);
      });
    }

    /* ================= Utilidades ================= */
    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

    function toast(msg, type) {
      var wrap = $("#toast-wrap");
      if (!wrap) return;
      type = type || "info";
      var iconName = type === "success" ? "circle-check" : (type === "error" || type === "warning") ? "circle-alert" : "info";
      var t = document.createElement("div");
      t.className = "toast t-" + type;
      t.innerHTML = '<span data-icon="' + iconName + '" class="ic"></span><span class="toast-msg"></span>';
      t.querySelector(".toast-msg").textContent = msg;
      wrap.appendChild(t);
      renderIcons(t);
      requestAnimationFrame(function () { t.classList.add("show"); });
      var kill = function () {
        t.classList.add("hide");
        setTimeout(function () { t.remove(); }, 380);
      };
      var timer = setTimeout(kill, 6500);
      t.addEventListener("click", function () { clearTimeout(timer); kill(); });
    }

    /* ================= Header: fundo ao rolar ================= */
    var header = $("#site-header");
    function onScrollHeader() {
      if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    }

    /* ================= Menu mobile ================= */
    var menuBtn = $("#menu-btn");
    var mobileMenu = $("#mobile-menu");

    function setMenuState(open) {
      document.body.classList.toggle("menu-open", open);
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
      }
      /* Fora da tela o menu fica "inert": não recebe foco nem clique. */
      if (mobileMenu) mobileMenu.inert = !open;
    }
    function closeMenu() { setMenuState(false); }

    if (menuBtn) {
      menuBtn.addEventListener("click", function () {
        setMenuState(!document.body.classList.contains("menu-open"));
      });
    }
    $$("#mobile-menu a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920 && document.body.classList.contains("menu-open")) closeMenu();
    });

    /* ================= Scroll spy (item ativo do menu) ================= */
    var spyIds = ["inicio", "sobre", "habilidades", "projetos", "servicos", "contato"];
    var spySections = spyIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var navLinks = {};
    $$(".nav a").forEach(function (a) {
      var id = (a.getAttribute("href") || "").slice(1);
      if (id) navLinks[id] = a;
    });
    var spyTicking = false;
    function spy() {
      var mid = window.scrollY + window.innerHeight * 0.35;
      var current = "inicio";
      spySections.forEach(function (s) {
        if (s.offsetTop <= mid) current = s.id;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = "contato";
      spyIds.forEach(function (id) {
        var link = navLinks[id];
        if (!link) return;
        var active = id === current;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
        var m = document.querySelector('.mobile-menu nav a[href="#' + id + '"]');
        if (m) m.classList.toggle("active", active);
      });
    }
    window.addEventListener("scroll", function () {
      if (spyTicking) return;
      spyTicking = true;
      requestAnimationFrame(function () {
        onScrollHeader();
        spy();
        spyTicking = false;
      });
    }, { passive: true });
    onScrollHeader();
    spy();

    /* ================= Reveal on scroll ================= */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      $$("[data-reveal]").forEach(function (el) { io.observe(el); });
      $$("[data-reveal-group]").forEach(function (g) { io.observe(g); });
    } else {
      $$("[data-reveal], [data-reveal-group]").forEach(function (el) { el.classList.add("in"); });
    }

    /* ================= Spotlight nos cards (.lift) =================
       Atualiza --mx/--my com a posição do cursor relativa ao card. */
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      $$(".lift").forEach(function (card) {
        card.addEventListener("pointermove", function (e) {
          var rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
          card.style.setProperty("--my", (e.clientY - rect.top) + "px");
        });
      });
    }

    /* ================= Formulário protegido por botão ================= */
    var formGate = $("#form-gate");

    function focusFirstField() {
      var first = $("#f-nome");
      if (!first) return;
      try { first.focus({ preventScroll: true }); } catch (err) { first.focus(); }
    }

    if (formGate) {
      formGate.addEventListener("toggle", function () {
        if (formGate.open) requestAnimationFrame(focusFirstField);
      });
    }

    /* Abre o acordeão, pré-seleciona o serviço (quando houver) e foca o primeiro campo. */
    function openFormGate(service, shouldScroll) {
      if (formGate) formGate.open = true;
      if (service) {
        var select = $("#f-tipo");
        if (select) select.value = service;
      }
      requestAnimationFrame(focusFirstField);

      if (shouldScroll !== false) {
        var target = $("#contato");
        if (target) {
          target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
      }
      if (!reduceMotion) {
        requestAnimationFrame(function () {
          var card = $("#form-card");
          if (!card) return;
          card.classList.remove("pulse");
          void card.offsetWidth;
          card.classList.add("pulse");
        });
      }
    }

    $$(".js-orcamento").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openFormGate(btn.getAttribute("data-service"), true);
      });
    });

    $$("[data-open-form]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openFormGate("", true);
      });
    });

    /* ================= CTA "Falar comigo" e canais diretos ================= */
    function whatsappURL(text) {
      var number = String(CONFIG.whatsapp || "").replace(/\D/g, "");
      return "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
    }
    /* Abre o WhatsApp em nova aba; se o navegador bloquear o pop-up,
       navega na própria aba para não perder a solicitação. */
    function openWhatsApp(url) {
      var win = window.open(url, "_blank");
      if (win) win.opener = null;
      else window.location.href = url;
    }
    function openChannel(kind) {
      if (kind === "whatsapp") {
        if (CONFIG.whatsapp) {
          openWhatsApp(whatsappURL("Olá, Otávio! Vim pelo seu site e quero conversar sobre um projeto."));
        } else {
          toast("O WhatsApp ainda será configurado. Use o formulário para enviar sua solicitação.", "warning");
        }
      } else if (kind === "email") {
        if (CONFIG.email) {
          window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Contato pelo site — Otávio Onishi");
        } else {
          toast("O e-mail de contato ainda será configurado. Use o formulário para enviar sua solicitação.", "warning");
        }
      }
    }
    var ctaTalk = $("#cta-talk");
    if (ctaTalk) ctaTalk.addEventListener("click", function () {
      if (CONFIG.whatsapp || CONFIG.email) { openChannel(CONFIG.whatsapp ? "whatsapp" : "email"); }
      else {
        var target = $("#contato");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    var chW = $("#channel-whatsapp");
    if (chW) chW.addEventListener("click", function () { openChannel("whatsapp"); });
    var chE = $("#channel-email");
    if (chE) chE.addEventListener("click", function () { openChannel("email"); });

    /* ================= Links pendentes (CONFIG) ================= */
    /* Rodapé e redes: aplica os links reais; enquanto vazios, avisam ao clicar. */
    var socialMap = [
      { key: "github", id: "link-github" },
      { key: "instagram", id: "link-instagram" },
      { key: "whatsapp", id: "link-whatsapp" },
      { key: "email", id: "link-email" }
    ];
    socialMap.forEach(function (item) {
      var a = document.getElementById(item.id);
      if (!a) return;
      var value = CONFIG[item.key];
      if (item.key === "whatsapp" && value) a.href = whatsappURL("Olá, Otávio! Vim pelo seu site.");
      else if (item.key === "email" && value) a.href = "mailto:" + value;
      else if (value) a.href = value;
      else a.setAttribute("href", "#");
    });
    $$("[data-config-key]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var key = a.getAttribute("data-config-key");
        if (!CONFIG[key]) {
          e.preventDefault();
          if (a.id === "project-btn") {
            toast("O link deste projeto será adicionado em breve.", "info");
          } else {
            toast("Este canal será configurado em breve. Use o formulário para contato.", "info");
          }
        }
      });
    });
    /* Botão "Visualizar projeto": ativa quando o link existe em CONFIG */
    var projectBtn = $("#project-btn");
    var projectNote = $("#project-pending-note");
    if (projectBtn && CONFIG.anaNailsLink) {
      projectBtn.setAttribute("href", CONFIG.anaNailsLink);
      projectBtn.removeAttribute("aria-disabled");
      projectBtn.setAttribute("target", "_blank");
      projectBtn.setAttribute("rel", "noopener");
      if (projectNote) projectNote.style.display = "none";
    }

    /* ================= Formulário de orçamento ================= */
    var form = $("#form-card");
    var zapInput = $("#f-zap");

    /* Máscara de telefone: (11) 98765-4321 */
    if (zapInput) {
      zapInput.addEventListener("input", function () {
        var d = zapInput.value.replace(/\D/g, "").slice(0, 11);
        var out = d;
        if (d.length > 2 && d.length <= 6) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
        else if (d.length > 6 && d.length <= 10) out = "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
        else if (d.length > 10) out = "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
        zapInput.value = out;
      });
    }

    var RULES = [
      { id: "f-nome", test: function (v) { return v.trim().length >= 3; } },
      { id: "f-email", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      { id: "f-zap", test: function (v) { var d = v.replace(/\D/g, ""); return d.length >= 10 && d.length <= 11; } },
      { id: "f-tipo", test: function (v) { return v !== ""; } },
      { id: "f-desc", test: function (v) { return v.trim().length >= 10; } }
    ];

    RULES.forEach(function (r) {
      var el = document.getElementById(r.id);
      if (!el) return;
      el.addEventListener("input", function () {
        var field = el.closest(".field");
        if (field) field.classList.remove("invalid");
        el.removeAttribute("aria-invalid");
      });
      el.addEventListener("change", function () {
        var field = el.closest(".field");
        if (field) field.classList.remove("invalid");
        el.removeAttribute("aria-invalid");
      });
    });

    function validateForm() {
      var firstInvalid = null;
      RULES.forEach(function (r) {
        var el = document.getElementById(r.id);
        if (!el) return;
        var ok = r.test(el.value || "");
        var field = el.closest(".field");
        if (!ok) {
          if (field) field.classList.add("invalid");
          el.setAttribute("aria-invalid", "true");
          if (!firstInvalid) firstInvalid = el;
        } else {
          if (field) field.classList.remove("invalid");
          el.removeAttribute("aria-invalid");
        }
      });
      if (firstInvalid) firstInvalid.focus({ preventScroll: false });
      return !firstInvalid;
    }

    function serviceLabel(value) {
      var sel = $("#f-tipo");
      if (!sel) return value;
      var opt = sel.querySelector('option[value="' + value + '"]');
      return opt ? opt.textContent : value;
    }

    function buildMessage(data) {
      return [
        "Olá, Otávio! Meu nome é " + data.nome + ".",
        "",
        "Solicitação de orçamento pelo site:",
        "• Serviço: " + serviceLabel(data.tipo),
        "• Prazo desejado: " + (data.prazo || "a combinar"),
        "",
        data.descricao,
        "",
        "E-mail: " + data.email,
        "WhatsApp: " + data.whatsapp
      ].join("\n");
    }

    function showFormAlert(html) {
      var box = $("#form-alert");
      if (!box) return;
      box.innerHTML = html;
      box.classList.add("show");
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) {
          toast("Verifique os campos destacados no formulário.", "error");
          return;
        }

        var data = {
          nome: $("#f-nome").value.trim(),
          email: $("#f-email").value.trim(),
          whatsapp: $("#f-zap").value.trim(),
          tipo: $("#f-tipo").value,
          descricao: $("#f-desc").value.trim(),
          prazo: $("#f-prazo").value.trim()
        };

        /* 1) Backend/serviço de formulário configurado → envio real por POST */
        if (CONFIG.formEndpoint) {
          fetch(CONFIG.formEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ origem: "site-otavio-onishi", dados: data })
          }).then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            toast("Solicitação enviada com sucesso. Retornarei o contato em breve.", "success");
            form.reset();
          }).catch(function () {
            toast("Não foi possível enviar agora. Tente novamente ou use os canais diretos.", "error");
          });
          return;
        }

        /* 2) WhatsApp configurado → abre conversa com a solicitação pronta */
        if (CONFIG.whatsapp) {
          openWhatsApp(whatsappURL(buildMessage(data)));
          toast("Solicitação preparada no WhatsApp — finalize o envio no aplicativo aberto.", "success");
          form.reset();
          return;
        }

        /* 3) E-mail configurado → abre o cliente de e-mail com os dados */
        if (CONFIG.email) {
          window.location.href = "mailto:" + CONFIG.email +
            "?subject=" + encodeURIComponent("Solicitação de orçamento — " + data.nome) +
            "&body=" + encodeURIComponent(buildMessage(data));
          toast("Seu aplicativo de e-mail foi aberto com a solicitação pronta para envio.", "info");
          return;
        }

        /* 4) Nenhum canal configurado → aviso honesto (sem simular sucesso) */
        showFormAlert(
          "<strong>Envio ainda não configurado.</strong> Para ativar este formulário, " +
          "defina <code>whatsapp</code>, <code>email</code> ou <code>formEndpoint</code> " +
          "no arquivo <code>assets/js/config.js</code>."
        );
        toast("Formulário ainda sem canal de envio configurado (veja assets/js/config.js).", "warning");
      });
    }

    /* ================= Voltar ao topo ================= */
    var topBtn = $("#top-btn");
    if (topBtn) {
      window.addEventListener("scroll", function () {
        topBtn.classList.toggle("show", window.scrollY > 600);
      }, { passive: true });
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ================= Ano do rodapé ================= */
    var yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ================= Inicialização ================= */
    renderIcons(document);
  })();
