(() => {
  const base=new URL('.',document.currentScript.src);
  document.body.dataset.theme='light';
  if(new URLSearchParams(location.search).has('theme')){const url=new URL(location.href);url.searchParams.delete('theme');history.replaceState(null,'',url);}
  const escape=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const value=(item,lang)=>item&&typeof item==='object'?item[lang]:item;
  const text=(item,lang)=>escape(value(item,lang));
  const title=(item,lang)=>lang==='zh'&&item.titleZh?item.titleZh:item.title;
  const workYear=(item,lang)=>item.inDevelopment?(lang==='zh'?'进行中':'In progress'):(item.completionYear||(/^\d{4}$/.test(item.year||'')?item.year:''));
  const duration=(item,lang)=>{
    if(!item.durationSeconds)return '';
    const minutes=Math.floor(item.durationSeconds/60),seconds=item.durationSeconds%60;
    return lang==='zh'?`${minutes?minutes+' 分 ':''}${seconds?seconds+' 秒':''}`.trim():`${minutes?minutes+' min ':''}${seconds?seconds+' sec':''}`.trim();
  };
  const cardTitle=(item,lang)=>{const year=workYear(item,lang);return title(item,lang)+(year?(lang==='zh'?`（${year}）`:` (${year})`):'');};
  const cardCaption=(item,lang)=>`<span class="window-caption"><span class="window-title">${escape(cardTitle(item,lang))}</span><span class="window-medium">${[text(item.cardMedium||item.medium,lang),escape(duration(item,lang))].filter(Boolean).join(' · ')}</span><span class="window-description">${text(item.description,lang)}</span>${item.cardRole?`<span class="window-role">${text(item.cardRole,lang)}</span>`:''}</span>`;
  const asset=path=>new URL(path,base).href;
  function link(path,lang='en'){
    const url=new URL(path,base);if(lang==='zh')url.searchParams.set('lang','zh');
    return url.href;
  }
  const labels={en:{about:'About',research:'Research',works:'Works',publications:'Publications',contact:'Contact'},zh:{about:'个人介绍',research:'研究与专业能力',works:'作品',publications:'学术发表',contact:'联系方式'}};
  function header(lang,active='home'){
    return `<header class="site-header"><a class="brand" href="${link('index.html',lang)}">${lang==='en'?'Homepage':'首页'}</a><div class="header-center"><nav aria-label="${lang==='en'?'Main navigation':'主导航'}">${Object.keys(labels.en).map(key=>`<a href="${link(key+'.html',lang)}" ${active===key?'aria-current="page"':''}>${labels[lang][key]}</a>`).join('')}</nav><div class="header-options"><div class="languages" role="group" aria-label="${lang==='en'?'Language':'语言'}"><button type="button" data-language="en" aria-pressed="${lang==='en'}" aria-label="English">EN</button><button type="button" data-language="zh" aria-pressed="${lang==='zh'}" aria-label="中文">中文</button></div></div></div></header>`;
  }
  const footer=lang=>`<footer class="site-footer"><span>© 2026 ZHANG Lili / 张丽丽</span><a href="${link('index.html',lang)}">${lang==='en'?'Homepage':'返回首页'} ↑</a></footer>`;
  function workWindow(work,lang,paused=false){
    const src=work.gif&&!paused?work.gif:(work.poster||work.image);
    return `<a class="work-window${src?'':' window-empty'}" href="${link(work.page,lang)}" aria-label="${escape(cardTitle(work,lang))}">${src?`<img src="${asset(src)}" alt="${escape(title(work,lang))}" loading="lazy">`:`<span class="window-placeholder"><span aria-hidden="true">▹</span><small>${lang==='en'?'Media to be added':'待添加作品素材'}</small></span>`}<span class="window-overlay">${cardCaption(work,lang)}<span class="window-arrow" aria-hidden="true">↗</span></span></a>`;
  }
  function highlights(lang){
    return `<div class="highlights-list">${window.PORTFOLIO.highlights.map(item=>`<p>${text(item.text,lang)} <a href="${link(item.page,lang)}">[${text(item.link,lang)}]</a></p>`).join('')}</div>`;
  }
  const workEntries=()=>window.PORTFOLIO.works.map(entry=>entry.projectId?{...window.PORTFOLIO.researchProjects.find(project=>project.id===entry.projectId),...entry}:entry);
  window.Site={escape,value,text,title,workYear,duration,cardTitle,asset,link,header,footer,workWindow,highlights,workEntries};
})();
