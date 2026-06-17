(function () {
  const FOOTER_MARK = "data-prisma13-footer";
  const path = window.location.pathname.replace(/\\/g, "/");
  const assetBase = /\/tela\d+\//.test(path) ? "../assets/" : "assets/";

  const styleId = "prisma13-footer-selos-style";
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
      .prisma13-selo {
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
      .prisma13-selo--esquerda { justify-content: flex-end; }
      .prisma13-selo--direita { justify-content: flex-start; }
      .prisma13-selo img {
        width: 45px;
        height: 45px;
        object-fit: cover;
        display: block;
      }
      .prisma13-selo--sol img {
        border-radius: 50%;
        border: 1px solid rgba(255, 230, 0, 0.35);
      }
      .prisma13-selo--imc img {
        border-radius: 10px;
      }
      .prisma13-footer-centro {
        color: #fff !important;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(0.92rem, 1.35vw, 1.08rem);
        font-style: italic;
        font-weight: 800;
        line-height: 1.45;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.65);
      }
      .prisma13-footer-centro span {
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
        .prisma13-selo--esquerda,
        .prisma13-selo--direita {
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function footerMarkup() {
    return `
      <div class="prisma13-selo prisma13-selo--sol prisma13-selo--esquerda">
        <img src="${assetBase}sol-1985.jpg" alt="SOL 1985">
        <div>SOL 1985</div>
      </div>
      <div class="prisma13-footer-centro">
        Seeemmpre melhorrrAndo... NUNKAKABA!<br>
        Ha bracos!
        <span>Dr Olair Rafael - @drolairrafael</span>
      </div>
      <div class="prisma13-selo prisma13-selo--imc prisma13-selo--direita">
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
