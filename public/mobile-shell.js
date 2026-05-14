(function(){
  var script = document.currentScript;
  var rootUrl = new URL(".", script ? script.src : window.location.href);
  var routes = [
    { path:"index.html", label:"Portal" },
    { path:"tela02/index.html", label:"Tela02" },
    { path:"tela03/index.html", label:"Tela03" },
    { path:"tela04/index.html", label:"Tela04" },
    { path:"tela05/index.html", label:"Tela05" },
    { path:"tela06/index.html", label:"Tela06" },
    { path:"tela07/index.html", label:"Tela07" },
    { path:"tela08/index.html", label:"Tela08" },
    { path:"tela09/index.html", label:"Tela09" },
    { path:"tela10/index.html", label:"Tela10" },
    { path:"tela11/index.html", label:"Tela11" },
    { path:"tela12/index.html", label:"Tela12" },
    { path:"tela13/index.html", label:"Tela13" },
    { path:"tela14/index.html", label:"Tela14" },
    { path:"tela15/index.html", label:"Tela15" },
    { path:"tela16/index.html", label:"Tela16" },
    { path:"tela17/index.html", label:"Tela17" },
    { path:"tela19/index.html", label:"Tela19" },
    { path:"tela20/index.html", label:"Tela20" }
  ];

  function routeUrl(path){
    return new URL(path, rootUrl);
  }

  function normalized(url){
    var parsed = new URL(url, window.location.href);
    var path = decodeURIComponent(parsed.pathname).replace(/\/+$/, "");
    if(!path || path.endsWith("/public")) path += "/index.html";
    if(path.endsWith("/")) path += "index.html";
    return path.toLowerCase();
  }

  function icon(name){
    var icons = {
      home:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
      back:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
      next:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      top:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>',
      install:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>'
    };
    return icons[name] || "";
  }

  function navItem(tag, label, iconName, attrs){
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function(key){
      node.setAttribute(key, attrs[key]);
    });
    node.innerHTML = icon(iconName) + "<span>" + label + "</span>";
    return node;
  }

  function buildNav(){
    if(document.querySelector(".prisma-mobile-nav")) return;

    document.body.classList.add("prisma-mobile-ready");

    var current = normalized(window.location.href);
    var currentIndex = routes.findIndex(function(route){
      return normalized(routeUrl(route.path).href) === current;
    });

    if(currentIndex < 0) currentIndex = 0;

    var previous = routes[Math.max(0, currentIndex - 1)];
    var next = routes[currentIndex + 1] || routes[0];
    var portal = routes[0];

    var nav = document.createElement("nav");
    nav.className = "prisma-mobile-nav";
    nav.setAttribute("aria-label", "Navegacao mobile PRISMA13");

    nav.appendChild(navItem("a", "Inicio", "home", {
      href: routeUrl(portal.path).href,
      "aria-label": "Ir para o portal"
    }));

    nav.appendChild(navItem("a", "Voltar", "back", {
      href: routeUrl(previous.path).href,
      "aria-label": "Voltar uma tela"
    }));

    nav.appendChild(navItem("a", "Seguir", "next", {
      href: routeUrl(next.path).href,
      "aria-label": "Avancar uma tela"
    }));

    var topButton = navItem("button", "Topo", "top", {
      type: "button",
      "aria-label": "Voltar ao topo"
    });
    topButton.addEventListener("click", function(){
      window.scrollTo({ top:0, behavior:"smooth" });
    });
    nav.appendChild(topButton);

    if(currentIndex === 0){
      nav.firstChild.classList.add("is-current");
    }

    document.body.appendChild(nav);
  }

  function registerServiceWorker(){
    if(!("serviceWorker" in navigator)) return;
    if(window.location.protocol === "file:") return;

    navigator.serviceWorker.register(routeUrl("sw.js")).catch(function(){
      return null;
    });
  }

  function wireInstallPrompt(){
    var deferredPrompt = null;

    window.addEventListener("beforeinstallprompt", function(event){
      event.preventDefault();
      deferredPrompt = event;

      var nav = document.querySelector(".prisma-mobile-nav");
      if(!nav || nav.querySelector("[data-install]")) return;

      var installButton = navItem("button", "Instalar", "install", {
        type:"button",
        "data-install":"true",
        "aria-label":"Instalar PRISMA13"
      });

      installButton.addEventListener("click", function(){
        if(!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function(){
          deferredPrompt = null;
          installButton.remove();
        });
      });

      nav.appendChild(installButton);
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", buildNav);
  }else{
    buildNav();
  }

  registerServiceWorker();
  wireInstallPrompt();
})();
