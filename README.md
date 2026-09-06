# Lộ trình cưới · Thắng & Ngọc Anh

Trang web tĩnh ghi lại toàn bộ lộ trình tiến tới đám cưới theo **phong tục quê Nam Định**:
dựng rạp làm cỗ tại nhà, hai nhà cùng xóm, bên lương thờ cúng tổ tiên.

Gồm sáu nghi lễ truyền thống, lộ trình chi tiết theo từng tuần, checklist 114 đầu việc,
máy tính cỗ, bảng chi phí theo giá quê, kịch bản hai ngày cưới, kiêng kỵ và thủ tục pháp lý.

## Mở trang

Không cần cài đặt gì. Mở thẳng file `index.html` bằng trình duyệt là chạy được.

Nếu muốn chạy qua server cục bộ:

```bash
python -m http.server 8000
# rồi mở http://localhost:8000
```

## Nội dung

| Mục | Nội dung |
|---|---|
| **Tổng quan** | Bốn quyết định gốc; lợi thế và điểm cần để ý khi hai nhà cùng quê, cùng xóm |
| **Lộ trình** | 10 giai đoạn, mốc thời gian **tự tính ngược** từ ngày cưới bạn nhập |
| **Nghi lễ** | Dạm ngõ · Ăn hỏi · Xin dâu · Vu quy · Tân hôn · Lại mặt, kèm nét riêng đám cưới quê Nam Định |
| **Tráp ăn hỏi** | Bộ chọn 3/5/7/9/11 tráp, nội dung từng tráp, cách bàn chuyện lễ đen |
| **Chuẩn bị** | Checklist 114 đầu việc chia 8 nhóm, có thanh tiến độ |
| **Chi phí** | Máy tính cỗ + 37 khoản mục, 3 mức, sửa được từng con số |
| **Ngày cưới** | Kịch bản **hai ngày**: hôm trước dựng rạp, hôm sau rước dâu và cỗ cưới |
| **Kiêng kỵ** | Nên làm / nên kiêng, và năm câu nên hỏi các cụ trước khi làm |
| **Pháp lý** | Đăng ký kết hôn tại UBND xã, khám sức khoẻ tiền hôn nhân, giấy tờ sau cưới |

## Tính năng

- **Đổi ngày cưới** ở đầu trang → toàn bộ mốc thời gian trong lộ trình tự tính lại, kèm đếm ngược.
- **Máy tính cỗ** — nhập số mâm hai nhà, số người mỗi mâm (mặc định 6 như cỗ quê) và đơn giá;
  tiền cỗ hai bên, tổng số mâm và số khách dự kiến tự tính, đổ thẳng vào bảng chi phí.
- **Checklist** tick tới đâu lưu tới đó, có tiến độ theo nhóm và tiến độ tổng.
- **Bảng chi phí** sửa trực tiếp từng khoản, bỏ tick để loại khỏi tổng, tự tính quỹ dự phòng,
  ước tính tiền mừng bù lại và số tiền thực sự cần chuẩn bị. Có biểu đồ cơ cấu chi phí.
- **Giao diện sáng / tối**, cả hai đều đạt tương phản WCAG AA (≥ 4,5:1).
- **In / Lưu PDF** — có stylesheet riêng cho bản in.
- Đọc tốt trên điện thoại từ 375px trở lên; nội dung vẫn hiển thị đầy đủ khi JS bị chặn.

Dữ liệu được lưu bằng `localStorage` **ngay trên trình duyệt của bạn**, không gửi đi đâu cả.
Xoá dữ liệu bằng nút ở cuối trang.

## Bối cảnh đã dùng để viết nội dung

- Hai bên **cùng quê Nam Định, cùng xóm** → rước dâu vài bước chân, chung một nếp tục lệ,
  nhưng phải để ý chuyện danh sách khách trùng nhau và chia giờ mời cỗ giữa hai nhà.
- **Bên lương**, thờ cúng tổ tiên (không có phần lễ nhà thờ).
- **Dựng rạp làm cỗ tại nhà**, mâm 6 người — nên có thêm phần rạp, đội nấu cỗ, mượn đồ của xóm
  và cỗ tối hôm dựng rạp, những khoản không có trong đám cưới tổ chức ở nhà hàng.

## Cấu trúc

```
index.html              Toàn bộ nội dung
assets/css/style.css    Design tokens, layout, sáng/tối, bản in
assets/js/app.js        Tính ngày, checklist, máy tính cỗ, chi phí (vanilla JS, không thư viện)
docs/                   Ghi chép cá nhân
```

Trang không dùng framework hay thư viện JavaScript nào. Font tải từ Google Fonts
(Playfair Display + Be Vietnam Pro — cả hai đều có đủ bộ dấu tiếng Việt).

## Lưu ý về nội dung

- Phong tục cưới ở Nam Định **khác nhau theo từng huyện, từng làng, thậm chí từng dòng họ**.
  Nội dung ở đây là phần phổ biến nhất — nên hỏi lại các cụ trong nhà rồi điều chỉnh.
  Mục "Kiêng kỵ" có sẵn năm câu nên hỏi.
- Các con số chi phí là **ước tính tham khảo** theo mặt bằng cỗ quê Nam Định,
  dùng để hình dung quy mô ngân sách chứ không phải báo giá. Nên hỏi giá thật của
  2–3 đội nấu cỗ trong vùng rồi thay vào.
- Quy định về đăng ký kết hôn có thể thay đổi — nên hỏi trực tiếp cán bộ tư pháp – hộ tịch
  ở UBND xã hoặc tra trên `dichvucong.gov.vn` trước khi đi làm thủ tục.
