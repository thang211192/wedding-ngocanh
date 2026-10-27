(() => {
  'use strict';
  const templates = window.InvitationArt.getTemplates();
  const labels = { formal: 'Trang trọng', minimal: 'Thẻ & phong bì', romantic: 'Hoa màu nước' };
  const defaults = { groom: 'Văn Thắng', bride: 'Ngọc Anh', date: '', time: '', venue: '', address: '', guest: '', tone: 'formal', note: '' };
  const limits = { groom: 45, bride: 45, venue: 100, address: 180, guest: 70, note: 250 };
  const storageKey = 'wnc:invitation-studio-v1';
  const $ = id => document.getElementById(id);
  let data = { ...defaults }, selected = templates[0], renderTimer, toastTimer, fontsReady = false;
  function clean(input) {
    const out = { ...defaults };
    if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
    for (const [key, max] of Object.entries(limits)) if (typeof input[key] === 'string') out[key] = input[key].normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
    if (typeof input.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      const parsed = new Date(input.date + 'T12:00:00Z');
      if (!isNaN(parsed) && parsed.toISOString().slice(0, 10) === input.date && input.date >= '2020-01-01' && input.date <= '2100-12-31') out.date = input.date;
    }
    if (typeof input.time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) out.time = input.time;
    if (['formal','warm','friends','short'].includes(input.tone)) out.tone = input.tone;
    return out;
  }
  function dateText(d, long = false) {
    if (!d.date) return '[Ngày tổ chức]';
    const [year, month, day] = d.date.split('-');
    if (!long) return `${day} . ${month} . ${year}`;
    return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(d.date + 'T12:00:00Z'));
  }
  function missing(d) {
    return [['groom','tên chú rể'],['bride','tên cô dâu'],['date','ngày tổ chức'],['time','giờ đón khách'],['venue','địa điểm'],['address','địa chỉ']].filter(([key]) => !d[key]).map(([,label]) => label);
  }
  function message(d) {
    const names = `${d.groom || '[Tên chú rể]'} & ${d.bride || '[Tên cô dâu]'}`;
    const when = `${d.time || '[Giờ đón khách]'}, ${dateText(d, true)}`;
    const place = `${d.venue || '[Địa điểm]'}\n${d.address || '[Địa chỉ chi tiết]'}`;
    let text;
    if (d.tone === 'warm') text = `${d.guest ? d.guest + ' thân mến,' : 'Bạn thân mến,'}\n\nChúng mình sắp bước sang một chặng đường mới cùng nhau. ${names} trân trọng mời ${d.guest || 'bạn và gia đình'} đến chung vui trong ngày cưới.\n\nThời gian: ${when}\nĐịa điểm: ${place}\n\nCó bạn ở đó, ngày vui của chúng mình sẽ thêm trọn vẹn. Rất mong được đón bạn!`;
    else if (d.tone === 'friends') text = `${d.guest ? d.guest + ' ơi,' : 'Bạn ơi,'}\n\nChúng mình cưới rồi! ${names} mời ${d.guest || 'bạn'} đến ăn cưới, chụp một tấm hình và chia sẻ niềm vui cùng chúng mình nhé.\n\nHẹn bạn lúc ${when}\nTại: ${place}\n\nNhớ thu xếp đến chung vui với chúng mình nhé!`;
    else if (d.tone === 'short') text = `${names}\nTrân trọng mời ${d.guest || 'bạn và gia đình'} đến dự tiệc cưới và chung vui cùng chúng mình.\n\n${when}\n${place}\n\nRất mong được đón tiếp!`;
    else text = `THIỆP MỜI CƯỚI\n${names}\n\nTrân trọng kính mời ${d.guest || 'bạn và gia đình'} tới tham dự tiệc cưới và chung vui cùng hai gia đình chúng tôi.\n\nThời gian: ${when}\nĐịa điểm: ${place}\n\nSự hiện diện của ${d.guest || 'bạn và gia đình'} là niềm vinh hạnh và hạnh phúc của chúng tôi.\n\nTrân trọng!`;
    return text + (d.note ? '\n\n' + d.note : '');
  }
  function draw(canvas,t,d,width=600) { return window.InvitationArt.draw(canvas,t,d,width); }
  async function loadFonts() {
    await Promise.all([window.InvitationArt.load(document.body.classList.contains('guest-mode')?[selected.art]:undefined), document.fonts.load('400 40px "Great Vibes"','Văn Thắng Ngọc Anh'),document.fonts.load('500 40px "Playfair Display"','Văn Thắng Ngọc Anh'),document.fonts.load('600 20px "Playfair Display"','Văn Thắng'),document.fonts.load('400 20px "Be Vietnam Pro"','Trân trọng kính mời'),document.fonts.load('600 20px "Be Vietnam Pro"','TRÂN TRỌNG KÍNH MỜI')]);
    await document.fonts.ready;fontsReady=true;
  }
  function notify(value){$('toast').textContent=value;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3500);}
  function renderAll(){if(!fontsReady)return;draw($('heroCanvas'),templates[16],data);draw($('heroSideCanvas'),templates[19],data);draw($('heroBackCanvas'),templates[22],data);document.querySelectorAll('.template canvas').forEach(canvas=>draw(canvas,templates.find(t=>t.id===canvas.dataset.template),data,450));if($('previewDialog').open)renderPreview();}
  function renderPreview(){draw($('previewCanvas'),selected,data,900);$('previewCanvas').setAttribute('aria-label',`Thiệp ${selected.name}: ${data.groom} và ${data.bride}, ${dateText(data,true)}, ${data.venue||'chưa có địa điểm'}`);$('previewTitle').textContent=`MẪU ${String(templates.indexOf(selected)+1).padStart(2,'0')} / ${templates.length}`;$('previewCategory').textContent=labels[selected.category]+' · '+selected.label;$('previewName').textContent=selected.name;$('previewDescription').textContent=selected.description;$('messageText').value=message(data);const fields=missing(data);$('completion').textContent=fields.length?'Cần điền trước khi gửi: '+fields.join(', ')+'.':'';$('previewStatus').textContent='';document.querySelector('.manual-copy')?.remove();}
  function openPreview(t){clearTimeout(renderTimer);selected=t;renderAll();renderPreview();$('previewDialog').showModal();$('previewDialog').scrollTop=0;}
  function buildCollection(){
    const fragment=document.createDocumentFragment();
    templates.forEach((t,i)=>{const article=document.createElement('article');article.className='template';article.dataset.category=t.category;article.dataset.template=t.id;const button=document.createElement('button');button.type='button';button.className='template-visual';button.setAttribute('aria-label',`Xem và chọn mẫu ${String(i+1).padStart(2,'0')} — ${t.name}`);const canvas=document.createElement('canvas');canvas.width=450;canvas.height=600;canvas.dataset.template=t.id;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',`Mẫu ${t.name}, ${t.label}`);button.append(canvas);if(t.isNew){const badge=document.createElement('span');badge.className='template-badge';badge.textContent='MỚI';button.append(badge);}button.addEventListener('click',()=>openPreview(t));const meta=document.createElement('div');meta.className='template-meta';const words=document.createElement('div');const h=document.createElement('h3');h.textContent=t.name;const p=document.createElement('p');p.textContent=t.label;words.append(h,p);const number=document.createElement('span');number.className='template-number';number.textContent=String(i+1).padStart(2,'0');meta.append(words,number);const open=document.createElement('button');open.className='template-open';open.type='button';open.textContent='Xem & chọn mẫu ↗';open.setAttribute('aria-label','Xem và chọn '+t.name);open.addEventListener('click',()=>openPreview(t));article.append(button,meta,open);fragment.append(article);});$('templates').append(fragment);
  }
  function normalizeSearch(value){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();}
  function applyFilters(){
    const category=document.querySelector('[data-filter][aria-pressed="true"]').dataset.filter;
    const query=normalizeSearch($('templateSearch').value.trim());
    const theme=$('templateTheme').value;
    let count=0;
    document.querySelectorAll('.template').forEach(card=>{
      const index=templates.findIndex(t=>t.id===card.dataset.template),t=templates[index];
      const categoryMatch=category==='all'||(category==='new'?t.isNew:t.category===category);
      const searchText=normalizeSearch([String(index+1).padStart(2,'0'),t.name,t.label,t.description,labels[t.category]].join(' '));
      const queryMatch=!query||(/^\d{1,2}$/.test(query)?Number(query)===index+1:searchText.includes(query));
      card.hidden=!(categoryMatch&&(theme==='all'||theme===t.art)&&queryMatch);
      if(!card.hidden)count++;
    });
    $('collectionCount').textContent=count+' / '+templates.length+' mẫu thiệp';
    $('templateEmpty').hidden=count!==0;
  }
  function readyToSend(status){const fields=missing(data);if(fields.length){status.textContent='Vui lòng điền '+fields.join(', ')+' trước khi gửi thiệp.';return false;}return true;}
  async function copy(value,status){
    try{await navigator.clipboard.writeText(value);status.textContent='Đã sao chép. Bạn có thể dán để gửi qua Zalo, Messenger hoặc tin nhắn.';}
    catch{document.querySelector('.manual-copy')?.remove();const box=document.createElement('textarea');box.className='manual-copy';box.value=value;box.readOnly=true;box.setAttribute('aria-label','Nội dung cần sao chép thủ công');box.style.cssText='width:100%;min-height:100px;margin-top:12px';status.before(box);box.focus();box.select();status.textContent='Trình duyệt chưa cho sao chép tự động. Nội dung đã được chọn; nhấn Ctrl+C hoặc chạm giữ để sao chép.';}
  }
  async function download(t,d,status){
    if(!readyToSend(status))return;
    const button=status===$('guestStatus')?$('guestDownload'):$('downloadInvite');button.disabled=true;
    try{await loadFonts();const canvas=draw(document.createElement('canvas'),t,d,1500);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`thiep-cuoi-${t.id}.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);status.textContent='Đã tạo ảnh PNG 1500 × 2000. Xem trong mục tải xuống hoặc chọn lưu ảnh trên điện thoại.';}
    catch{status.textContent='Chưa tải được ảnh thiệp. Bạn thử lại hoặc sao chép lời mời để gửi trước nhé.';}finally{button.disabled=false;}
  }
  function prepareGuestSurface(){
    document.documentElement.classList.add('invitation-guest');
    ['.site-header','.site-footer','.skip','#studio','#previewDialog'].forEach(selector=>document.querySelector(selector)?.remove());
  }
  function guestRoute(){
    if(!location.hash.startsWith('#moi='))return false;
    try{if(location.hash.length>6000)throw Error('Too long');const payload=JSON.parse(decodeURIComponent(location.hash.slice(5)));const t=templates.find(x=>x.id===payload.template);if(!t)throw Error('Template');data=clean(payload.details);selected=t;document.body.classList.add('guest-mode');document.documentElement.style.setProperty('--guest-color',t.color);document.documentElement.style.setProperty('--guest-art',`url("${new URL('assets/images/invitations/'+t.art+'-v2.webp',location.href).href}")`);$('coverNames').textContent=`${data.groom} & ${data.bride}`;$('coverGuest').textContent=data.guest||'Bạn và gia đình';$('coverDate').textContent=dateText(data,true);$('openGuestInvite').addEventListener('click',()=>{$('guestCover').hidden=true;$('guestReveal').hidden=false;$('guestReveal').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});$('studio').hidden=true;$('guestView').hidden=false;$('guestHeading').textContent=`${data.groom||'[Tên chú rể]'} & ${data.bride||'[Tên cô dâu]'}`;$('guestText').textContent=message(data);$('guestCanvas').setAttribute('aria-label',message(data));document.title=`Thiệp cưới · ${data.groom} & ${data.bride}`;if(data.address){$('guestMap').hidden=false;$('guestMap').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent([data.venue,data.address].filter(Boolean).join(', '));}$('guestDownload').addEventListener('click',()=>download(selected,data,$('guestStatus')));prepareGuestSurface();return true;}
    catch{document.documentElement.classList.remove('invitation-guest');notify('Liên kết thiệp chưa hợp lệ. Bạn có thể chọn lại một mẫu bên dưới.');return false;}
  }
  async function init(){
    const guest=guestRoute();
    if(!guest){try{data=clean(JSON.parse(localStorage.getItem(storageKey)));}catch{data={...defaults};}
      Object.keys(defaults).forEach(key=>$(key).value=data[key]);buildCollection();
      $('inviteForm').addEventListener('input',()=>{const raw=Object.fromEntries(new FormData($('inviteForm')));data=clean(raw);try{localStorage.setItem(storageKey,JSON.stringify(data));$('saveStatus').textContent='Đã lưu trên trình duyệt này.';}catch{$('saveStatus').textContent='Trình duyệt chưa cho lưu. Bạn vẫn có thể chọn mẫu và gửi thiệp trong phiên này.';}clearTimeout(renderTimer);renderTimer=setTimeout(renderAll,100);});
      document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));applyFilters();}));
      $('templateSearch').addEventListener('input',applyFilters);
      $('templateTheme').addEventListener('change',applyFilters);
      $('showNewTemplates').addEventListener('click',()=>{$('templateSearch').value='';$('templateTheme').value='all';document.querySelector('[data-filter="new"]').click();});
      $('resetTemplateFilters').addEventListener('click',()=>{$('templateSearch').value='';$('templateTheme').value='all';document.querySelector('[data-filter="all"]').click();});
      applyFilters();
      $('closePreview').addEventListener('click',()=>$('previewDialog').close());$('previewDialog').addEventListener('click',event=>{if(event.target!==$('previewDialog'))return;const rect=$('previewDialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)$('previewDialog').close();});
      $('editDetails').addEventListener('click',()=>{$('previewDialog').close();$('thong-tin').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('groom').focus({preventScroll:true});});
      $('copyMessage').addEventListener('click',()=>{if(readyToSend($('previewStatus')))copy(message(data),$('previewStatus'));});$('downloadInvite').addEventListener('click',()=>download(selected,data,$('previewStatus')));$('previewGuest').addEventListener('click',()=>{const url=new URL(location.href);url.search='?v=og1';url.hash='moi='+encodeURIComponent(JSON.stringify({template:selected.id,details:data}));window.open(url.href,'_blank','noopener');});
      $('copyInviteLink').addEventListener('click',()=>{if(!readyToSend($('previewStatus')))return;const url=new URL(location.href);url.search='?v=og1';url.hash='moi='+encodeURIComponent(JSON.stringify({template:selected.id,details:data}));copy(url.href,$('previewStatus'));});
    }
    try{await loadFonts();}catch{notify('Chưa tải đủ họa tiết hoặc font. Hãy tải lại trang để thiệp hiển thị đầy đủ.');fontsReady=true;}
    if(guest)draw($('guestCanvas'),selected,data,900);else renderAll();
  }
  init();
})();
