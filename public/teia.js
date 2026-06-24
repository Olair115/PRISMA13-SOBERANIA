// PRISMAS - Código de Fusão Holossistêmica e Renderização da Teia
document.addEventListener("DOMContentLoaded", () => {
    const svg = document.getElementById("teiaSvg");
    if (!svg) return;

    const gridG = document.getElementById("gridMandala") || document.getElementById("grade");
    const caudaPath = document.getElementById("tailMandala") || document.getElementById("cauda");
    const caudaFriaPath = document.getElementById("caudaFria");
    const ponto = document.getElementById("ponto");
    const halo = document.getElementById("halo");

    const CONFIG = {
        intervaloPulsoMs: 333,
        totalDimesoes: 13,
        totalEstagios: 5
    };

    const MANDALA = {
        cx: 380,
        cy: 380,
        raiosBase: [82, 126, 172, 220, 270],
        dimAtual: 0,
        estagioAtual: 2,
        ciclo: 0,
        passo: 0,
        coords: [],
        maxHist: 18,
        historico: []
    };

    const DIMENSOES = [
        "Soberania", "Ar Limpo", "Água Viva", "Luz Solar", "Sono",
        "Movimento", "Nutrição", "Jejum", "Pensamento", "Sentimento",
        "Ações", "Trabalho", "Espírito"
    ];

    function criarSVG(tag, attrs = {}) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
        return el;
    }

    function polar(raio, anguloGraus) {
        const rad = anguloGraus * Math.PI / 180;
        return {
            x: MANDALA.cx + Math.cos(rad) * raio,
            y: MANDALA.cy + Math.sin(rad) * raio
        };
    }

    function raioIrregular(dimIndex, estagioIndex) {
        const base = MANDALA.raiosBase[estagioIndex];
        const t = MANDALA.ciclo * 0.42;
        const onda1 = Math.sin((dimIndex + 1) * 0.88 + estagioIndex * 0.96 + t) * 16;
        const onda2 = Math.cos((dimIndex + 2) * 0.57 - estagioIndex * 1.08 + t * 0.76) * 11;
        const onda3 = Math.sin((dimIndex + estagioIndex + 4) * 1.24 + t * 1.18) * 6;
        return base + onda1 + onda2 + onda3;
    }

    function desenharGradeEstatica() {
        if (!gridG) return;
        gridG.innerHTML = "";

        MANDALA.raiosBase.forEach((raio) => {
            const circulo = criarSVG("circle", {
                cx: MANDALA.cx,
                cy: MANDALA.cy,
                r: raio,
                style: "fill: none; stroke: rgba(255, 215, 0, 0.14); stroke-width: 1;"
            });
            gridG.appendChild(circulo);
        });

        const anguloPasso = 360 / CONFIG.totalDimesoes;
        DIMENSOES.forEach((nome, i) => {
            const angulo = -90 + i * anguloPasso;
            const ponta = polar(285, angulo);

            const linha = criarSVG("line", {
                x1: MANDALA.cx,
                y1: MANDALA.cy,
                x2: ponta.x,
                y2: ponta.y,
                style: "stroke: rgba(255, 255, 255, 0.08); stroke-width: 0.8;"
            });
            gridG.appendChild(linha);

            // Letras maiores (12px, bold) e alinhamento estrito na horizontal (transform=rotate(0))
            const labelPos = polar(318, angulo);
            const textEl = criarSVG("text", {
                x: labelPos.x,
                y: labelPos.y,
                "text-anchor": "middle",
                "dominant-baseline": "middle",
                style: "fill: #ffd700; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.6px;"
            });

            textEl.setAttribute("transform", `rotate(0, ${labelPos.x}, ${labelPos.y})`);
            textEl.textContent = nome.toUpperCase();
            gridG.appendChild(textEl);
        });
    }

    function atualizarGeometriaTeia() {
        MANDALA.coords = [];
        const anguloPasso = 360 / CONFIG.totalDimesoes;
        for (let dim = 0; dim < CONFIG.totalDimesoes; dim++) {
            MANDALA.coords[dim] = [];
            const angulo = -90 + dim * anguloPasso;
            for (let est = 0; est < CONFIG.totalEstagios; est++) {
                MANDALA.coords[dim][est] = polar(raioIrregular(dim, est), angulo);
            }
        }
    }

    desenharGradeEstatica();

    setInterval(() => {
        MANDALA.ciclo += 0.24;
        MANDALA.passo += 1;
        
        atualizarGeometriaTeia();
        
        const rDim = Math.random();
        if (rDim < 0.52) {
            MANDALA.dimAtual = (MANDALA.dimAtual - 1 + CONFIG.totalDimesoes) % CONFIG.totalDimesoes;
        } else if (rDim < 0.70) {
            MANDALA.dimAtual = (MANDALA.dimAtual - 2 + CONFIG.totalDimesoes) % CONFIG.totalDimesoes;
        } else {
            MANDALA.dimAtual = (MANDALA.dimAtual + 1) % CONFIG.totalDimesoes;
        }

        const rEst = Math.random();
        if (rEst < 0.40) {
            MANDALA.estagioAtual = Math.max(0, Math.min(4, MANDALA.estagioAtual + (Math.random() < 0.5 ? -1 : 1)));
        }

        const posAtual = MANDALA.coords[MANDALA.dimAtual][MANDALA.estagioAtual];

        MANDALA.historico.push({ x: posAtual.x, y: posAtual.y });
        if (MANDALA.historico.length > MANDALA.maxHist) {
            MANDALA.historico.shift();
        }

        if (MANDALA.historico.length > 1) {
            let pathD = `M ${MANDALA.historico[0].x} ${MANDALA.historico[0].y}`;
            for (let i = 1; i < MANDALA.historico.length; i++) {
                pathD += ` L ${MANDALA.historico[i].x} ${MANDALA.historico[i].y}`;
            }
            if (caudaPath) caudaPath.setAttribute("d", pathD);
            if (caudaFriaPath) caudaFriaPath.setAttribute("d", pathD);
        }

        if (ponto && halo) {
            ponto.setAttribute("cx", posAtual.x);
            ponto.setAttribute("cy", posAtual.y);
            halo.setAttribute("cx", posAtual.x);
            halo.setAttribute("cy", posAtual.y);
            
            let raioHalo = 14 + 5 * Math.sin(MANDALA.passo * 0.5);
            halo.setAttribute("r", raioHalo);
        }
    }, CONFIG.intervaloPulsoMs);
});