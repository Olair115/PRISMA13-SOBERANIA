(function () {
  const FOOTER_MARK = "data-prismas-footer";
  const path = window.location.pathname.replace(/\\/g, "/");
  const assetBase = /\/tela\d+\//.test(path) ? "../assets/" : "assets/";

  const styleId = "prismas-footer-selos-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .framework-footer,
      .footer-padrao,
      .footer-lemas,
      .footer {
        width: 100%;
        max-width: 1200px;
        display: grid !important;
        grid-template-columns: auto minmax(220px, max-content) auto;
        align-items: center;
        justify-content: center;
        gap: 16px;
        border-top: 1px solid rgba(255, 215, 0, 0.22) !important;
        padding-top: 16px !important;
        margin-top: 24px;
        text-align: center;
      }
      .prismas-selo {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #ffd700 !important;
        font-family: "Montserrat", "Segoe UI", Arial, sans-serif;
        font-size: 0.75rem;
        font-weight: 900;
        letter-spacing: 1.3px;
        line-height: 1.2;
        text-transform: uppercase;
      }
      .prismas-selo--esquerda { justify-content: flex-end; }
      .prismas-selo--direita { justify-content: flex-start; }
      .prismas-selo img {
        width: 45px;
        height: 45px;
        object-fit: cover;
        display: block;
      }
      .prismas-selo--sol img {
        border-radius: 50%;
        border: 1px solid rgba(255, 230, 0, 0.35);
      }
      .prismas-selo--imc img {
        border-radius: 10px;
      }
      .prismas-footer-centro {
        color: #fff !important;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(0.92rem, 1.35vw, 1.08rem);
        font-style: italic;
        font-weight: 800;
        line-height: 1.45;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.65);
      }
      .prismas-footer-centro span {
        display: block;
        margin-top: 4px;
        color: rgba(255, 255, 255, 0.68) !important;
        font-family: Arial, sans-serif;
        font-size: 0.82rem;
        font-style: normal;
        font-weight: 400;
      }
      @media (max-width: 820px) {
        .framework-footer,
        .footer-padrao,
        .footer-lemas,
        .footer {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .prismas-selo--esquerda,
        .prismas-selo--direita {
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function footerMarkup() {
    return `
      <div class="prismas-selo prismas-selo--sol prismas-selo--esquerda">
        <img src="${assetBase}sol-1985.jpg" alt="SOL 1985">
        <div>SOL 1985</div>
      </div>
      <div class="prismas-footer-centro">
        Seeemmpre melhorrrAndo... NUNKAKABA!<br>
        Ha bracos!
        <span>Dr Olair Rafael - @drolairrafael</span>
      </div>
      <div class="prismas-selo prismas-selo--imc prismas-selo--direita">
        <div>ESBELTEZA imc22</div>
        <img src="${assetBase}esbelteza-imc22.jpg" alt="ESBELTEZA imc22">
      </div>
    `;
  }

  function normalizarRodape(footer) {
    if (!footer || footer.getAttribute(FOOTER_MARK) === "ok") return;
    footer.classList.add("framework-footer");
    footer.innerHTML = footerMarkup();
    footer.setAttribute(FOOTER_MARK, "ok");
  }

  function aplicar() {
    document
      .querySelectorAll("footer, .framework-footer, .footer-padrao, .footer-lemas, .footer")
      .forEach(normalizarRodape);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicar);
  } else {
    aplicar();
  }

  const observer = new MutationObserver(aplicar);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
