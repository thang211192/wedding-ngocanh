# Lộ trình cưới · Thắng & Ngọc Anh

Trang web tĩnh ghi lại toàn bộ lộ trình tiến tới đám cưới theo **phong tục cưới miền Bắc**:
sáu nghi lễ truyền thống, lộ trình chi tiết theo từng tuần, checklist 100 đầu việc,
bảng chi phí tự tính, kịch bản ngày cưới theo giờ, kiêng kỵ và thủ tục pháp lý.

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
| **Tổng quan** | Bốn quyết định gốc phải chốt trước tiên: thời điểm, quy mô, ngân sách, nơi ở sau cưới |
| **Lộ trình** | 10 giai đoạn, mốc thời gian **tự tính ngược** từ ngày cưới bạn nhập |
| **Nghi lễ** | Dạm ngõ · Ăn hỏi · Xin dâu · Vu quy · Tân hôn · Lại mặt, kèm bảng so sánh Bắc – Nam |
| **Tráp ăn hỏi** | Bộ chọn 3/5/7/9/11 tráp, nội dung từng tráp, cách bàn chuyện lễ đen |
| **Chuẩn bị** | Checklist 100 đầu việc chia 8 nhóm, có thanh tiến độ |
| **Chi phí** | 34 khoản mục, 3 mức (Tiết kiệm / Phổ thông / Cao cấp), sửa được từng con số |
| **Ngày cưới** | Kịch bản theo giờ từ 05:30 đến 14:00, túi khẩn cấp, bảng phân công |
| **Kiêng kỵ** | Nên làm / nên kiêng theo tục miền Bắc |
| **Pháp lý** | Đăng ký kết hôn, khám sức khoẻ tiền hôn nhân, giấy tờ sau cưới |

## Tính năng

- **Đổi ngày cưới** ở đầu trang → toàn bộ mốc thời gian trong lộ trình tự tính lại, kèm đếm ngược.
- **Checklist** tick tới đâu lưu tới đó, có tiến độ theo nhóm và tiến độ tổng.
- **Bảng chi phí** sửa trực tiếp từng khoản, bỏ tick để loại khỏi tổng, tự tính quỹ dự phòng,
  ước tính tiền mừng bù lại và số tiền thực sự cần chuẩn bị. Có biểu đồ cơ cấu chi phí.
- **Giao diện sáng / tối**, cả hai đều đạt tương phản WCAG AA (≥ 4,5:1).
- **In / Lưu PDF** — có stylesheet riêng cho bản in.
- Đọc tốt trên điện thoại từ 375px trở lên.

Dữ liệu được lưu bằng `localStorage` **ngay trên trình duyệt của bạn**, không gửi đi đâu cả.
Xoá dữ liệu bằng nút ở cuối trang.

## Cấu trúc

```
index.html              Toàn bộ nội dung
assets/css/style.css    Design tokens, layout, sáng/tối, bản in
assets/js/app.js        Tính ngày, checklist, máy tính chi phí (vanilla JS, không thư viện)
docs/                   Ghi chép cá nhân
```

Trang không dùng framework hay thư viện JavaScript nào. Font tải từ Google Fonts
(Playfair Display + Be Vietnam Pro — cả hai đều có đủ bộ dấu tiếng Việt).

## Lưu ý về nội dung

- Phong tục cưới miền Bắc **khác nhau theo từng tỉnh, từng làng, từng dòng họ**.
  Nội dung ở đây là phần phổ biến nhất — nên hỏi lại các cụ trong nhà rồi điều chỉnh.
- Các con số chi phí là **ước tính tham khảo** theo mặt bằng Hà Nội / miền Bắc,
  dùng để hình dung quy mô ngân sách chứ không phải báo giá.
- Quy định về đăng ký kết hôn có thể thay đổi — nên xác nhận lại với UBND phường/xã
  nơi cư trú hoặc tra trên `dichvucong.gov.vn` trước khi đi làm thủ tục.
