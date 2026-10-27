/* Original wedding stationery artwork, editable type and high-resolution export. */
(() => {
  'use strict';
  const root = new URL('../images/invitations/', document.currentScript.src);
  const images = new Map();
  const specs = [
    {name:'Sen ngọc',label:'Sen màu nước · Giấy kem',art:'lotus',layout:'botanical',ink:'#304f43',accent:'#9b7854',color:'#365c4d',script:true,description:'Sen hồng và lá ngọc vẽ màu nước trên giấy kem. Tên hai bạn viết tay, ngày cưới trình bày như một dấu hẹn.'},
    {name:'Song phụng hỷ sự',label:'Phượng ánh kim · Gấm đỏ',art:'phoenix',layout:'ceremony',ink:'#fff0ca',accent:'#d2ac67',color:'#7b1427',script:false,description:'Đôi phượng ánh kim trên nền gấm đỏ trầm. Bố cục nghi lễ, chữ tên nổi bật, dành cho thiệp trang trọng mang tinh thần Á Đông.'},
    {name:'Lam sứ',label:'Hoa cẩm tú · Sứ xanh',art:'toile',layout:'garden',ink:'#355777',accent:'#7592ac',color:'#355777',script:true,description:'Hoa cẩm tú cầu, nơ lụa và vườn cổ xanh lam như tranh sứ. Một bố cục thanh lịch, nhiều lớp chi tiết.'},
    {name:'Mộc lan hoàng gia',label:'Mộc lan trắng · Xanh ngọc',art:'magnolia',layout:'split',ink:'#2b4a3e',accent:'#a68a55',color:'#244b3c',script:true,description:'Tên hai bạn trên mảng xanh ngọc sâu, bên dưới là mộc lan trắng vẽ tay. Hai nửa màu sắc tạo một bố cục lễ cưới nổi bật.'},
    {name:'Phong thư đỏ rượu',label:'Phong bì · Dấu sáp vàng',art:'rose',layout:'envelope',ink:'#6d3544',accent:'#b79763',color:'#6c2939',script:true,description:'Tấm thiệp giấy kem đặt trong phong bì đỏ rượu, hoa hồng bao quanh và dấu sáp mang tên viết tắt của hai bạn.'},
    {name:'Tơ lụa champagne',label:'Lụa champagne · Hoa vàng',art:'baroque',layout:'ribbon',ink:'#6b5037',accent:'#b39667',color:'#ac8b63',script:true,description:'Thẻ thiệp cắt vòm, nơ lụa champagne và hoa văn ánh vàng. Bố cục nhiều lớp, như một bộ thiệp giấy được chuẩn bị riêng.'},
    {name:'Hồng viên',label:'Hoa hồng · Lụa hồng phấn',art:'rose',layout:'botanical',ink:'#793e4b',accent:'#bd8e88',color:'#9b6672',script:true,description:'Hoa hồng vườn và mẫu đơn nở tràn hai góc, dải lụa hồng mềm và tên viết tay trên nền giấy ngà.'},
    {name:'Vườn mộc lan',label:'Hoa trắng · Vườn xanh',art:'magnolia',layout:'oval',ink:'#36513b',accent:'#96986c',color:'#52674c',script:true,description:'Một khung oval mềm giữa vườn mộc lan và linh lan trắng. Tên và lời mời được ôm trong lớp giấy ngọc trai.'},
    {name:'Hoàng kim',label:'Baroque · Hoa trắng ánh vàng',art:'baroque',layout:'royal',ink:'#70512f',accent:'#aa7c3d',color:'#9b783e',script:true,description:'Khung Baroque mạ vàng, hoa trắng và nền damask kem. Một bộ thiệp cổ điển với chữ viết tay lớn và ngày cưới cân xứng.'},
    {name:'Nơ hồng ký ước',label:'Nơ lụa · Hoa hồng vườn',art:'rose',layout:'ribbon',ink:'#764752',accent:'#b7848a',color:'#a37b86',script:true,description:'Nơ hồng phủ lên thẻ giấy có bóng đổ nhẹ, đặt giữa những cụm hoa màu nước. Dịu dàng và giàu chất liệu.'},
    {name:'Nhật ký hoa sen',label:'Thiệp ghép lớp · Sen ngọc',art:'lotus',layout:'collage',ink:'#3c5b4c',accent:'#a88d63',color:'#6b7e62',script:true,description:'Những thẻ hoa sen xếp lệch, giấy kem và dấu niêm phong. Một lời mời có cảm giác lưu giữ kỷ niệm.'},
    {name:'Dạ tiệc hoàng kim',label:'Baroque · Đỏ nhung',art:'baroque',layout:'velvet',ink:'#f9edd4',accent:'#d0ad72',color:'#642b3b',script:true,description:'Tấm thẻ đỏ nhung trong khung vàng cổ điển, kết hợp hoa trắng và chữ champagne. Nổi bật cho một lời mời dạ tiệc.'},
    {name:'Lời hẹn lam',label:'Giấy sứ · Lụa xanh',art:'toile',layout:'ribbon',ink:'#355675',accent:'#7c9bb5',color:'#6b8ca6',script:true,description:'Giấy trắng ấm, nơ xanh và hoa văn sứ lam. Bố cục thẻ rời hiện đại, bên ngoài là cả một khu vườn nhỏ.'},
    {name:'Sen hồng thiệp ngọc',label:'Hoa sen · Vòm xanh',art:'lotus',layout:'arch',ink:'#3a5b4b',accent:'#a68b64',color:'#55715a',script:true,description:'Lá sen lớn ôm quanh tấm thiệp cắt vòm xanh ngọc. Chữ tên đặt lệch nhẹ, tạo cảm giác mềm mại và trang trọng.'},
    {name:'Lời thương màu đào',label:'Vườn hồng · Thẻ trái tim',art:'rose',layout:'heart',ink:'#794955',accent:'#bd8c84',color:'#9c6570',script:true,description:'Một thẻ thiệp với trái tim nét lụa giữa vườn hồng và mẫu đơn. Tên hai bạn là trung tâm của bố cục.'},
    {name:'Dấu ấn xanh rêu',label:'Phong thư xanh · Mộc lan',art:'magnolia',layout:'envelope',ink:'#41513d',accent:'#b7a573',color:'#4b6048',script:true,description:'Phong bì xanh rêu, thẻ mộc lan trắng và dấu sáp vàng. Gọn gàng ở phần chữ, phong phú ở hoa và chất liệu giấy.'}
  ];
  specs.push(...window.InvitationAdditions);
  const legacy = [
    ['vom-anh-kim','formal'],['do-ruou','formal'],['navy','formal'],['xanh-ngoc','formal'],
    ['trang-den','minimal'],['cat-vang','minimal'],['hong-phan','romantic'],['o-liu','romantic'],
    ['trang-ngoc','formal'],['tim-khoi','romantic'],['dat-nung','minimal'],['den-vang','formal'],
    ['xanh-suong','minimal'],['hoa-moc','romantic'],['hong-dao','romantic'],['xanh-reu','minimal']
  ];
  const loading = new Map();
  function load(keys = [...new Set(specs.map(t=>t.art))]) {
    return Promise.all(keys.map(key=>{
      if(!loading.has(key))loading.set(key,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{images.set(key,img);resolve();};img.onerror=()=>{loading.delete(key);reject(Error('Không tải được họa tiết '+key));};img.src=new URL(key+'-v2.webp',root).href;}));
      return loading.get(key);
    }));
  }
  function getTemplates(){return specs.map((t,i)=>({...t,id:t.id||legacy[i][0],category:t.category||legacy[i][1],isNew:i>=legacy.length}));}
  const SERIF='"Playfair Display"',SCRIPT='"Great Vibes"',SANS='"Be Vietnam Pro"';
  function text(c,value,x,y,size=18,{family=SANS,color,max=430,weight=400,align='center'}={}){
    if(color)c.fillStyle=color;c.textAlign=align;c.textBaseline='alphabetic';c.font=`${weight} ${size}px ${family}`;
    while(c.measureText(value).width>max&&size>9){size-=.5;c.font=`${weight} ${size}px ${family}`;}c.fillText(value,x,y);
  }
  function wrapped(c,value,y,{size=15,width=340,line=22,max=3,color}={}){
    let rows=[];let row='';c.font=`400 ${size}px ${SANS}`;
    for(const word of String(value).split(/\s+/)){const next=row?row+' '+word:word;if(c.measureText(next).width>width&&row){rows.push(row);row=word;}else row=next;}if(row)rows.push(row);
    if(rows.length>max&&size>10)return wrapped(c,value,y,{size:size-1,width,line,max,color});
    rows.forEach((r,i)=>text(c,r,300,y+i*line,size,{color,max:width}));return y+rows.length*line;
  }
  function path(c,fn,width=1){c.beginPath();c.lineWidth=width;fn();c.stroke();}
  function line(c,x,y,x2,y2,width=1){path(c,()=>{c.moveTo(x,y);c.lineTo(x2,y2);},width);}
  function round(c,x,y,w,h,r=8){c.beginPath();c.roundRect(x,y,w,h,r);}
  function art(c,key,{alpha=1,flip=false,x=0,y=0,w=600,h=800}={}){const img=images.get(key);if(!img)return;c.save();c.globalAlpha=alpha;if(flip){c.translate(x+w,y);c.scale(-1,1);c.drawImage(img,0,0,w,h);}else c.drawImage(img,x,y,w,h);c.restore();}
  function grain(c,color){c.save();c.fillStyle=color;c.globalAlpha=.055;for(let i=0;i<450;i++){const x=(i*197.3)%600,y=(i*317.7)%800;c.fillRect(x,y,.7,.7);}c.restore();}
  function foil(c,x,y,r,d,color){
    c.save();c.shadowColor='#39271555';c.shadowBlur=9;c.shadowOffsetY=4;const g=c.createRadialGradient(x-r*.3,y-r*.4,1,x,y,r);g.addColorStop(0,'#f2dda8');g.addColorStop(.6,color);g.addColorStop(.88,'#9c7439');g.addColorStop(1,'#e0c38c');c.fillStyle=g;c.beginPath();for(let i=0;i<64;i++){const a=i*Math.PI/32,rr=r*(1+Math.sin(i*1.8)*.04);const xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr;if(i)c.lineTo(xx,yy);else c.moveTo(xx,yy);}c.closePath();c.fill();c.shadowColor='transparent';c.strokeStyle='#fff1c1';path(c,()=>c.arc(x,y,r*.72,0,Math.PI*2));const initials=[d.groom,d.bride].map(v=>(v.trim().split(/\s+/).pop()||'').slice(0,1)).join('&');text(c,initials,x,y+r*.2,r*.6,{family:SERIF,color:'#805c2f',max:r*1.2});c.restore();
  }
  function flourish(c,y,color){c.strokeStyle=color;path(c,()=>{c.moveTo(225,y);c.bezierCurveTo(255,y,270,y-16,300,y);c.bezierCurveTo(330,y+16,345,y,375,y);});path(c,()=>{c.moveTo(265,y);c.bezierCurveTo(280,y+14,295,y+15,300,y);c.bezierCurveTo(305,y-15,320,y-14,335,y);});}
  function title(c,t,y,value='TRÂN TRỌNG KÍNH MỜI',width=350){text(c,value,300,y,11,{color:t.ink,max:width,weight:600});}
  function names(c,t,d,y,{gap=88,x1=300,x2=300,width=370,size=66}={}){
    const family=t.script?SCRIPT:SERIF;color(c,t.ink);text(c,d.groom||'[Tên chú rể]',x1,y,size,{family,max:width,color:t.ink});text(c,'&',300,y+gap*.48,31,{family:SCRIPT,color:t.accent,max:80});text(c,d.bride||'[Tên cô dâu]',x2,y+gap,size,{family,max:width,color:t.ink});
  }
  function color(c,value){c.fillStyle=value;c.strokeStyle=value;}
  function shortDate(d){if(!d.date)return 'NGÀY · THÁNG · NĂM';const [y,m,day]=d.date.split('-');return `${day}  /  ${m}  /  ${y}`;}
  function dateBlock(c,t,d,y,{width=340,compact=false}={}){
    color(c,t.ink);
    if(d.date&&!compact){const[year,month,day]=d.date.split('-');text(c,day,266,y+17,49,{family:SERIF,color:t.ink,max:100});c.strokeStyle=t.accent;line(c,305,y-24,305,y+20);text(c,'THÁNG '+month,355,y-7,11,{max:100});text(c,year,355,y+16,16,{family:SERIF,max:90});}
    else text(c,shortDate(d),300,y,compact?18:16,{family:SERIF,color:t.ink,max:width});
    text(c,d.time?`ĐÓN KHÁCH LÚC ${d.time.replace(':',' : ')}`:'[Giờ đón khách]',300,y+49,11,{color:t.ink,max:width});
  }
  function details(c,t,d,y,{width=340,guest=true}={}){
    color(c,t.ink);if(guest&&d.guest){y=wrapped(c,d.guest,y,{size:16,width,line:20,max:2,color:t.ink})+8;}
    const end=wrapped(c,d.venue||'[Địa điểm tổ chức]',y,{size:16,width,line:21,max:2,color:t.ink});wrapped(c,d.address||'[Địa chỉ chi tiết]',end+6,{size:11,width,line:16,max:3,color:t.ink});
  }
  function label(c,t,y=730){text(c,'MỘT NGÀY CHUNG ĐÔI · MỘT ĐỜI CÓ NHAU',300,y,8,{max:350,color:t.ink});}
  function envelope(c,t,d){
    art(c,t.art,{alpha:.72});c.fillStyle='#fffaf0';c.globalAlpha=.25;c.fillRect(0,0,600,800);c.globalAlpha=1;
    c.save();c.shadowColor='#362c2936';c.shadowBlur=24;c.shadowOffsetY=12;color(c,t.color);round(c,56,390,488,353,4);c.fill();c.shadowColor='transparent';c.beginPath();c.moveTo(56,400);c.lineTo(300,236);c.lineTo(544,400);c.closePath();c.fill();c.restore();
    c.save();c.shadowColor='#33261f40';c.shadowBlur=16;c.shadowOffsetY=5;color(c,'#fffaf0');round(c,101,67,398,557,3);c.fill();c.restore();
    c.strokeStyle=t.accent;c.strokeRect(115,81,370,520);title(c,t,130);names(c,t,d,216,{gap:77,size:57,width:330});flourish(c,329,t.accent);
    text(c,d.guest||'CÙNG CHUNG VUI VỚI HAI GIA ĐÌNH',300,363,d.guest?16:9,{color:t.ink,max:325});dateBlock(c,t,d,411,{compact:true,width:310});details(c,t,d,488,{width:300,guest:false});
    const g=c.createLinearGradient(0,500,0,750);g.addColorStop(0,t.color);g.addColorStop(1,t.color+'ee');c.fillStyle=g;c.beginPath();c.moveTo(56,423);c.lineTo(300,570);c.lineTo(544,423);c.lineTo(544,743);c.lineTo(56,743);c.closePath();c.fill();
    c.fillStyle=t.color;c.beginPath();c.moveTo(56,743);c.lineTo(300,553);c.lineTo(544,743);c.closePath();c.fill();c.strokeStyle='#ffffff22';line(c,56,743,300,553);line(c,300,553,544,743);foil(c,300,601,34,d,t.accent);text(c,'GỬI MỘT LỜI THƯƠNG',300,702,9,{color:'#fff5df',max:330});
  }
  function ribbon(c,t){
    c.save();c.strokeStyle=t.color;for(let i=0;i<4;i++){c.globalAlpha=.15+i*.13;path(c,()=>{c.moveTo(300,89);c.bezierCurveTo(176,8,164,161,300,89);c.bezierCurveTo(424,8,436,161,300,89);},5-i);}
    c.globalAlpha=.65;path(c,()=>{c.moveTo(300,89);c.bezierCurveTo(260,121,241,149,231,178);c.moveTo(300,89);c.bezierCurveTo(347,141,362,162,369,190);},3);c.restore();
  }
  function draw(canvas,t,d,width=600){
    canvas.width=width;canvas.height=width*4/3;const c=canvas.getContext('2d');c.scale(width/600,width/600);c.fillStyle='#f8f0e3';c.fillRect(0,0,600,800);art(c,t.art);grain(c,t.color);
    if(t.layout==='envelope'){envelope(c,t,d);return canvas;}
    if(t.layout==='scallop'){
      const shape=(inset=0)=>{c.beginPath();c.moveTo(157,109+inset);c.lineTo(443,109+inset);c.quadraticCurveTo(443,157,490-inset,157);c.lineTo(490-inset,643);c.quadraticCurveTo(443,643,443,691-inset);c.lineTo(157,691-inset);c.quadraticCurveTo(157,643,110+inset,643);c.lineTo(110+inset,157);c.quadraticCurveTo(157,157,157,109+inset);c.closePath();};
      c.save();c.shadowColor='#47362738';c.shadowBlur=16;c.shadowOffsetY=5;c.fillStyle='#fffaf1f5';shape();c.fill();c.restore();c.strokeStyle=t.accent;shape(11);c.stroke();title(c,t,211);names(c,t,d,291,{gap:81,size:61,width:319});flourish(c,422,t.accent);dateBlock(c,t,d,486,{compact:true});details(c,t,d,573,{width:299});return canvas;
    }
    if(t.layout==='gatefold'){
      c.save();c.shadowColor='#38291e44';c.shadowBlur=17;c.shadowOffsetY=5;c.fillStyle='#fffaf0';round(c,111,83,378,634,3);c.fill();c.restore();c.strokeStyle=t.accent;c.strokeRect(124,96,352,608);
      for(const side of[-1,1]){c.save();c.translate(side<0?70:530,0);c.transform(1,side*.27,0,1,0,0);c.fillStyle=t.color;c.fillRect(-35,148,70,515);c.strokeStyle=t.accent;c.strokeRect(-28,155,56,500);c.strokeStyle='#fff5d766';line(c,0,183,0,628);c.restore();}
      foil(c,300,139,25,d,t.accent);title(c,t,211);names(c,t,d,293,{gap:84,size:61,width:320});flourish(c,423,t.accent);dateBlock(c,t,d,486,{compact:true});details(c,t,d,574,{width:300});return canvas;
    }
    if(t.layout==='medallion'){
      c.save();c.shadowColor='#392d2230';c.shadowBlur=18;c.fillStyle='#fffaf0f0';round(c,99,75,402,650,15);c.fill();c.restore();c.strokeStyle=t.accent;round(c,112,88,376,624,9);c.stroke();foil(c,300,163,44,d,t.accent);title(c,t,244);names(c,t,d,323,{gap:78,size:63,width:330});flourish(c,447,t.accent);dateBlock(c,t,d,502,{compact:true});details(c,t,d,591,{width:315});return canvas;
    }
    if(t.layout==='cathedral'){
      const shape=(n=0)=>{c.beginPath();c.moveTo(102+n,718-n);c.lineTo(102+n,306);c.bezierCurveTo(102+n,191,215,144,300,75+n);c.bezierCurveTo(385,144,498-n,191,498-n,306);c.lineTo(498-n,718-n);c.closePath();};
      c.save();c.shadowColor='#3b362133';c.shadowBlur=18;c.fillStyle='#fffaf1f2';shape();c.fill();c.restore();c.strokeStyle=t.accent;shape(12);c.stroke();flourish(c,172,t.accent);title(c,t,227);names(c,t,d,307,{gap:84,size:61,width:326});flourish(c,436,t.accent);dateBlock(c,t,d,500,{compact:true});details(c,t,d,588,{width:305});return canvas;
    }
    if(t.layout==='ticket'){
      c.save();c.shadowColor='#47362733';c.shadowBlur=18;c.shadowOffsetY=5;c.fillStyle='#fffaf1f5';round(c,83,104,434,599,7);c.fill();c.restore();c.strokeStyle=t.accent;round(c,96,117,408,573,3);c.stroke();
      c.save();c.setLineDash([3,6]);line(c,100,547,500,547);c.restore();c.fillStyle='#e6d8c1';for(const x of[83,517]){c.beginPath();c.arc(x,547,13,0,Math.PI*2);c.fill();}
      title(c,t,180,'UN JOUR À DEUX · MỘT NGÀY CHUNG ĐÔI');names(c,t,d,277,{gap:83,size:65,width:363});flourish(c,409,t.accent);dateBlock(c,t,d,465,{compact:true});details(c,t,d,585,{width:340});return canvas;
    }
    if(t.layout==='split'){
      const g=c.createLinearGradient(0,0,600,320);g.addColorStop(0,t.color);g.addColorStop(1,'#152f28');c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.lineTo(600,0);c.lineTo(600,330);c.bezierCurveTo(420,310,350,430,300,430);c.bezierCurveTo(250,430,180,310,0,330);c.closePath();c.fill();const top={...t,ink:'#fff5dc',accent:'#c5ad7d'};title(c,top,89,'CÙNG VIẾT TIẾP MỘT CHUYỆN TÌNH');names(c,top,d,177,{gap:87,size:65,width:410});flourish(c,316,top.accent);dateBlock(c,t,d,488);details(c,t,d,589,{width:310});return canvas;
    }
    if(t.layout==='ceremony'){
      title(c,t,174,'HỶ SỰ · TRÂN TRỌNG KÍNH MỜI',330);names(c,t,d,277,{gap:88,size:48,width:330});flourish(c,403,t.accent);text(c,'LỄ THÀNH HÔN',300,442,13,{color:t.ink,max:330});text(c,d.guest||'CHUNG VUI CÙNG HAI GIA ĐÌNH',300,482,d.guest?17:9,{color:t.ink,max:310});dateBlock(c,t,d,546);details(c,t,d,645,{width:310,guest:false});return canvas;
    }
    if(t.layout==='velvet'){
      c.save();c.shadowColor='#33221c55';c.shadowBlur=15;const g=c.createLinearGradient(80,90,520,710);g.addColorStop(0,t.color);g.addColorStop(1,'#3d1929');c.fillStyle=g;round(c,92,97,416,599,[110,110,8,8]);c.fill();c.restore();c.strokeStyle=t.accent;round(c,105,110,390,574,[100,100,3,3]);c.stroke();title(c,t,193);names(c,t,d,281,{gap:90,size:66,width:350});flourish(c,411,t.accent);text(c,d.guest||'CHUNG VUI CÙNG HAI GIA ĐÌNH',300,450,d.guest?17:9,{max:330,color:t.ink});dateBlock(c,t,d,507,{compact:true});details(c,t,d,591,{width:320,guest:false});return canvas;
    }
    if(t.layout==='ribbon'){
      c.save();c.shadowColor='#44302930';c.shadowBlur=15;c.shadowOffsetY=7;c.fillStyle='#fffbf3';round(c,112,111,376,566,[100,100,3,3]);c.fill();c.restore();c.strokeStyle=t.accent;round(c,125,125,350,538,[90,90,2,2]);c.stroke();ribbon(c,t);title(c,t,230);names(c,t,d,302,{gap:72,size:57,width:315});flourish(c,410,t.accent);dateBlock(c,t,d,461,{compact:true});details(c,t,d,d.guest?554:560,{width:300});return canvas;
    }
    if(t.layout==='collage'){
      c.save();c.translate(300,185);c.rotate(-.11);c.shadowColor='#36251a40';c.shadowBlur=15;c.fillStyle='#fffcf5';c.fillRect(-193,-143,386,260);art(c,t.art,{x:-182,y:-132,w:364,h:230});c.restore();
      c.save();c.shadowColor='#32261930';c.shadowBlur=16;c.fillStyle='#fffaf0';round(c,103,227,394,478,4);c.fill();c.restore();foil(c,430,248,31,d,t.accent);title(c,t,290);names(c,t,d,366,{gap:74,size:58,width:335});dateBlock(c,t,d,509,{compact:true});details(c,t,d,597,{width:310});return canvas;
    }
    if(t.layout==='garden'){
      title(c,t,152,'SAVE OUR DATE');names(c,t,d,241,{gap:85,size:65,width:350});flourish(c,366,t.accent);text(c,'TRÂN TRỌNG KÍNH MỜI',300,402,11,{color:t.ink,max:340});text(c,d.guest||'BẠN VÀ GIA ĐÌNH',300,440,17,{color:t.ink,max:330});dateBlock(c,t,d,497,{compact:true});details(c,t,d,578,{width:330,guest:false});return canvas;
    }
    if(['oval','arch','heart'].includes(t.layout)){
      c.save();c.shadowColor='#3f473322';c.shadowBlur=12;const g=c.createLinearGradient(100,100,500,700);g.addColorStop(0,'#fffdf6f7');g.addColorStop(1,'#fff9edf2');c.fillStyle=g;
      if(t.layout==='oval'){c.beginPath();c.ellipse(300,408,199,305,0,0,Math.PI*2);}else round(c,111,105,378,586,[185,185,4,4]);c.fill();c.restore();c.strokeStyle=t.accent;
      if(t.layout==='oval')path(c,()=>c.ellipse(300,408,188,292,0,0,Math.PI*2));else{round(c,123,117,354,562,[173,173,2,2]);c.stroke();}
      if(t.layout==='heart'){path(c,()=>{c.moveTo(300,217);c.bezierCurveTo(230,180,264,148,300,183);c.bezierCurveTo(336,148,370,180,300,217);},1.6);}
      title(c,t,t.layout==='heart'?252:217);names(c,t,d,t.layout==='heart'?321:300,{gap:77,size:59,width:310,x1:t.layout==='arch'?282:300,x2:t.layout==='arch'?317:300});flourish(c,431,t.accent);dateBlock(c,t,d,489,{compact:true});details(c,t,d,575,{width:290});return canvas;
    }
    // Unframed botanical and royal layouts retain the full illustrated perimeter.
    const royal=t.layout==='royal';
    c.save();const veil=c.createRadialGradient(300,410,40,300,410,260);veil.addColorStop(0,'#fffaf099');veil.addColorStop(1,'#fffaf000');c.fillStyle=veil;c.fillRect(100,160,400,550);c.restore();
    if(!royal){c.save();const paper=c.createLinearGradient(0,477,0,744);paper.addColorStop(0,'#fffaf000');paper.addColorStop(.2,'#fffaf0e6');paper.addColorStop(.8,'#fffaf0e6');paper.addColorStop(1,'#fffaf000');c.fillStyle=paper;round(c,128,477,344,267,15);c.fill();c.restore();}
    title(c,t,royal?184:225,royal?'THE WEDDING OF':'TRÂN TRỌNG KÍNH MỜI');names(c,t,d,royal?294:310,{gap:89,size:royal?70:65,width:350});flourish(c,royal?429:445,t.accent);
    text(c,d.guest||'CHUNG VUI CÙNG HAI GIA ĐÌNH',300,royal?471:487,d.guest?17:9,{color:t.ink,max:330});dateBlock(c,t,d,royal?535:551);details(c,t,d,royal?630:647,{width:325,guest:false});
    return canvas;
  }
  window.InvitationArt={load,getTemplates,draw};
})();
