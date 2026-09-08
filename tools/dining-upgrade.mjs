// Sources checked 2026-09-08. Budgets are planning estimates, not quotations.
export const NEW_PLACES = [
  { name: 'Gia', area: 'dong-da', kinds: ['hen', 'dip'], dish: 'Thực đơn trải nghiệm món Việt theo mùa', addr: '61 Văn Miếu, Hà Nội', hours: 'Thứ 3–7: 18:00–21:00; thêm trưa thứ 6–7: 11:30–13:30', price: 'Cao cấp · hỏi giá thực đơn khi đặt bàn', find: 'Trên phố Văn Miếu, đối diện khu Văn Miếu – Quốc Tử Giám.', map: 'Gia Restaurant Văn Miếu Hà Nội', tip: 'Hợp một tối kỷ niệm. Báo trước dị ứng và dành trọn buổi tối cho thực đơn trải nghiệm.', recognition: '1 sao MICHELIN', source: 'https://guide.michelin.com/jp/en/ha-noi/ha-noi_2974158/restaurant/gia-1202148' },
  { name: 'Hibana by Koki', area: 'hoan-kiem', kinds: ['nhat', 'hen', 'dip'], dish: 'Teppanyaki Nhật Bản tại quầy bếp', addr: 'Tầng B1, Capella Hanoi, 11 Lê Phụng Hiểu, Hà Nội', hours: 'Thứ 3–7: 11:30–13:30 và 18:00–22:00', price: 'Cao cấp · hỏi giá thực đơn khi đặt bàn', find: 'Vào khách sạn Capella trên phố Lê Phụng Hiểu, nhờ lễ tân chỉ xuống Koki.', map: 'Hibana by Koki Capella Hanoi', tip: 'Chỉ 14 chỗ tại quầy. Đặt trước và hỏi tổng giá gồm đồ uống, thuế, phí phục vụ.', recognition: '1 sao MICHELIN', source: 'https://guide.michelin.com/hk/en/ha-noi/ha-noi_2974158/restaurant/hibana-by-koki' },
  { name: 'Chapter', area: 'hoan-kiem', kinds: ['hen', 'dip'], dish: 'Tasting menu Việt đương đại, bếp than mở', addr: '12C Chân Cầm, Hà Nội', hours: 'Thứ 2–7: 18:00–23:00; nghỉ Chủ nhật', price: 'Cao cấp · hỏi giá thực đơn khi đặt bàn', find: 'Phố Chân Cầm gần Nhà thờ Lớn; tìm mặt tiền các thanh thép màu nâu.', map: 'Chapter Dining Chân Cầm Hà Nội', tip: 'Dành khoảng 3 giờ để ăn thong thả; báo trước chế độ ăn khi đặt bàn.', recognition: 'Trong MICHELIN Guide', source: 'https://guide.michelin.com/sg/en/ha-noi/ha-noi_2974158/restaurant/chapter-1202272' },
  { name: 'Luk Lak', area: 'hoan-kiem', kinds: ['trua', 'hen', 'nha'], dish: 'Món Việt với cách chế biến hiện đại', addr: '4A Lê Thánh Tông, Hà Nội', hours: 'Xác nhận giờ phục vụ với quán trước khi đi', price: 'Dự trù 350–600k / người, tùy món và đồ uống', find: 'Trên phố Lê Thánh Tông, thuận tiện ghép một buổi đi bộ quanh Nhà hát Lớn.', map: 'Luk Lak Lê Thánh Tông Hà Nội', tip: 'Đi hai người nên hỏi khẩu phần trước khi gọi nhiều món; đặt bàn cho tối cuối tuần.', recognition: 'MICHELIN giới thiệu', source: 'https://guide.michelin.com/jp/en/article/dining-out/where-to-eat-the-best-pho-bun-cha-and-noodle-soups-in-hanoi' },
];

export const NEW_ROUTES = [
  { title: 'Một tối ngon quanh Nhà hát Lớn', meta: '3 tiếng · dự trù 900k–1,5 triệu / 2 người', mood: 'Thảnh thơi', steps: [
    { at: '17:30', what: 'Gặp ở Nhà hát Lớn', note: 'Chụp vài tấm ảnh ở quảng trường, rồi dành 20 phút đi bộ tới quán.', map: 'Nhà hát Lớn Hà Nội' },
    { at: '18:00', what: 'Ăn tối tại Luk Lak — 4A Lê Thánh Tông', note: 'Đặt bàn trước. Chọn 2–3 món chia sẻ và hỏi giá đồ uống.', map: 'Luk Lak Lê Thánh Tông Hà Nội' },
    { at: '19:45', what: 'Kem Tràng Tiền rồi dạo Hồ Gươm', note: 'Dành 15–20 phút di chuyển; nếu mưa, kết thúc sau bữa tối.', map: 'Kem Tràng Tiền Hà Nội' },
  ] },
  { title: 'Kỷ niệm bên bếp than Chapter', meta: '4 tiếng · dự trù 5–8 triệu / 2 người · thứ 2–7', mood: 'Kỷ niệm', steps: [
    { at: '17:15', what: 'Hẹn nhau ở Nhà thờ Lớn', note: 'Đi bộ, chụp ảnh rồi tới Chân Cầm; trời mưa thì gặp thẳng ở quán.', map: 'Nhà thờ Lớn Hà Nội' },
    { at: '18:00', what: 'Chapter — 12C Chân Cầm', note: 'Đặt trước, xác nhận giá tasting menu và báo dị ứng. Dành khoảng 3 giờ dùng bữa.', map: 'Chapter Dining Chân Cầm Hà Nội' },
    { at: '21:00', what: 'Đi bộ nhẹ về phía Hồ Gươm', note: 'Không xếp thêm quán để cả hai có thời gian trò chuyện.', map: 'Hồ Hoàn Kiếm Hà Nội' },
  ] },
  { title: 'Món Việt mới, một tối ở Gia', meta: '3,5 tiếng · dự trù 7–10 triệu / 2 người · thứ 3–7', mood: 'Kỷ niệm', steps: [
    { at: '17:30', what: 'Gặp trên phố Văn Miếu', note: 'Dạo phố ngắn trước bữa tối; không cần mua vé vào di tích.', map: 'Văn Miếu Hà Nội' },
    { at: '18:00', what: 'Gia — 61 Văn Miếu', note: 'Chốt bàn, thực đơn và tổng chi phí trước ngày hẹn; để quán biết đây là dịp kỷ niệm.', map: 'Gia Restaurant Văn Miếu Hà Nội' },
    { at: '21:00', what: 'Kết thúc buổi hẹn', note: 'Gọi xe nếu dùng đồ uống có cồn; ngân sách trên chưa gồm xe và quà.' },
  ] },
  { title: 'Một tối Nhật thật đặc biệt', meta: '3,5 tiếng · dự trù 12–20 triệu / 2 người · thứ 3–7', mood: 'Nhớ Nhật', steps: [
    { at: '17:30', what: 'Gặp tại Capella Hanoi — 11 Lê Phụng Hiểu', note: 'Tới sớm 30 phút, xác nhận vị trí quầy và giờ bắt đầu.', map: 'Capella Hanoi' },
    { at: '18:00', what: 'Hibana by Koki', note: 'Chỉ đi khi đã xác nhận bàn và giá thực đơn. Hỏi thêm đồ uống, thuế và phí phục vụ.', map: 'Hibana by Koki Capella Hanoi' },
    { at: '21:00', what: 'Dạo phố Lê Phụng Hiểu rồi về', note: 'Nếu trời mưa, chờ xe trong sảnh khách sạn.' },
  ] },
];
