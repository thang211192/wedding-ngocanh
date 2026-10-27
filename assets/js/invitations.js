(() => {
  'use strict';
  const templates = [
    { id: 'vom-anh-kim', name: 'Vòm ánh kim', category: 'formal', label: 'Kem ngà · Ánh kim', bg: '#fcf7ed', ink: '#51412e', accent: '#a68b53', mode: 'arch', description: 'Vòm thanh mảnh trên nền kem ngà, điểm ánh vàng nhẹ. Một lời mời trang trọng và ấm áp.' },
    { id: 'do-ruou', name: 'Lời hẹn đỏ rượu', category: 'formal', label: 'Đỏ rượu · Vàng champagne', bg: '#562831', ink: '#f9efdf', accent: '#c3a36d', mode: 'seal', description: 'Sắc đỏ rượu sâu, khung đôi và dấu ấn tên hai bạn. Hợp với một buổi lễ trang nghiêm.' },
    { id: 'navy', name: 'Đêm xanh navy', category: 'formal', label: 'Navy · Ánh vàng', bg: '#182c3d', ink: '#f7f0e1', accent: '#c2a575', mode: 'stars', description: 'Xanh navy và những điểm sao nhỏ, gọn gàng như một lời hẹn trong buổi tối thanh lịch.' },
    { id: 'xanh-ngoc', name: 'Ngọc lục bảo', category: 'formal', label: 'Xanh ngọc · Vàng nhạt', bg: '#203e37', ink: '#fbf3df', accent: '#bfa671', mode: 'diamond', description: 'Xanh ngọc trầm với nét hình học ánh vàng, trang trọng và có chiều sâu.' },
    { id: 'trang-den', name: 'Chung đôi', category: 'minimal', label: 'Trắng ấm · Đen mực', bg: '#faf9f5', ink: '#282825', accent: '#8a8276', mode: 'editorial', description: 'Bố cục chữ lớn, khoảng trắng rộng và một đường kẻ mảnh. Dành cho người thích sự giản dị.' },
    { id: 'cat-vang', name: 'Miền cát ấm', category: 'minimal', label: 'Cát be · Nâu đất', bg: '#e9dfce', ink: '#5c4635', accent: '#9c7d5c', mode: 'sun', description: 'Sắc cát dịu và những vòng cung đồng tâm. Hiện đại, mềm mại và dễ gần.' },
    { id: 'hong-phan', name: 'Hồng phấn', category: 'romantic', label: 'Hồng phấn · Nâu hồng', bg: '#f4e5e1', ink: '#6c4149', accent: '#b48689', mode: 'floral', description: 'Những cành hoa nét mảnh trên nền hồng nhạt, lãng mạn nhưng vẫn giữ sự tinh tế.' },
    { id: 'o-liu', name: 'Vườn ô liu', category: 'romantic', label: 'Trắng kem · Xanh ô liu', bg: '#f4f3e9', ink: '#46503d', accent: '#8b9577', mode: 'botanical', description: 'Lá xanh ô liu ôm lấy lời mời, mang cảm giác tự nhiên và yên bình.' },
    { id: 'trang-ngoc', name: 'Trắng ngọc trai', category: 'formal', label: 'Trắng ngọc · Xám bạc', bg: '#f7f7f3', ink: '#535762', accent: '#9fa4ae', mode: 'oval', description: 'Khung oval và các chấm nhỏ như ngọc trai. Nhẹ nhàng, lịch thiệp, không quá cầu kỳ.' },
    { id: 'tim-khoi', name: 'Tím khói', category: 'romantic', label: 'Tím khói · Kem nhạt', bg: '#e8e2ed', ink: '#5b4967', accent: '#9b85a9', mode: 'ribbon', description: 'Một dải nơ nét mảnh và sắc tím khói, dành cho lời mời dịu dàng và riêng tư.' },
    { id: 'dat-nung', name: 'Nắng đất nung', category: 'minimal', label: 'Đất nung · Kem ấm', bg: '#a85743', ink: '#fff2df', accent: '#e3ba93', mode: 'blocks', description: 'Các mảng hình học trong bảng màu đất nung. Một lựa chọn hiện đại và nổi bật.' },
    { id: 'den-vang', name: 'Dạ tiệc ánh vàng', category: 'formal', label: 'Đen than · Vàng cổ', bg: '#282725', ink: '#f4ead5', accent: '#b49b67', mode: 'deco', description: 'Khung Art Deco cân xứng, đen than và vàng cổ. Hợp với phong cách dạ tiệc trang trọng.' },
    { id: 'xanh-suong', name: 'Xanh sương mai', category: 'minimal', label: 'Xanh sương · Xanh mực', bg: '#e3ebee', ink: '#365260', accent: '#8ca4ad', mode: 'horizon', description: 'Những đường chân trời mỏng và màu xanh sương, thoáng nhẹ và gọn gàng.' },
    { id: 'hoa-moc', name: 'Hoa mộc', category: 'romantic', label: 'Kem ấm · Nâu đồng', bg: '#f2e9db', ink: '#6c4b38', accent: '#ac8564', mode: 'wreath', description: 'Vòng cành lá mảnh trên nền giấy ấm, như một lời mời chân thành được viết riêng.' },
    { id: 'hong-dao', name: 'Lời thương màu đào', category: 'romantic', label: 'Hồng đào · Đỏ đất', bg: '#f8e4d5', ink: '#874d43', accent: '#c48d72', mode: 'heart', description: 'Một trái tim vẽ bằng nét đơn và gam đào ấm. Lãng mạn, sáng và thân tình.' },
    { id: 'xanh-reu', name: 'Dấu ấn xanh rêu', category: 'minimal', label: 'Xanh rêu · Trắng ngà', bg: '#4e594c', ink: '#f4f0e4', accent: '#b4bea7', mode: 'monogram', description: 'Tên viết tắt nổi bật, bố cục thoáng và màu xanh rêu. Tối giản mà vẫn có dấu ấn riêng.' }
  ];
  const labels = { formal: 'Trang trọng', minimal: 'Tối giản', romantic: 'Lãng mạn' };
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
  const serif = '"Playfair Display"', sans = '"Be Vietnam Pro"';
  function font(ctx, size, family = sans, weight = 400) { ctx.font = `${weight} ${size}px ${family}`; }
  function text(ctx, value, y, options = {}) {
    const { size = 18, family = sans, weight = 400, max = 450, color, x = 300, min = 12 } = options;
    if (color) ctx.fillStyle = color;
    let actual = size; font(ctx, actual, family, weight);
    while (ctx.measureText(value).width > max && actual > min) { actual--; font(ctx, actual, family, weight); }
    ctx.textAlign = 'center'; ctx.fillText(value, x, y);
    return actual;
  }
  function lines(ctx, value, y, options = {}) {
    const { size = 17, width = 440, lineHeight = 26, maxLines = 3 } = options;
    font(ctx, size); const words = value.split(/\s+/); const result = []; let line = '';
    for (const word of words) {
      const attempt = line ? line + ' ' + word : word;
      if (ctx.measureText(attempt).width > width && line) { result.push(line); line = word; } else line = attempt;
    }
    if (line) result.push(line);
    if (result.length > maxLines) return lines(ctx, value, y, { ...options, size: Math.max(9, size - 1), maxLines: size <= 10 ? result.length : maxLines });
    result.forEach((line, i) => text(ctx, line, y + i * lineHeight, { size, max: width, min: 9 }));
    return y + result.length * lineHeight;
  }
  function stroke(ctx, path, width = 1) { ctx.lineWidth = width; ctx.beginPath(); path(); ctx.stroke(); }
  function line(ctx,x1,y1,x2,y2,width=1) { stroke(ctx,()=>{ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);},width); }
  function leaf(ctx,x,y,angle,scale=1) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);
    stroke(ctx,()=>{ctx.moveTo(0,0);ctx.bezierCurveTo(-8,-14,-4,-28,0,-34);ctx.bezierCurveTo(10,-19,9,-8,0,0);});ctx.restore();
  }
  function branch(ctx,x,y,mirror=1) {
    ctx.save();ctx.translate(x,y);ctx.scale(mirror,1);stroke(ctx,()=>{ctx.moveTo(0,0);ctx.bezierCurveTo(25,-45,50,-90,38,-145);});
    for(let i=0;i<5;i++){leaf(ctx,12+i*7,-20-i*23,-.75, .9);leaf(ctx,17+i*5,-28-i*23,.9,.85);}ctx.restore();
  }
  function flower(ctx,x,y,r=18) {
    ctx.save();ctx.translate(x,y);for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);stroke(ctx,()=>ctx.ellipse(0,-r*.65,r*.4,r*.7,0,0,Math.PI*2));}stroke(ctx,()=>ctx.arc(0,0,4,0,Math.PI*2));ctx.restore();
  }
  function star(ctx,x,y,r=6){stroke(ctx,()=>{ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);ctx.moveTo(x,y-r);ctx.lineTo(x,y+r);});}
  function ornament(ctx,t,d) {
    ctx.strokeStyle=t.accent;ctx.fillStyle=t.accent;ctx.lineWidth=1.2;
    const mode=t.mode;
    if(mode==='arch'){
      [0,9].forEach(n=>stroke(ctx,()=>{ctx.moveTo(58+n,742-n);ctx.lineTo(58+n,235);ctx.bezierCurveTo(58+n,32+n,542-n,32+n,542-n,235);ctx.lineTo(542-n,742-n);ctx.closePath();}));star(ctx,300,104,10);
    } else if(mode==='seal'){
      ctx.strokeRect(38,38,524,724);ctx.strokeRect(47,47,506,706);stroke(ctx,()=>ctx.arc(300,130,40,0,Math.PI*2));text(ctx,initials(d),138,{family:serif,size:25,color:t.accent});
    } else if(mode==='stars'){
      ctx.strokeRect(42,42,516,716);[[85,105,7],[480,140,9],[510,650,6],[95,690,9],[300,100,12],[452,84,4],[120,250,4]].forEach(a=>star(ctx,...a));
    } else if(mode==='diamond'){
      ctx.strokeRect(38,38,524,724);[0,13].forEach(n=>stroke(ctx,()=>{ctx.moveTo(300,65+n);ctx.lineTo(405-n,127);ctx.lineTo(300,189-n);ctx.lineTo(195+n,127);ctx.closePath();}));
    } else if(mode==='editorial'){
      line(ctx,50,70,550,70);line(ctx,50,730,550,730);text(ctx,'THE WEDDING',112,{size:12,color:t.accent});text(ctx,'&',450,{family:serif,size:260,color:t.accent});
    } else if(mode==='sun'){
      [65,83,101].forEach(r=>stroke(ctx,()=>ctx.arc(300,155,r,Math.PI,Math.PI*2)));line(ctx,75,740,525,740);branch(ctx,80,695,1);
    } else if(mode==='floral'){
      ctx.strokeRect(42,42,516,716);branch(ctx,60,205);flower(ctx,92,87,25);branch(ctx,535,735,-1);flower(ctx,510,682,18);
    } else if(mode==='botanical'){
      branch(ctx,74,240,1);branch(ctx,526,240,-1);branch(ctx,75,730,1);branch(ctx,525,730,-1);line(ctx,150,80,450,80);
    } else if(mode==='oval'){
      stroke(ctx,()=>ctx.ellipse(300,400,253,360,0,0,Math.PI*2));for(let a=0;a<Math.PI*2;a+=.12){ctx.beginPath();ctx.arc(300+242*Math.cos(a),400+348*Math.sin(a),1.6,0,Math.PI*2);ctx.fill();}
    } else if(mode==='ribbon'){
      ctx.strokeRect(46,46,508,708);stroke(ctx,()=>{ctx.moveTo(300,115);ctx.bezierCurveTo(170,40,170,180,300,115);ctx.bezierCurveTo(430,40,430,180,300,115);ctx.lineTo(268,180);ctx.moveTo(300,115);ctx.lineTo(332,180);},1.7);
    } else if(mode==='blocks'){
      ctx.globalAlpha=.16;ctx.fillRect(0,0,125,800);ctx.fillRect(475,0,125,800);ctx.globalAlpha=1;line(ctx,55,65,545,65,2);line(ctx,55,735,545,735,2);star(ctx,300,122,17);
    } else if(mode==='deco'){
      [0,10,20].forEach(n=>{ctx.strokeRect(38+n,38+n,524-2*n,724-2*n);});[[60,60,1,1],[540,60,-1,1],[60,740,1,-1],[540,740,-1,-1]].forEach(([x,y,sx,sy])=>{line(ctx,x,y,x+65*sx,y+65*sy);line(ctx,x+25*sx,y,x,y+25*sy);});star(ctx,300,120,15);
    } else if(mode==='horizon'){
      [0,10,20].forEach(n=>line(ctx,80+n*2,95+n,520-n*2,95+n));[0,10,20].forEach(n=>line(ctx,80+n*2,705+n,520-n*2,705+n));stroke(ctx,()=>ctx.arc(300,110,47,Math.PI,Math.PI*2));
    } else if(mode==='wreath'){
      branch(ctx,180,185);branch(ctx,420,185,-1);flower(ctx,300,85,17);line(ctx,90,720,510,720);
    } else if(mode==='heart'){
      stroke(ctx,()=>{ctx.moveTo(300,165);ctx.bezierCurveTo(200,107,250,62,300,112);ctx.bezierCurveTo(350,62,400,107,300,165);},1.7);ctx.strokeRect(45,45,510,710);flower(ctx,80,715,17);flower(ctx,520,715,17);
    } else if(mode==='monogram'){
      text(ctx,initials(d),155,{family:serif,size:65,color:t.accent});line(ctx,220,183,380,183);line(ctx,75,725,525,725);
    }
  }
  function initials(d){return [d.groom,d.bride].map(n=>(n.trim().split(/\s+/).pop()||'').slice(0,1).toLocaleUpperCase('vi-VN')).join(' & ');}
  function draw(canvas,t,d,width=600) {
    canvas.width=width;canvas.height=width*4/3;const ctx=canvas.getContext('2d');ctx.scale(width/600,width/600);ctx.fillStyle=t.bg;ctx.fillRect(0,0,600,800);
    ornament(ctx,t,d);
    if(t.mode==='editorial'){ctx.fillStyle=t.bg;ctx.globalAlpha=.87;ctx.fillRect(70,215,460,310);ctx.globalAlpha=1;}
    ctx.fillStyle=t.ink;
    text(ctx,'TRÂN TRỌNG KÍNH MỜI',222,{size:12,max:420,weight:600});
    text(ctx,d.groom||'[Tên chú rể]',310,{family:serif,size:49,max:460,min:20});
    text(ctx,'&',365,{family:serif,size:30,color:t.accent});ctx.fillStyle=t.ink;
    text(ctx,d.bride||'[Tên cô dâu]',423,{family:serif,size:49,max:460,min:20});
    ctx.strokeStyle=t.accent;line(ctx,246,454,354,454);
    text(ctx,'ĐẾN DỰ TIỆC CƯỚI VÀ CHUNG VUI CÙNG HAI GIA ĐÌNH',487,{size:10,max:440,weight:400});
    if(d.guest) lines(ctx,d.guest,525,{size:20,width:420,lineHeight:25,maxLines:2});
    text(ctx,dateText(d),587,{family:serif,size:32,max:420});
    text(ctx,d.time ? `ĐÓN KHÁCH LÚC ${d.time.replace(':',' : ')}` : '[Giờ đón khách]',620,{size:12,max:420});
    const end=lines(ctx,d.venue||'[Địa điểm tổ chức]',655,{size:17,width:430,lineHeight:22,maxLines:2});
    lines(ctx,d.address||'[Địa chỉ chi tiết]',end+7,{size:11,width:410,lineHeight:17,maxLines:3});
    return canvas;
  }
  async function loadFonts() {
    await Promise.all([document.fonts.load('500 40px "Playfair Display"','Văn Thắng Ngọc Anh'),document.fonts.load('600 20px "Playfair Display"','Văn Thắng'),document.fonts.load('400 20px "Be Vietnam Pro"','Trân trọng kính mời'),document.fonts.load('600 20px "Be Vietnam Pro"','TRÂN TRỌNG KÍNH MỜI')]);
    await document.fonts.ready;fontsReady=true;
  }
  function notify(value){$('toast').textContent=value;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3500);}
  function renderAll(){if(!fontsReady)return;draw($('heroCanvas'),templates[0],data);document.querySelectorAll('.template canvas').forEach(canvas=>draw(canvas,templates.find(t=>t.id===canvas.dataset.template),data));if($('previewDialog').open)renderPreview();}
  function renderPreview(){draw($('previewCanvas'),selected,data,900);$('previewCanvas').setAttribute('aria-label',`Thiệp ${selected.name}: ${data.groom} và ${data.bride}, ${dateText(data,true)}, ${data.venue||'chưa có địa điểm'}`);$('previewTitle').textContent=`MẪU ${String(templates.indexOf(selected)+1).padStart(2,'0')} / 16`;$('previewCategory').textContent=labels[selected.category]+' · '+selected.label;$('previewName').textContent=selected.name;$('previewDescription').textContent=selected.description;$('messageText').value=message(data);const fields=missing(data);$('completion').textContent=fields.length?'Cần điền trước khi gửi: '+fields.join(', ')+'.':'';$('previewStatus').textContent='';document.querySelector('.manual-copy')?.remove();}
  function openPreview(t){selected=t;renderPreview();$('previewDialog').showModal();$('previewDialog').scrollTop=0;}
  function buildCollection(){
    const fragment=document.createDocumentFragment();
    templates.forEach((t,i)=>{const article=document.createElement('article');article.className='template';article.dataset.category=t.category;const button=document.createElement('button');button.type='button';button.className='template-visual';button.setAttribute('aria-label',`Xem và chọn mẫu ${String(i+1).padStart(2,'0')} — ${t.name}`);const canvas=document.createElement('canvas');canvas.width=600;canvas.height=800;canvas.dataset.template=t.id;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',`Mẫu ${t.name}, ${t.label}`);button.append(canvas);button.addEventListener('click',()=>openPreview(t));const meta=document.createElement('div');meta.className='template-meta';const words=document.createElement('div');const h=document.createElement('h3');h.textContent=t.name;const p=document.createElement('p');p.textContent=t.label;words.append(h,p);const number=document.createElement('span');number.className='template-number';number.textContent=String(i+1).padStart(2,'0');meta.append(words,number);const open=document.createElement('button');open.className='template-open';open.type='button';open.textContent='Xem & chọn mẫu ↗';open.setAttribute('aria-label','Xem và chọn '+t.name);open.addEventListener('click',()=>openPreview(t));article.append(button,meta,open);fragment.append(article);});$('templates').append(fragment);
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
  function guestRoute(){
    if(!location.hash.startsWith('#moi='))return false;
    try{if(location.hash.length>6000)throw Error('Too long');const payload=JSON.parse(decodeURIComponent(location.hash.slice(5)));const t=templates.find(x=>x.id===payload.template);if(!t)throw Error('Template');data=clean(payload.details);selected=t;$('studio').hidden=true;$('guestView').hidden=false;$('guestHeading').textContent=`${data.groom||'[Tên chú rể]'} & ${data.bride||'[Tên cô dâu]'}`;$('guestText').textContent=message(data);$('guestCanvas').setAttribute('aria-label',message(data));document.title=`Thiệp cưới · ${data.groom} & ${data.bride}`;if(data.address){$('guestMap').hidden=false;$('guestMap').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent([data.venue,data.address].filter(Boolean).join(', '));}$('guestDownload').addEventListener('click',()=>download(selected,data,$('guestStatus')));return true;}
    catch{notify('Liên kết thiệp chưa hợp lệ. Bạn có thể chọn lại một mẫu bên dưới.');return false;}
  }
  async function init(){
    const guest=guestRoute();
    if(!guest){try{data=clean(JSON.parse(localStorage.getItem(storageKey)));}catch{data={...defaults};}
      Object.keys(defaults).forEach(key=>$(key).value=data[key]);buildCollection();
      $('inviteForm').addEventListener('input',()=>{const raw=Object.fromEntries(new FormData($('inviteForm')));data=clean(raw);try{localStorage.setItem(storageKey,JSON.stringify(data));$('saveStatus').textContent='Đã lưu trên trình duyệt này.';}catch{$('saveStatus').textContent='Trình duyệt chưa cho lưu. Bạn vẫn có thể chọn mẫu và gửi thiệp trong phiên này.';}clearTimeout(renderTimer);renderTimer=setTimeout(renderAll,100);});
      document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('.template').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});$('collectionCount').textContent=`${count} mẫu thiệp`;}));
      $('closePreview').addEventListener('click',()=>$('previewDialog').close());$('previewDialog').addEventListener('click',event=>{if(event.target!==$('previewDialog'))return;const rect=$('previewDialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)$('previewDialog').close();});
      $('editDetails').addEventListener('click',()=>{$('previewDialog').close();$('thong-tin').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('groom').focus({preventScroll:true});});
      $('copyMessage').addEventListener('click',()=>{if(readyToSend($('previewStatus')))copy(message(data),$('previewStatus'));});$('downloadInvite').addEventListener('click',()=>download(selected,data,$('previewStatus')));
      $('copyInviteLink').addEventListener('click',()=>{if(!readyToSend($('previewStatus')))return;const url=new URL(location.href);url.search='';url.hash='moi='+encodeURIComponent(JSON.stringify({template:selected.id,details:data}));copy(url.href,$('previewStatus'));});
    }
    try{await loadFonts();}catch{notify('Chưa tải đủ font. Hãy tải lại trang để thiệp hiển thị đẹp nhất.');fontsReady=true;}
    if(guest)draw($('guestCanvas'),selected,data,900);else renderAll();
  }
  init();
})();
