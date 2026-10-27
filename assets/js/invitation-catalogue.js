/* New collection: eight original illustrated themes, three compositions per theme. */
(() => {
  const themes = [
    {art:'orchid',ink:'#60436b',accent:'#ad8cb6',color:'#72517e',designs:[
      ['lan-tu-ngoc','Lan tử ngọc','formal','scallop','Lan tím · Thẻ viền uốn','Những cánh lan hồ điệp tím ôm lấy thẻ giấy viền uốn, tên viết tay và sắc vàng nhạt.'],
      ['phong-thu-lan-tim','Phong thư lan tím','minimal','envelope','Phong bì tím · Lan hồ điệp','Thư mời màu tím mận, thẻ giấy ngà và dấu sáp vàng giữa những nhành lan nở.'],
      ['vuon-lan-ky-uoc','Vườn lan ký ước','romantic','botanical','Lan màu nước · Giấy ngà','Lan hồ điệp tím vẽ màu nước tràn hai góc, để khoảng giấy ngà cho tên và ngày cưới.']
    ]},
    {art:'apricot',ink:'#81402d',accent:'#bc964a',color:'#9b4933',designs:[
      ['mai-vang-phu-quy','Mai vàng phú quý','formal','gatefold','Cánh thiệp gập · Mai vàng','Mai vàng và hai cánh thiệp mở, viền son và ánh vàng mang không khí lễ cưới Á Đông.'],
      ['lua-mai-ngay-xuan','Lụa mai ngày xuân','minimal','ribbon','Nơ lụa đỏ đất · Hoa mai','Một dải lụa đỏ đất buộc trên thẻ vòm, bên ngoài là mai vàng rực nhẹ trên giấy kem.'],
      ['mai-no-chung-doi','Mai nở chung đôi','romantic','medallion','Dấu ấn tròn · Mai vàng','Huy hiệu tên viết tắt được đặt giữa cành mai mùa xuân, cùng kiểu chữ tên mềm mại.']
    ]},
    {art:'calla',ink:'#284f42',accent:'#9c9f76',color:'#365f4d',designs:[
      ['bach-lien-thanh-ngoc','Bạch liên thanh ngọc','formal','cathedral','Vòm nhọn · Rum trắng','Hoa rum trắng và vòm nhọn hai lớp, kết hợp xanh ngọc trầm với sắc giấy ngà.'],
      ['phong-thu-hoa-rum','Phong thư hoa rum','minimal','envelope','Phong bì ngọc · Rum trắng','Phong thư xanh sâu ôm thẻ rum trắng, dấu sáp champagne và bố cục chữ gọn gàng.'],
      ['rum-trang-loi-thuong','Rum trắng lời thương','romantic','oval','Oval ngọc trai · Hoa rum','Những cánh rum mềm bên ngoài khung oval, điểm một nét xanh thanh mảnh quanh lời mời.']
    ]},
    {art:'wisteria',ink:'#515575',accent:'#9d9abe',color:'#62698f',designs:[
      ['vuon-tu-dang','Vườn tử đằng','formal','garden','Vườn châu Âu · Tử đằng','Hoa tử đằng buông rủ trên lối vườn nhỏ, tên viết tay xanh tím và ngày hẹn ở chính giữa.'],
      ['nhat-ky-tu-dang','Nhật ký tử đằng','minimal','collage','Thẻ xếp lớp · Tử đằng','Những tấm giấy xếp lệch, một góc vườn tử đằng và dấu niêm phong tạo chiều sâu.'],
      ['duoi-tan-hoa-tim','Dưới tán hoa tím','romantic','scallop','Viền uốn · Tán hoa tím','Tấm thiệp cắt viền mềm nằm dưới tán tử đằng, với khoảng giấy trắng tím rất nhẹ.']
    ]},
    {art:'pampas',ink:'#78513b',accent:'#bc9a6e',color:'#a36e4c',designs:[
      ['gam-cat-ban-mai','Gấm cát ban mai','formal','medallion','Boho · Dấu ấn champagne','Cỏ lau, hoa khô và những tông cát ấm bao quanh dấu ấn tròn cùng tên hai bạn.'],
      ['thu-dong-co','Thư đồng cỏ','minimal','ticket','Thẻ vé · Cỏ lau boho','Tấm thẻ có đường xé mảnh và viền cắt tròn, đặt trên nền cỏ lau và lá khô nâu đồng.'],
      ['co-lau-loi-hen','Cỏ lau lời hẹn','romantic','arch','Vòm mềm · Đồng cỏ','Cỏ lau và những chiếc lá lunaria trong suốt nâng đỡ một vòm giấy màu kem ấm.']
    ]},
    {art:'cranes',ink:'#344f47',accent:'#b38c62',color:'#536e5e',designs:[
      ['song-hac-an-nhien','Song hạc an nhiên','formal','gatefold','Song hạc · Thiệp gập','Hạc trắng, cành tùng và nét mây vàng đi cùng hai cánh thiệp mở theo bố cục nghi lễ.'],
      ['dau-an-hac-son','Dấu ấn hạc son','minimal','cathedral','Vòm thanh · Tùng hạc','Một vòm giấy thanh mảnh giữa họa tiết tùng hạc, giữ khoảng thở rộng cho lời mời.'],
      ['hac-trang-to-duyen','Hạc trắng tơ duyên','romantic','botanical','Hạc màu nước · Giấy kem','Đôi hạc trắng và cành hoa đỏ son điểm nhẹ trên giấy kem, như một bức họa mừng duyên.']
    ]},
    {art:'citrus',ink:'#4f674b',accent:'#c4a04b',color:'#5b7450',designs:[
      ['nang-amalfi','Nắng Amalfi','formal','scallop','Chanh Ý · Viền sứ lam','Thẻ viền uốn trong vườn chanh Ý, phối vàng nắng, xanh lá và các góc gạch sứ lam.'],
      ['buu-thiep-vuon-chanh','Bưu thiếp vườn chanh','minimal','ticket','Thẻ vé · Chanh vàng','Bố cục như một tấm vé hẹn ngày vui, với chanh vàng, hoa trắng và điểm sứ xanh.'],
      ['loi-hen-dia-trung-hai','Lời hẹn Địa Trung Hải','romantic','garden','Vườn chanh · Nắng Ý','Hoa chanh trắng và những quả chanh vàng tạo một khung vườn tươi sáng cho tên viết tay.']
    ]},
    {art:'cherry',ink:'#80515d',accent:'#bc9497',color:'#a36f7c',designs:[
      ['anh-dao-hy-nguyet','Anh đào hỷ nguyệt','formal','medallion','Anh đào · Huy hiệu vàng hồng','Nhành anh đào hồng phấn bao quanh huy hiệu tròn, nét chữ tên lớn và ánh vàng hồng.'],
      ['phong-thu-anh-dao','Phong thư anh đào','minimal','envelope','Phong bì hồng · Sakura','Phong thư hồng trà và thẻ giấy trắng ngà, nhấn bằng hoa anh đào cùng dấu niêm phong.'],
      ['sakura-loi-uoc','Sakura lời ước','romantic','heart','Trái tim lụa · Anh đào','Trái tim nét lụa nhẹ và hoa anh đào vẽ tay, dành cho một lời mời ấm áp, dịu dàng.']
    ]}
  ];
  window.InvitationAdditions = themes.flatMap(({designs,...theme}) => designs.map(([id,name,category,layout,label,description])=>({...theme,id,name,category,layout,label,description,script:true})));
})();
