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
  function mark(id){
    var hit=false;
    links.forEach(function(a){
      var on=a.getAttribute("href")==="#"+id;a.setAttribute("aria-current",on?"true":"false");
      if(on){hit=true;bar.style.left=(a.offsetLeft+10)+"px";bar.style.width=(a.offsetWidth-20)+"px";}
    });
    bar.style.opacity=hit?1:0;
  }
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)mark(e.target.id);});},{rootMargin:"-45% 0px -50% 0px"});
    document.querySelectorAll("main section[id]").forEach(function(s){io.observe(s);});
  }

  document.querySelectorAll(".tl-row").forEach(function(b){
    b.addEventListener("click",function(){
      var d=document.getElementById(b.getAttribute("aria-controls"));var open=b.getAttribute("aria-expanded")==="true";
      b.setAttribute("aria-expanded",open?"false":"true");d.hidden=open;
    });
  });

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
