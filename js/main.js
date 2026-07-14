/* ===== MATTEO PALERMO BARBIERE · main.js ===== */
(function(){
  'use strict';

  /* ---------- INTRO ---------- */
  var intro=document.getElementById('intro'),skip=document.getElementById('intro-skip');
  function closeIntro(){if(intro){intro.classList.add('done');}try{sessionStorage.setItem('mp_seen','1');}catch(e){}}
  var seen=false;try{seen=sessionStorage.getItem('mp_seen')==='1';}catch(e){}
  if(seen&&intro){intro.parentNode.removeChild(intro);}
  else if(intro){setTimeout(closeIntro,2100);if(skip)skip.addEventListener('click',closeIntro);}

  /* ---------- HEADER SCROLL ---------- */
  var header=document.getElementById('site-header');
  function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>12);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- BURGER / NAV ---------- */
  var burger=document.getElementById('burger'),nav=document.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
  }

  /* ---------- ORARI DINAMICI ---------- */
  // getDay() 0=Dom..6=Sab. Mar–Ven 09–12:30 + 14:30–19:30 · Sab 09–12:30 + 14:30–19 · Dom/Lun chiuso
  var W1=[[9,12.5],[14.5,19.5]], WS=[[9,12.5],[14.5,19]];
  var TABLE={0:[],1:[],2:W1,3:W1,4:W1,5:W1,6:WS};
  var DAYS_IT=['dom','lun','mar','mer','gio','ven','sab'];
  var DAYS_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function fmt(h){h=h%24;var H=Math.floor(h),M=Math.round((h-H)*60);return H+':'+(M<10?'0'+M:''+M);}
  function nowRome(){var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'});return new Date(s);}
  function computeLive(){
    var d=nowRome(),day=d.getDay(),hour=d.getHours()+d.getMinutes()/60;
    var wins=TABLE[day]||[],openNow=false,closeAt=null;
    for(var i=0;i<wins.length;i++){if(hour>=wins[i][0]&&hour<wins[i][1]){openNow=true;closeAt=wins[i][1];break;}}
    var nextOpen=null,nextDay=null;
    if(!openNow){
      for(var j=0;j<wins.length;j++){if(wins[j][0]>hour){nextOpen=wins[j][0];nextDay=day;break;}}
      if(nextOpen===null){for(var k=1;k<=7;k++){var dd=(day+k)%7,w2=TABLE[dd];if(w2&&w2.length){nextOpen=w2[0][0];nextDay=dd;break;}}}
    }
    return {openNow:openNow,closeAt:closeAt,nextOpen:nextOpen,nextDay:nextDay,day:day};
  }
  function renderLive(){
    var dot=document.getElementById('live-dot'),txt=document.getElementById('live-text');
    if(!dot||!txt)return;
    var L=computeLive(),en=document.documentElement.lang==='en',DAYS=en?DAYS_EN:DAYS_IT;
    dot.className='';
    if(L.openNow){
      dot.classList.add('open');
      txt.textContent=en?('Open now · until '+fmt(L.closeAt)):('Aperto ora · fino alle '+fmt(L.closeAt));
    }else{
      dot.classList.add('closed');
      if(L.nextOpen!==null){
        var sameDay=L.nextDay===L.day;
        var dl=DAYS[L.nextDay];
        if(en)txt.textContent='Closed · opens '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
        else txt.textContent='Chiuso · apre '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
      }else{txt.textContent=en?'Closed':'Chiuso';}
    }
  }

  /* ---------- I18N ---------- */
  var EN={
    'intro.skip':'Enter →',
    'brand.sub':'Barber · since 1953',
    'nav.storia':'The shop','nav.forbici':'Scissors only','nav.chiacchiere':'The talk','nav.dove':'Find us',
    'cta.book':'Call',
    'hero.eyebrow':'Via San Fermo · Brera · since 1953',
    'hero.tag':'a timeless barbershop',
    'hero.sub':'Since <b>1953</b>, a historic barbershop in the heart of Brera. Here the cut is done <b>with scissors only</b> — no clippers — among the antique cabinets and the glass cases of scented waters of always. <em>You come in for a cut, you leave with a chat.</em>',
    'hero.cta1':'Call for a cut','hero.cta2':'Our way',
    'hero.live':'Checking hours…','hero.f2':'★ 4.9 · historic shop',
    'storia.kicker':'The shop',
    'storia.h2':'A timeless<br>atmosphere.',
    'storia.p1':'The shop opened in <b>1953</b> and was fitted out at the end of the sixties: it has stayed <b>just as it was</b> ever since. The antique cabinets, the glass cases with bottles of scented water, the vintage chairs, the trophies and photographs on the walls.',
    'storia.p2':'Today it’s run by <b>Matteo</b>, one customer at a time. Some have come for ten years, and some come <em>«all the way from the United States»</em> to have their hair cut in a real historic barbershop of Milan.',
    'storia.s1':'the year it opened','storia.s2':'over 86 reviews','storia.s3b':'Historic','storia.s3':'shop of Brera',
    'forbici.kicker':'Our way','forbici.h2':'Scissors only.<br>No clippers.',
    'forbici.p':'It’s our signature, and we write it with the blades. A scissor cut follows the hair one strand at a time: it takes more time, more hand, more eye — but the result <b>grows out well</b> and lasts for weeks. It’s the difference between a haircut and <b>a haircut done properly.</b>',
    'serv.1':'Scissor cut','serv.1p':'for men, made to measure','serv.2':'Beard','serv.2p':'shaped and trimmed','serv.3':'Traditional shave','serv.3p':'hot towel and razor','serv.4':'Cut &amp; beard','serv.4p':'the full service',
    'chiac.kicker':'At the shop we talk about…','chiac.h2':'Not just hair.',
    'chiac.sub':'A historic barbershop is also this: a place where you sit down, wait your turn and chat. Usually you end up talking about…',
    'chiac.t1':'Cinema','chiac.t2':'Sport','chiac.t3':'Neighbourhood life','chiac.t4':'The old Milan','chiac.t5':'The weekend matches','chiac.t6':'A good piece of advice',
    'chiac.note':'«A historic shop where you talk cinema, social life and sport.» — and the blue-and-black football colours are forgiven.',
    'gallery.kicker':'The tools of the trade','gallery.h2':'The hands, and the tools',
    'rev.kicker':'Voices','rev.h2':'“My barber of trust”','rev.g1':'Google review · <span>★★★★★</span>','rev.g2':'Google review · <span>★★★★★</span>',
    'dove.kicker':'Find us','dove.h2':'On Via San Fermo,<br>steps from Brera.',
    'dove.addr':'Address','dove.addr2':'— Brera / San Marco','dove.hours':'Hours','dove.hoursv':'Tue–Fri 09–12:30 & 14:30–19:30 · Sat until 19 · Sun & Mon closed',
    'dove.phone':'Phone','dove.book':'Appointments','dove.bookv':'Best to call: one customer at a time.',
    'dove.call':'Call the shop','dove.wa':'Message us on WhatsApp',
    'faq.h2':'Frequently asked questions',
    'faq.q1':'Where is Matteo Palermo’s shop?','faq.a1':'On Via San Fermo della Battaglia 1, a few steps from Brera and Piazza San Marco, in Milan. It’s a historic shop, open since 1953.',
    'faq.q2':'What kind of cut do you do?','faq.a2':'A men’s cut done with scissors only, no clippers, plus beard and a traditional shave. Artisanal work, made to measure.',
    'faq.q3':'Do I need an appointment?','faq.a3':'Best to call: the shop is small and Matteo works one customer at a time. A quick phone call and you’ll find your spot.',
    'faq.q4':'When are you open?','faq.a4':'Tuesday to Friday 09:00–12:30 and 14:30–19:30, Saturday 09:00–12:30 and 14:30–19:00. Closed Sunday and Monday.',
    'foot.sub':'Barber & Men’s Hairdresser · Brera · since 1953',
    'foot.where':'Where','foot.hours':'Hours','foot.hours2':'Tue–Fri 09–12:30 · 14:30–19:30','foot.hours3':'Sat until 19 · Sun/Mon closed','foot.contact':'Contact',
    'foot.disclaimer':'Demonstration site. Content and photos gathered from public sources (Google Maps); hours and details are indicative, to be confirmed with the shop.',
    'ab.call':'Call','ab.forbici':'Scissors only','ab.route':'Directions'
  };
  var IT={};
  function snapshotIT(){document.querySelectorAll('[data-i18n]').forEach(function(el){IT[el.getAttribute('data-i18n')]=el.innerHTML;});}
  function applyLang(lang){
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]!==undefined)el.innerHTML=dict[k];
      else if(IT[k]!==undefined)el.innerHTML=IT[k];
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===lang);});
    try{sessionStorage.setItem('mp_lang',lang);}catch(e){}
    renderLive();
  }
  snapshotIT();
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang'));});});
  var savedLang='it';try{savedLang=sessionStorage.getItem('mp_lang')||'it';}catch(e){}
  if(savedLang==='en')applyLang('en');else renderLive();

  /* ---------- REVEAL ---------- */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:0.1,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---------- LIGHTBOX ---------- */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),lbClose=document.getElementById('lb-close');
  document.querySelectorAll('.g-item').forEach(function(fig){
    fig.addEventListener('click',function(){
      var full=fig.getAttribute('data-full');if(!full)return;
      lbImg.src=full;var im=fig.querySelector('img');lbImg.alt=im?im.alt:'';
      lb.classList.add('open');lb.setAttribute('aria-hidden','false');
    });
  });
  function closeLb(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');setTimeout(function(){lbImg.src='';},300);}
  if(lbClose)lbClose.addEventListener('click',closeLb);
  if(lb)lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});

  /* ---------- LIVE tick ---------- */
  setInterval(renderLive,60000);
})();
