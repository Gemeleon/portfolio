(function(){
  var ids=["overview","experience","research","projects","learning","contact"];
  var main=document.getElementById("main"); main.classList.add("tabs");
  var btns=[].slice.call(document.querySelectorAll("nav button"));
  function show(id,push){
    if(ids.indexOf(id)<0) id="overview";
    ids.forEach(function(s){document.getElementById(s).classList.toggle("on",s===id);});
    btns.forEach(function(b){b.setAttribute("aria-current",b.dataset.s===id?"true":"false");});
    if(push){try{history.replaceState(null,"","#"+id);}catch(e){location.hash=id;}}
    if(window.innerWidth<860){var n=document.querySelector("nav");if(n)window.scrollTo({top:n.offsetTop-8});}
  }
  btns.forEach(function(b){b.addEventListener("click",function(){show(b.dataset.s,true);});});
  window.addEventListener("hashchange",function(){show(location.hash.slice(1));});
  show(location.hash.slice(1));
  document.addEventListener("click",function(e){
    var c=e.target.closest(".copy"); if(!c) return;
    var t=c.dataset.copy;
    function done(){c.textContent="Copied";setTimeout(function(){c.textContent="Copy";},1600);}
    try{navigator.clipboard.writeText(t).then(done,function(){sel();});}catch(_){sel();}
    function sel(){var r=document.createRange();r.selectNodeContents(document.getElementById("mail"));var s=getSelection();s.removeAllRanges();s.addRange(r);}
  });
  // Fingerprint ridges: a quiet nod to the MasterPrint research.
  var cv=document.querySelector("canvas.ridges"); if(!cv||!cv.getContext) return;
  var g=cv.getContext("2d"), rgb=getComputedStyle(document.documentElement).getPropertyValue("--ridge").trim()||"28,63,148";
  g.strokeStyle="rgba("+rgb+",0.13)"; g.lineWidth=1.4;
  for(var k=1;k<26;k++){
    var r=k*11; g.beginPath();
    for(var a=0;a<=Math.PI*2+0.01;a+=0.02){
      var w=1+0.06*Math.sin(3*a+k*0.35)+0.035*Math.sin(7*a-k*0.2);
      var x=320+Math.cos(a)*r*w*0.82, y=330+Math.sin(a)*r*w*1.08-(k<6?0:Math.sin(a)*8);
      a===0?g.moveTo(x,y):g.lineTo(x,y);
    }
    g.stroke();
  }
})();
