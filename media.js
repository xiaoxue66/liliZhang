/* Only supported external video URLs become embedded players. */
(() => {
  function parse(input) {
    if(!input || typeof input!=='string') return null;
    let url;try{url=new URL(input);}catch{return null;}
    if(url.protocol!=='https:')return null;
    const host=url.hostname.toLowerCase(),parts=url.pathname.split('/').filter(Boolean);
    if(['engineeringhistoricalmemory.com','www.engineeringhistoricalmemory.com'].includes(host)&&url.pathname.startsWith('/Media/Videos/')&&/\.mp4$/i.test(url.pathname)&&!url.username&&!url.password){
      return {provider:'EHM',type:'video',src:url.href,url:url.href};
    }
    if(['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(host)){
      let id=host==='youtu.be'?parts[0]:(url.searchParams.get('v')||(['embed','shorts'].includes(parts[0])?parts[1]:''));
      if(!/^[A-Za-z0-9_-]{11}$/.test(id||''))return null;
      return {provider:'YouTube',src:`https://www.youtube.com/embed/${id}?playsinline=1`,url:`https://www.youtube.com/watch?v=${id}`};
    }
    if(['www.bilibili.com','bilibili.com','player.bilibili.com'].includes(host)){
      if(url.username||url.password)return null;
      const id=host==='player.bilibili.com'?(url.searchParams.get('bvid')||('av'+(url.searchParams.get('aid')||''))):(parts[0]==='video'?parts[1]:'');
      const bv=/^BV[A-Za-z0-9]{10}$/.test(id||''),av=/^av([1-9][0-9]*)$/i.exec(id||'');
      if(!bv&&!av)return null;
      const embed=new URL('https://player.bilibili.com/player.html');embed.searchParams.set(bv?'bvid':'aid',bv?id:av[1]);
      embed.searchParams.set('autoplay','0');embed.searchParams.set('danmaku','0');embed.searchParams.set('poster','1');
      const part=url.searchParams.get('p');if(part){if(!/^[1-9][0-9]*$/.test(part))return null;embed.searchParams.set('p',part);}
      return {provider:'Bilibili',src:embed.href,url:`https://www.bilibili.com/video/${bv?id:'av'+av[1]}/${part?'?p='+part:''}`};
    }
    if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(host)){
      const index=parts.findIndex(part=>/^\d+$/.test(part));if(index<0)return null;
      const id=parts[index],hash=url.searchParams.get('h')||parts[index+1];
      const embed=new URL(`https://player.vimeo.com/video/${id}`);
      if(hash){if(!/^[A-Za-z0-9]+$/.test(hash))return null;embed.searchParams.set('h',hash);}
      return {provider:'Vimeo',src:embed.href,url:url.href};
    }
    return null;
  }
  window.VideoEmbed={parse};
})();
