(() => {
  'use strict';
  const d=window.PORTFOLIO,S=window.Site;
  const page=document.body.dataset.page,entryId=document.body.dataset.entry;
  let lang=new URLSearchParams(location.search).get('lang')==='zh'?'zh':'en';
  let filter=new URLSearchParams(location.search).get('category')||'all';
  if(!d.categories.some(c=>c.id===filter))filter='all';
  const e=S.escape,t=item=>S.text(item,lang),v=item=>S.value(item,lang),l=path=>S.link(path,lang);
  const word=(en,zh)=>lang==='en'?en:zh;
  const paragraphs=list=>(v(list)||[]).map(p=>`<p>${e(p)}</p>`).join('');
  const heading=(title,intro='')=>`<div class="page-heading"><p class="eyebrow">${t(d.focus)}</p><h1>${title}</h1>${intro?`<p class="page-intro">${intro}</p>`:''}</div>`;
  function photo(item, extra='') {
    const size=d.mediaSizes[item.src];
    if(size&&size[1]>size[0])extra+=' portrait-image';
    return `<figure class="article-image ${extra}"><img ${size?`width="${size[0]}" height="${size[1]}"`:''} src="${S.asset(item.src)}" alt="${t(item.alt||item.caption)}" loading="lazy">${item.caption?`<figcaption>${t(item.caption)}</figcaption>`:''}</figure>`;
  }
  function blocks(item){
    const content=item.blocks||[];
    const ordered=[...content.filter(block=>block.kind!=='video'),...content.filter(block=>block.kind==='video')];
    return ordered.map((block,index)=>{
      const title=block.heading?`<h2>${t(block.heading)}</h2>`:'';
      if(block.kind==='text')return `<section class="article-text" id="section-${index}">${title}${paragraphs(block.paragraphs)}</section>`;
      if(block.kind==='gallery')return `<section class="article-gallery-section" id="section-${index}">${title}<div class="article-gallery ${block.layout==='grid'?'photo-tiles':block.layout==='wide'?'wide':block.layout==='stack'?'stacked':block.images.length===1?'single':''}">${block.images.map(image=>photo(image)).join('')}</div></section>`;
      if(block.kind==='list')return `<section class="article-text" id="section-${index}">${title}<ul class="article-list">${block.items.map(item=>`<li>${t(item)}</li>`).join('')}</ul></section>`;
      if(block.kind==='links')return `<div class="article-text project-related">${block.items.map(item=>`<a href="${item.url?e(item.url):l(item.page)}" ${item.url?'target="_blank" rel="noopener noreferrer"':''}>${t(item.label)} ↗</a>`).join('')}</div>`;
      if(block.kind==='video'){
        const video=VideoEmbed.parse(block.url||item.videoURL);
        if(!video)return '';
        const player=video.type==='video'?`<div class="native-video-frame"><video controls playsinline preload="none" aria-label="${e(S.title(item,lang))} — ${video.provider}"><source src="${e(video.src)}" type="video/mp4"></video></div>`:`<div class="video-frame"><iframe src="${e(video.src)}" title="${e(S.title(item,lang))} — ${video.provider}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
        return `<section class="article-video" id="section-${index}">${title}${player}<p class="video-caption"><a href="${e(video.url)}" target="_blank" rel="noopener noreferrer">${word('Watch on','观看平台：')} ${video.provider} ↗</a></p></section>`;
      }
      return '';
    }).join('');
  }
  function projectPage(){
    const entries=page==='work'?S.workEntries():d.researchProjects;
    const item=entries.find(item=>item.id===entryId);
    if(!item)return heading(word('Project unavailable','项目不存在'));
    document.title=`${S.title(item,lang)} — ZHANG Lili / 张丽丽`;
    const index=entries.indexOf(item),next=entries[(index+1)%entries.length],previous=entries[(index+entries.length-1)%entries.length];
    const listing=page==='work'?'works.html':'research.html';
    const previousLabel=word('Previous project','上一个项目'),nextLabel=word('Next project','下一个项目');
    const navigation=placement=>`<nav class="project-navigation project-navigation-${placement}" aria-label="${word('Project navigation','项目导航')} — ${word(placement,placement==='top'?'顶部':'底部')}"><a href="${l(previous.page)}" title="${e(S.title(previous,lang))}" aria-label="${previousLabel}: ${e(S.title(previous,lang))}">← ${previousLabel}</a><a class="all-projects" href="${l(listing)}">${word(page==='work'?'All works':'All projects',page==='work'?'全部作品':'全部项目')}</a><a href="${l(next.page)}" title="${e(S.title(next,lang))}" aria-label="${nextLabel}: ${e(S.title(next,lang))}">${nextLabel} →</a></nav>`;
    const floating=`<nav class="project-floating-navigation" aria-label="${word('Quick project navigation','快捷项目导航')}"><a class="floating-previous" href="${l(previous.page)}" title="${previousLabel}: ${e(S.title(previous,lang))}" aria-label="${previousLabel}: ${e(S.title(previous,lang))}"><span aria-hidden="true">←</span></a><a class="floating-next" href="${l(next.page)}" title="${nextLabel}: ${e(S.title(next,lang))}" aria-label="${nextLabel}: ${e(S.title(next,lang))}"><span aria-hidden="true">→</span></a></nav>`;
    const metadata=[t(item.cardMedium||item.medium),S.duration(item,lang),page==='work'?S.workYear(item,lang):(item.year?e(item.year):''),item.status?t(item.status):''].filter(Boolean).join(' · ');
    return `<article class="project-article">${navigation('top')}<header class="project-heading">${metadata?`<p class="eyebrow">${metadata}</p>`:''}<h1>${e(S.title(item,lang))}</h1>${v(item.subtitle)?`<p class="project-subtitle">${t(item.subtitle)}</p>`:''}${item.showSummary!==false?`<p class="article-lead">${t(item.description)}</p>`:''}${item.role?`<p class="project-credit">${word('My role','个人职责')}: ${t(item.role)}</p>`:''}</header>${item.image&&!item.hideCover&&!item.blocks?.some(b=>b.images?.some(i=>i.src===item.image))?photo({src:item.image,alt:S.title(item,lang)},'project-cover'):''}${blocks(item)}${navigation('bottom')}${floating}</article>`;
  }

  function workPage(){
    const works=S.workEntries();
    const count=category=>works.filter(w=>category==='all'||w.category===category).length;
    const tabs=`<nav class="category-nav" aria-label="${word('Browse by category','按类别浏览作品')}">${d.categories.map(cat=>`<a data-category="${e(cat.id)}" href="${l('works.html'+(cat.id==='all'?'':'?category='+cat.id))}" ${filter===cat.id?'aria-current="page"':''}>${t(cat)} <span>${count(cat.id)}</span></a>`).join('')}</nav>`;
    const selected=works.filter(w=>filter==='all'||w.category===filter);
    const category=d.categories.find(cat=>cat.id===filter);
    return `${heading(word('Creative Works','艺术作品'),word('Animation, digital media, interactive art, illustration and design.','动画、数字媒体、交互艺术、插画与设计。'))}${tabs}<div id="category-results" aria-live="polite">${filter==='all'?'':`<div class="category-heading"><h2>${t(category)}</h2><span>${selected.length} ${word(selected.length===1?'work':'works','项作品')}</span></div>`}<div class="category-work-grid">${selected.map(w=>S.workWindow(w,lang)).join('')}</div></div>`;
  }

  function aboutPage(){
    return `${heading(word('About','个人介绍'))}<div class="about-layout"><div class="about-portrait">${photo({src:d.portrait,alt:`${d.name} / ${d.chineseName}`})}</div><div class="article-text"><h2 class="about-name">${e(d.name)} <span lang="zh-CN">${e(d.chineseName)}</span></h2><p class="identity">${t(d.identity)}</p><p class="affiliation">${t(d.affiliation)}</p>${paragraphs(d.aboutParagraphs)}<p class="page-related"><a href="${l('research.html')}">${word('Research & expertise','研究与专业能力')} ↗</a><a href="${l('works.html')}">${word('Creative works','艺术作品')} ↗</a></p></div></div>`;
  }
  function researchPage(){
    const r=d.researchProfile;
    const links=items=>`<span class="research-inline-links">${items.map(item=>`<a href="${l(item.page)}">[${t(item.title)}]</a>`).join(' ')}</span>`;
    const projectLinks=d.projects.map(project=>`<li><a href="${l(project.page)}">${project.displayTitle?t(project.displayTitle):e(project.title)} ↗</a><p>${e(project.year)} · ${t(project.role)}</p></li>`).join('');
    return `${heading(t(r.title),t(d.research))}<div class="research-profile"><section class="research-section" id="research-interests"><h2>${word('Research interests','研究兴趣')}</h2><div class="research-topics">${r.interests.map(item=>`<div><h3>${t(item.heading)}</h3><p>${t(item.text)}</p></div>`).join('')}</div></section><section class="research-section" id="current-research"><h2>${word('Current research','当前研究')}</h2><div class="current-research-list">${r.current.map(item=>`<article><p class="research-date">${t(item.year)}</p><div><h3>${t(item.title)}</h3><p>${t(item.text)} ${links(item.links)}</p></div></article>`).join('')}</div></section><section class="research-section" id="expertise"><h2>${word('Methods & expertise','研究方法与专业能力')}</h2><div class="research-expertise">${r.expertise.map(item=>`<div><h3>${t(item.heading)}</h3><p>${t(item.text)}</p></div>`).join('')}</div></section><section class="research-section" id="research-projects"><h2>${word('Research & collaborative projects','参与的研究与合作项目')}</h2><ul class="research-project-list">${projectLinks}</ul></section><div class="research-background"><section class="research-section" id="education"><h2>${word('Education','教育经历')}</h2><ol class="research-education">${r.education.map(item=>`<li><p class="research-date">${t(item.year)}</p><h3>${t(item.degree)}</h3><p>${t(item.institution)}</p><p class="research-note">${t(item.note)}</p></li>`).join('')}</ol></section><section class="research-section" id="languages"><h2>${word('Languages','语言能力')}</h2><dl class="research-languages">${r.languages.map(item=>`<div><dt>${t(item.name)}</dt><dd>${t(item.level)}</dd></div>`).join('')}</dl></section></div></div>`;
  }
  function publication(pub,conference=false){
    const url=pub.doi?`https://doi.org/${pub.doi}`:'';
    return `<li class="publication-entry"><div class="publication-year">${e(pub.year)}</div><div><h3>${url?`<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(pub.title)} ↗</a>`:e(pub.title)}</h3><p class="publication-authors">${conference?e(d.name):t(pub.authors)}</p><p class="publication-venue">${e(pub.venue)}${conference?` <span class="publication-type">· ${t(pub.kind)}</span>`:''}</p></div></li>`;
  }
  function manuscript(pub){
    return `<li class="publication-entry manuscript-entry"><div><h3>${e(pub.title)}</h3><p class="publication-authors">${t(pub.authors)}</p><p class="publication-note">${t(pub.status)}</p></div></li>`;
  }
  function publicationPage(){
    const underReview=d.underReview?.length?`<section class="publication-section" id="under-review"><h2>${word('Manuscripts under review','审稿中的论文')}</h2><ul>${d.underReview.map(manuscript).join('')}</ul></section>`:'';
    return `${heading(word('Publications','学术发表'))}<div class="reading-column"><section class="publication-section"><h2>${word('Peer-reviewed journal articles','同行评审期刊论文')}</h2><ul>${d.publications.map(pub=>publication(pub)).join('')}</ul></section>${underReview}<section class="publication-section"><h2>${word('Conference papers, presentations & workshops','会议论文、报告与工作坊')}</h2><ul>${d.conferences.map(pub=>publication(pub,true)).join('')}</ul></section><section class="publication-section"><h2>${word('Theses','学位论文')}</h2><ul>${d.theses.map(thesis=>`<li class="publication-entry"><div class="publication-year">${e(thesis.year)}</div><div><h3>${e(thesis.title)}</h3><p class="publication-authors">${e(d.name)}</p><p class="publication-venue">${t(thesis.type)} · ${t(thesis.institution)}</p>${thesis.note?`<p class="publication-note">${t(thesis.note)}</p>`:''}</div></li>`).join('')}</ul></section><p class="page-related"><a href="${e(d.contacts.find(c=>c.label==='Google Scholar').url)}" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a><a href="${e(d.contacts.find(c=>c.label==='ORCID').url)}" target="_blank" rel="noopener noreferrer">ORCID ↗</a></p></div>`;
  }
  function recordList(records){
    return `<ul class="record-list">${records.map(record=>`<li><span class="record-year">${e(record.year)}</span><div><h3>${e(record.title)}</h3><p>${t(record.text)}</p></div></li>`).join('')}</ul>`;
  }
  function recognitionPage(){
    return `${heading(word('Screenings, Exhibitions & Awards','展映、展览与获奖'),word('Festival selections, exhibitions and creative recognition across animation, visual art and design.','动画、视觉艺术与设计领域的电影节入选、展览与创作奖项。'))}<div class="recognition-content"><section class="recognition-section"><h2>${word('Chocolate','巧克力')} <span class="section-date">2021</span></h2><p class="section-intro">${word('An independent animated short selected and exhibited by more than 20 international film festivals.','独立动画短片，获二十余个国际电影节选映与展映。')} <a href="${l('works/chocolate.html')}">[${word('About the film','关于作品')}]</a></p><div class="recognition-table-wrap"><table class="recognition-table"><thead><tr><th scope="col">${word('Festival','电影节')}</th><th scope="col">${word('Location','地点')}</th><th scope="col">${word('Recognition','入选 / 奖项')}</th></tr></thead><tbody>${d.festivalRecords.map(record=>`<tr><td data-label="${word('Festival','电影节')}">${e(record.name)}</td><td data-label="${word('Location','地点')}">${e(record.location)}</td><td data-label="${word('Recognition','入选 / 奖项')}">${t(record.result)}</td></tr>`).join('')}</tbody></table></div></section><section class="recognition-section"><h2>${word('Other exhibitions & screenings','其他展览与展映')}</h2>${recordList(d.exhibitionRecords)}</section><section class="recognition-section"><h2>${word('Creative & professional awards','创作与专业奖项')}</h2>${recordList(d.creativeAwards)}</section><p class="page-related"><a href="${l('teaching.html')}">[${word('Teaching recognition & workshops','教学荣誉与工作坊')}]</a></p></div>`;
  }
  function teachingPage(){
    const experience=d.teaching.experience.map(item=>`<section class="article-text"><h2>${t(item.title)} ${item.year?`<span class="section-date">${e(item.year)}</span>`:''}</h2><ul class="article-list">${item.items.map(line=>`<li>${t(line)}</li>`).join('')}</ul></section>`).join('');
    const workshops=d.teaching.workshops.map(item=>`<article class="workshop-entry"><p class="eyebrow">${e(item.year)}</p><h3>${t(item.title)}</h3><p class="workshop-role">${t(item.role)}</p><ul class="article-list">${item.items.map(line=>`<li>${t(line)}</li>`).join('')}</ul></article>`).join('');
    return `${heading(word('Teaching & Workshops','教学与工作坊'),t(d.teaching.intro))}<div class="reading-column">${experience}<section class="teaching-section"><h2>${word('Workshops & course development','工作坊与课程开发')}</h2>${workshops}</section><section class="teaching-section"><h2>${word('Teaching & professional recognition','教学与专业认可')}</h2>${d.teaching.awards.map(group=>`<section class="award-group"><h3>${t(group.level)}</h3>${recordList(group.records)}</section>`).join('')}</section></div>`;
  }
  function contactPage(){
    return `${heading(word('Contact','联系方式'))}<div class="contact-page-layout">${photo({src:d.portrait,alt:`${d.name} / ${d.chineseName}`})}<div><p class="contact-invitation">${word('For research, artistic collaboration and professional enquiries.','欢迎联系学术研究、艺术合作及专业工作事宜。')}</p><a class="profile-email" href="mailto:${e(d.email)}">${e(d.email)} ↗</a><div class="contact-links">${d.contacts.filter(c=>c.label!=='Email').map(c=>`<a href="${e(c.url)}" target="_blank" rel="noopener noreferrer">${e(c.label)} ↗</a>`).join('')}</div><div class="contact-research"><h2>${word('Selected Achievements','代表性成果')}</h2>${S.highlights(lang)}</div></div></div>`;
  }
  function render(){
    const focusedLanguage=document.activeElement?.dataset.language;
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.body.dataset.language=lang;
    const renderers={about:aboutPage,research:researchPage,works:workPage,publications:publicationPage,contact:contactPage,recognition:recognitionPage,teaching:teachingPage,work:projectPage,project:projectPage};
    document.title=`${word({about:'About',research:'Research & Expertise',works:'Creative works',publications:'Publications',contact:'Contact',recognition:'Screenings, Exhibitions & Awards',teaching:'Teaching & Workshops'}[page]||'Project',{about:'个人介绍',research:'研究与专业能力',works:'艺术作品',publications:'学术发表',contact:'联系方式',recognition:'展映、展览与获奖',teaching:'教学与工作坊'}[page]||'项目')} — ZHANG Lili`;
    document.getElementById('app').innerHTML=`<a class="skip-link" href="#main">${word('Skip to content','跳转到正文')}</a><div class="page-shell">${S.header(lang,page==='work'?'works':page==='project'?'research':page)}<main id="main" class="detail-main">${renderers[page]()}</main>${S.footer(lang)}</div>`;
    if(focusedLanguage)document.querySelector(`[data-language="${focusedLanguage}"]`)?.focus();
  }
  document.addEventListener('click',event=>{
    const language=event.target.closest('[data-language]');
    if(language){lang=language.dataset.language;const url=new URL(location.href);if(lang==='zh')url.searchParams.set('lang','zh');else url.searchParams.delete('lang');history.replaceState(null,'',url);render();return;}
    const tab=event.target.closest('[data-category]');
    if(tab&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){
      event.preventDefault();filter=tab.dataset.category;const url=new URL(tab.href);history.pushState(null,'',url);render();document.querySelector(`[data-category="${filter}"]`)?.focus({preventScroll:true});return;
    }
    const category=event.target.closest('[data-filter]');
    if(category){filter=category.dataset.filter;const y=scrollY;render();scrollTo({top:y,behavior:'instant'});document.querySelector(`[data-filter="${filter}"]`)?.focus({preventScroll:true});return;}
    const work=event.target.closest('a.work-window');
    if(work&&matchMedia('(hover:none)').matches&&event.detail>0&&!event.ctrlKey&&!event.metaKey&&!work.classList.contains('is-revealed')){event.preventDefault();document.querySelectorAll('.is-revealed').forEach(el=>el.classList.remove('is-revealed'));work.classList.add('is-revealed');}
  });
  addEventListener('popstate',()=>{filter=new URLSearchParams(location.search).get('category')||'all';if(!d.categories.some(c=>c.id===filter))filter='all';lang=new URLSearchParams(location.search).get('lang')==='zh'?'zh':'en';render();});
  render();
})();
