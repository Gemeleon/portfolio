(function(){
  var root=document.documentElement;
  try{var t=localStorage.getItem("theme");if(t)root.setAttribute("data-theme",t);}catch(e){}
  document.getElementById("theme").addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    var dark=cur?cur==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
    var next=dark?"light":"dark";root.setAttribute("data-theme",next);
    try{localStorage.setItem("theme",next);}catch(e){}
  });

  var clock=document.getElementById("clock");
  var fmt=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Madrid"});
  function tick(){clock.textContent=fmt.format(new Date());}
  tick();setInterval(tick,15000);

  var nav=document.getElementById("nav");
  function onScroll(){nav.classList.toggle("scrolled",window.scrollY>8);}
  onScroll();addEventListener("scroll",onScroll,{passive:true});

  var links=[].slice.call(document.querySelectorAll(".links a")),bar=document.querySelector(".links .bar");
  var cur=null;
  addEventListener("resize",function(){if(cur)mark(cur);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(cur)mark(cur);});
  function mark(id){
    cur=id;var hit=false;
    links.forEach(function(a){
      var on=a.getAttribute("href")==="#"+id;a.setAttribute("aria-current",on?"true":"false");
      if(on){hit=true;bar.style.left=(a.offsetLeft+10)+"px";bar.style.width=(a.offsetWidth-20)+"px";bar.style.top=(a.offsetTop+a.offsetHeight-3)+"px";}
    });
    bar.style.opacity=hit?1:0;
  }
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)mark(e.target.id);});},{rootMargin:"-45% 0px -50% 0px"});
    document.querySelectorAll("main section[id]").forEach(function(s){io.observe(s);});
  }

  var rows=[].slice.call(document.querySelectorAll(".tl-row")),empty=document.querySelector(".tl-empty");
  function card(id){return document.getElementById("card-"+id);}
  function row(id){return document.querySelector('.tl-row[data-id="'+id+'"]');}
  function sync(){var any=false;rows.forEach(function(r){var on=r.getAttribute("aria-pressed")==="true";card(r.dataset.id).hidden=!on;if(on)any=true;});if(empty)empty.hidden=any;}
  rows.forEach(function(r){
    r.addEventListener("click",function(){r.setAttribute("aria-pressed",r.getAttribute("aria-pressed")==="true"?"false":"true");sync();
      var c=card(r.dataset.id);if(!c.hidden&&window.innerWidth<=980)c.scrollIntoView({block:"nearest",behavior:"smooth"});});
    r.addEventListener("mouseenter",function(){card(r.dataset.id).classList.add("hl");});
    r.addEventListener("mouseleave",function(){card(r.dataset.id).classList.remove("hl");});
  });
  document.querySelectorAll(".tl-card").forEach(function(c){
    c.addEventListener("mouseenter",function(){row(c.dataset.id).classList.add("hl");});
    c.addEventListener("mouseleave",function(){row(c.dataset.id).classList.remove("hl");});
  });
  document.addEventListener("click",function(e){var x=e.target.closest("[data-close]");if(!x)return;var r=row(x.getAttribute("data-close"));r.setAttribute("aria-pressed","false");r.classList.remove("hl");sync();});
  sync();

  var toast=document.getElementById("toast"),tt;
  function say(m){toast.textContent=m;toast.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove("on");},1800);}
  document.addEventListener("click",function(e){
    var c=e.target.closest("[data-copy]");if(!c)return;
    var text=c.getAttribute("data-copy"),done=c.getAttribute("data-done")||"Copied";
    function fallback(){var ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();
      try{document.execCommand("copy");say(done);}catch(_){say("Select the text to copy it");}document.body.removeChild(ta);}
    try{navigator.clipboard.writeText(text).then(function(){say(done);},fallback);}catch(_){fallback();}
  });
})();
