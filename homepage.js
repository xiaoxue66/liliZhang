(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const concept = document.body.dataset.concept;
  let lang = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
  let activeFilter = 'all';
  let localMedia = null;
  let motionPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const labels = {
    en: {
      about: 'About', research: 'Research', works: 'Works', publications: 'Publications', skip: 'Skip to content',
      revision: 'A2 · Homepage preview', compare: 'Compare layouts', local: 'Local preview · Not published',
      explore: 'Explore works', writing: 'Contact', interests: 'Research & practice',
      heading: 'Traditional culture in contemporary media.', worksHeading: 'Selected works',
      worksIntro: 'Moving images, generative practice and interactive experiences.', worksNote: 'Original artwork shown; labelled placeholders where images are pending.', localMediaCaption: 'Local media preview',
      placeholder: 'Artwork image to be added', placeholderShort: 'Image placeholder',
      bannerPlaceholder: 'Your moving image here', bannerTypes: 'GIF / MP4 / WebM / still image',
      bannerNote: 'Media placeholder · replace with your own work',
      previewMedia: 'Try a local GIF or video', clearMedia: 'Clear preview', previewOnly: 'Local preview only; nothing is uploaded.',
      pause: 'Pause motion', resume: 'Resume motion', paused: 'Motion paused',
      fileError: 'Choose a GIF, PNG, JPEG, WebP, MP4 or WebM file.',
      all: 'All works', moving: 'Moving image', generative: 'Generative images', interactive: 'Interactive & digital',
      preview: 'Preview project', status: 'Current academic status',
      published: 'Publications', journal: 'Peer-reviewed journal articles', article: 'View article',
      top: 'Back to top', footer: 'Traditional culture · Visual arts · Digital media', close: 'Close',
      method: 'About the project', context: 'Context & recognition', role: 'My role',
      projectNotice: 'Homepage prototype: this is a project summary. Dedicated pages with video, images and longer texts are planned for the next stage.'
    },
    zh: {
      about: '个人介绍', research: '研究与实践', works: '作品', publications: '学术发表', skip: '跳转到正文',
      revision: 'A2 · 首页预览', compare: '比较布局', local: '本地预览 · 尚未发布',
      explore: '浏览作品', writing: '联系我', interests: '研究与实践',
      heading: '传统文化的当代视觉表达', worksHeading: '代表作品',
      worksIntro: '动态影像、生成式艺术与交互体验。', worksNote: '真实作品图像与少量明确标注的占位。', localMediaCaption: '本地媒体预览',
      placeholder: '待添加真实作品图像', placeholderShort: '图片占位',
      bannerPlaceholder: '在这里展示你的动态影像', bannerTypes: 'GIF / MP4 / WebM / 静态图像',
      bannerNote: '媒体占位区域 · 后续替换为你的真实作品',
      previewMedia: '试放本地 GIF 或视频', clearMedia: '清除预览', previewOnly: '仅在本地预览，不会上传文件。',
      pause: '暂停动态展示', resume: '继续动态展示', paused: '动态展示已暂停',
      fileError: '请选择 GIF、PNG、JPEG、WebP、MP4 或 WebM 文件。',
      all: '全部作品', moving: '动态影像', generative: '生成式影像', interactive: '交互与数字项目',
      preview: '预览项目', status: '当前学术状态',
      published: '代表性学术发表', journal: '同行评审期刊论文', article: '查看论文',
      top: '返回顶部', footer: '传统文化 · 视觉艺术 · 数字媒体', close: '关闭',
      method: '关于项目', context: '项目背景与荣誉', role: '个人职责',
      projectNotice: '当前为首页原型中的项目摘要。下一阶段再制作可容纳视频、图片与长文的独立项目页面。'
    }
  };
  const e = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const t = value => value && typeof value === 'object' ? value[lang] : value;
  const c = value => e(t(value));
  const ui = key => e(labels[lang][key]);
  const languageButtons = () => `<div class="languages" role="group" aria-label="${lang === 'en' ? 'Language' : '语言'}"><button type="button" data-language="en" aria-pressed="${lang === 'en'}" aria-label="English">EN</button><span aria-hidden="true">/</span><button type="button" data-language="zh" aria-pressed="${lang === 'zh'}" aria-label="中文" lang="zh-CN">中文</button></div>`;

  function bannerContent() {
    const media = localMedia || (concept==='immersive'?data.backgroundBanner:data.banner);
    if (!media.src) return `<div class="media-placeholder"><span class="media-frame-mark" aria-hidden="true">▹</span><p>${ui('bannerPlaceholder')}</p><span>${ui('bannerTypes')}</span><small>${ui('bannerNote')}</small></div>`;
    if (media.type === 'video') return `<video class="banner-source" src="${e(media.src)}" ${media.poster ? `poster="${e(media.poster)}"` : ''} muted loop playsinline preload="metadata" ${concept==='immersive'?'':'controls'} ${motionPaused ? '' : 'autoplay'} aria-label="${localMedia ? ui('localMediaCaption') : c(data.banner.alt)}"></video>`;
    return `<img class="banner-source" src="${e(motionPaused&&media.poster?media.poster:media.src)}" alt="${localMedia ? ui('localMediaCaption') : c(data.banner.alt)}" ${concept==='immersive'?'fetchpriority="high" loading="eager" decoding="async"':''}>`;
  }

  function mediaFigure() {
    const hasMedia = Boolean((localMedia || data.banner).src);
    return `<figure class="featured-media"><div class="media-stage" id="banner-stage">${bannerContent()}</div><figcaption><span>${c(data.banner.caption)}</span><span><button type="button" data-motion>${ui(motionPaused ? 'resume' : 'pause')}</button></span></figcaption></figure>`;
  }

  function heroSection() {
    const profile=`<p class="eyebrow">${c(data.focus)}</p><h1 id="name"><span lang="en">${e(data.name)}</span><span class="name-divider" aria-hidden="true">/</span><span class="name-chinese" lang="zh-CN">${e(data.chineseName)}</span></h1><p class="identity">${c(data.identity)}</p><p class="affiliation">${c(data.affiliation)}</p>`;
    const statement=`<div class="bio">${t(data.bio).split("\n\n").map(paragraph=>`<p>${e(paragraph)}</p>`).join('')}</div>`;
    const links=`<div class="hero-links"><a class="primary-link" href="${Site.link('works.html',lang)}">${ui('explore')} <span aria-hidden="true">↓</span></a><a href="${Site.link('about.html',lang)}">${lang==='en'?'More about me':'更多个人介绍'} <span aria-hidden="true">↗</span></a></div>`;
    const copy=concept==='immersive'?`<div class="hero-copy"><div class="hero-profile">${profile}${links}</div><div class="hero-statement">${statement}</div></div>`:`<div class="hero-copy">${profile}${statement}${links}</div>`;
    return `<section id="about" class="hero hero-${concept}" aria-labelledby="name">${concept==='immersive'?mediaFigure()+copy:copy+mediaFigure()}</section>`;
  }

  function workVisual(work) {
    return Site.workWindow(work,lang,motionPaused);
  }

  function workSection() {
    const entries=Site.workEntries();
    const selected=data.selectedWorkIds?data.selectedWorkIds.map(id=>entries.find(w=>w.id===id)).filter(Boolean):entries;
    const works=activeFilter==='all'?selected:entries.filter(w=>w.category===activeFilter);
    return `<section id="works" class="works-section section" aria-labelledby="works-heading"><h2 id="works-heading" class="visually-hidden">${ui('worksHeading')}</h2><div class="work-filters" role="group" aria-label="${lang === 'en' ? 'Filter works' : '筛选作品'}">${data.categories.map(cat => `<button type="button" data-filter="${e(cat.id)}" aria-pressed="${activeFilter === cat.id}">${c(cat)}</button>`).join('')}</div><div class="visual-windows">${works.map(workVisual).join('')}</div><p class="touch-help">${lang === 'en' ? 'Hover to explore; select a work to open its project page.' : '悬停查看标题与简介，点击进入项目页面。'} <a href="${Site.link('works.html',lang)}">[${lang==='en'?'View all works':'查看全部作品'}]</a></p></section>`;
  }

  function highlightsSection() {
    return `<section id="highlights" class="highlights-section section" aria-labelledby="highlights-heading"><div class="section-heading"><h2 id="highlights-heading">${lang==='en'?'Selected Achievements':'代表性成果'}</h2></div>${Site.highlights(lang)}</section>`;
  }
  function contactSection() {
    return `<section id="contact" class="contact-section section" aria-labelledby="contact-heading"><div class="portrait-wrap"><img src="${e(data.portrait)}" alt="${e(data.name)} / ${e(data.chineseName)}" loading="lazy"></div><div class="contact-copy"><h2 id="contact-heading"><a href="${Site.link('contact.html',lang)}">${lang==='en'?'Contact':'联系方式'} <span aria-hidden="true">↗</span></a></h2><a class="profile-email" href="mailto:${e(data.email)}">${e(data.email)} <span aria-hidden="true">↗</span></a><div class="contact-links">${data.contacts.filter(link=>link.label!=='Email').map(link=>`<a href="${e(link.url)}" target="_blank" rel="noopener noreferrer">${e(link.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div></div></section>`;
  }

  function projectsSection() {
    return `<section id="projects" class="project-list-section section" aria-labelledby="projects-heading"><div class="section-heading"><h2 id="projects-heading">${lang === 'en' ? 'Projects' : '项目'}</h2><p class="section-caption">${lang === 'en' ? 'Research & collaborative practice' : '研究与合作实践'}</p></div><ul class="simple-project-list">${data.projects.map(project=>`<li><div><a class="project-list-title" href="${Site.link(project.page,lang)}">${project.displayTitle?c(project.displayTitle):e(project.title)} <span aria-hidden="true">↗</span></a><p class="project-list-role">${project.year?`<span class="project-list-year">${e(project.year)}</span><span aria-hidden="true"> · </span>`:''}${c(project.role)}</p></div></li>`).join('')}</ul></section>`;
  }

  function render() {
    const focusLanguage = document.activeElement?.dataset.language;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.body.dataset.language = lang;
    document.title = `${data.name} / ${data.chineseName} — ${lang==='en'?'Homepage':'首页'}`;
    document.getElementById('app').innerHTML = `<a class="skip-link" href="#main">${ui('skip')}</a><div class="page-shell" id="top">${Site.header(lang)}<main id="main">${heroSection()}${workSection()}${projectsSection()}${highlightsSection()}${contactSection()}</main><footer class="site-footer"><div><span>© 2026 ${e(data.name)} / ${e(data.chineseName)}</span></div><a href="#top">${ui('top')} ↑</a></footer></div>`;
    document.documentElement.style.setProperty('--site-width',document.documentElement.clientWidth+'px');
    const backgroundVideo=document.querySelector('video.banner-source');
    if(backgroundVideo&&!motionPaused)backgroundVideo.play().catch(()=>{motionPaused=true;const control=document.querySelector('[data-motion]');if(control)control.textContent=labels[lang].resume;});
    if(focusLanguage) document.querySelector(`button[data-language="${focusLanguage}"]`)?.focus();
  }

  document.addEventListener('click', event => {
    const language = event.target.closest('button[data-language]');
    if(language) {lang=language.dataset.language;const url=new URL(location.href);if(lang==='zh')url.searchParams.set('lang','zh');else url.searchParams.delete('lang');history.replaceState(null,'',url);render();return;}
    const filter=event.target.closest('button[data-filter]');
    if(filter) {
      activeFilter=filter.dataset.filter;
      const currentY=scrollY; const key=filter.dataset.filter;
      render(); scrollTo({top:currentY,behavior:'instant'});
      document.querySelector(`button[data-filter="${key}"]`)?.focus({preventScroll:true}); return;
    }
    const work=event.target.closest('a.work-window');
    if(work && matchMedia('(hover: none)').matches && event.detail>0 && !event.ctrlKey && !event.metaKey && !work.classList.contains('is-revealed')){
      event.preventDefault();document.querySelectorAll('.is-revealed').forEach(el=>el.classList.remove('is-revealed'));work.classList.add('is-revealed');return;
    }
    if(event.target.closest('[data-select-media]')){document.getElementById('banner-file').click();return;}
    if(event.target.closest('[data-clear-media]')) {URL.revokeObjectURL(localMedia.src);localMedia=null;motionPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;render();return;}
    if(event.target.closest('[data-motion]')) {
      motionPaused=!motionPaused;
      const video=document.querySelector('video.banner-source');
      if(video){if(motionPaused)video.pause();else video.play().catch(()=>{});event.target.closest('[data-motion]').textContent=labels[lang][motionPaused?'resume':'pause'];}
      else render();
      return;
    }
  });

  document.addEventListener('change', event => {
    if(event.target.id!=='banner-file')return;
    const file=event.target.files?.[0]; if(!file)return;
    if(!/^image\/(gif|png|jpeg|webp)$|^video\/(mp4|webm)$/.test(file.type)){document.getElementById('media-message').textContent=labels[lang].fileError;return;}
    if(localMedia)URL.revokeObjectURL(localMedia.src);
    localMedia={src:URL.createObjectURL(file),type:file.type.startsWith('video/')?'video':'image'};
    motionPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
    render();
  });
  addEventListener('resize',()=>document.documentElement.style.setProperty('--site-width',document.documentElement.clientWidth+'px'));
  addEventListener('beforeunload',()=>{if(localMedia)URL.revokeObjectURL(localMedia.src);});
  render();
})();
