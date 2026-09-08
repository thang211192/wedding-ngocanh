# Lộ trình cưới · Thắng & Ngọc Anh

Trang web tĩnh ghi lại toàn bộ lộ trình tiến tới đám cưới theo **phong tục quê Nam Định**:
dựng rạp làm cỗ tại nhà, hai nhà cùng xóm, bên lương thờ cúng tổ tiên.

Gồm sáu nghi lễ truyền thống, lộ trình chi tiết theo từng tuần, checklist 114 đầu việc,
máy tính cỗ, bảng chi phí theo giá quê, kịch bản hai ngày cưới, kiêng kỵ và thủ tục pháp lý.

Kèm một **trang phụ riêng** — `an-uong.html` — cho phần ngoài lề nhưng dùng nhiều nhất
trong lúc chờ tới ngày cưới: **90 quán ăn ở Hà Nội** chia theo 11 khu vực, có chấm sao,
món ruột, địa chỉ, giờ, giá và mẹo.

## Mở trang

Không cần cài đặt gì. Mở thẳng file `index.html` bằng trình duyệt là chạy được.
Trang ăn uống nằm ở `an-uong.html`, vào được từ menu hoặc từ thẻ dẫn ở cuối trang chính.

Nếu muốn chạy qua server cục bộ:

```bash
python -m http.server 8000
# rồi mở http://localhost:8000
```

## Sửa danh sách quán ăn

`an-uong.html` là **file được sinh ra**, đừng sửa tay. Sửa dữ liệu rồi dựng lại:

```bash
npm install          # lần đầu
npm run build        # tools/data.mjs  ->  an-uong.html
```

Thêm hoặc sửa quán thì vào `tools/data.mjs`. Một quy tắc bắt buộc với trường
`map` (chuỗi tra Google Maps): viết như một cụm **"tên quán + tên phố"**,
**không dùng địa chỉ ngăn bằng dấu phẩy** — có dấu phẩy là Google chuyển sang
chế độ tra địa chỉ và trả về pin "Building" thay vì thẻ quán. Tên phải là tên
Google Maps ghi, không phải tên gọi dân dã. Mở thử chuỗi tra trên Google Maps
trước khi commit.

Nhớ commit cả `tools/data.mjs` lẫn `an-uong.html` — Netlify chỉ copy file tĩnh,
không chạy script build.

## Chạy test

```bash
npm install
npx playwright install chromium   # lần đầu
npm test
```

21 test chạy trên trang đã dựng trong trình duyệt thật: kiểm toàn vẹn dữ liệu
(mỗi thẻ đủ phần, không trùng định danh, không chuỗi tra nào sai dạng), kiểm
hành vi (lọc, tìm không dấu, lưu quán qua reload), và kiểm không tràn ngang ở
375px. Cố ý chỉ có **một seam** — không unit-test nội bộ `app.js`, vì làm vậy
sẽ phải thêm hệ module vào một repo cố tình không có build step cho trang.

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

Trang phụ `an-uong.html`:

| Mục | Nội dung |
|---|---|
| **Danh sách quán** | 90 quán &amp; khu ăn uống Hà Nội theo 11 khu vực, mỗi chỗ có địa chỉ đầy đủ, chỉ dẫn tìm đường và nút mở Google Maps. Có bộ lọc và ô tìm kiếm |
| **Ba nhóm quanh nhà** | `my-dinh` (nhà chú rể) · `khuong-thuong` (nhà cô dâu, 147 P. Khương Thượng) · `giua-duong` (khu Trung Hoà, điểm giữa hai nhà). Xếp lên đầu danh sách và có nền riêng |
| **Cung đường** | 7 buổi hẹn xếp sẵn theo mốc giờ: sáng phố cổ, chiều tối hồ Tây, tối kỷ niệm, hôm nhớ Nhật, ngày mưa đi cả nhà, tối thường ngày gặp giữa đường, cuối tuần ở khu Khương Thượng |
| **Mẹo** | Nên / nên tránh khi đi ăn ở Hà Nội |

## Tính năng

- **Đổi ngày cưới** ở đầu trang → toàn bộ mốc thời gian trong lộ trình tự tính lại, kèm đếm ngược.
- **Máy tính cỗ** — nhập số mâm hai nhà, số người mỗi mâm (mặc định 6 như cỗ quê) và đơn giá;
  tiền cỗ hai bên, tổng số mâm và số khách dự kiến tự tính, đổ thẳng vào bảng chi phí.
- **Checklist** tick tới đâu lưu tới đó, có tiến độ theo nhóm và tiến độ tổng.
- **Bảng chi phí** sửa trực tiếp từng khoản, bỏ tick để loại khỏi tổng, tự tính quỹ dự phòng,
  ước tính tiền mừng bù lại và số tiền thực sự cần chuẩn bị. Có biểu đồ cơ cấu chi phí.
- **Trang ăn uống** (`an-uong.html`) — lọc theo khu vực và theo kiểu (ăn sáng, hẹn hò,
  dịp đặc biệt, Nhật · Hàn, ăn khuya…), tìm kiếm **không cần gõ dấu**, bấm *Muốn đi* để
  lưu quán lại. Mỗi quán ghi rõ chấm sao, món nên gọi, **địa chỉ đầy đủ**, **dòng “Tìm thế nào”**
  (rẽ từ đâu, lấy gì làm mốc, gửi xe chỗ nào), **nút Bản đồ** mở thẳng Google Maps,
  giờ mở, giá và một mẹo riêng.
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
index.html              Lộ trình cưới — toàn bộ nội dung chính (viết tay)
an-uong.html            Trang phụ ăn uống — SINH RA từ tools/, đừng sửa tay
tools/data.mjs          90 quán, 11 khu vực, 7 cung đường
tools/build.mjs         Sinh an-uong.html từ data.mjs
tests/                  Bộ test Playwright chạy trên trang đã dựng
assets/css/style.css    Design tokens, layout, sáng/tối, bản in
assets/js/app.js        Dùng chung cho cả hai trang: tính ngày, checklist, máy tính cỗ,
                        chi phí, lọc quán ăn (vanilla JS, không thư viện)
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
- **26 quán trong ba nhóm quanh nhà** được tìm bằng cách tra Google Maps quanh toạ độ thật của
  hai nhà (147 Khương Thượng = 21.0040,105.8255 · Mỹ Đình = 21.0290,105.7700), rồi mở từng thẻ
  để lấy địa chỉ và điểm đánh giá. Các thẻ này có thêm nhãn vàng ghi điểm Google —
  **đó là dữ liệu đám đông, tách riêng khỏi thang ★ chấm tay của trang này**.
- Nút **Bản đồ** dùng chuỗi tra **không có số nhà** — nếu chuỗi tra chứa số nhà,
  Google chuyển sang chế độ tra địa chỉ và trả về pin "Building" thay vì thẻ quán.
  Chuỗi tra của cả 90 chỗ đã được mở thử trên Google Maps (08/09/2026): 85 chỗ ra đúng
  thẻ quán, 5 chỗ là cả một dãy quán nên ra danh sách quanh đó — các thẻ đó có ghi chú riêng.
  Nếu sau này link nào lệch, sửa chuỗi tra chứ đừng thêm số nhà vào.
- Danh sách quán ăn là **gợi ý cá nhân, không phải bảo chứng**. Quán xá Hà Nội đổi giá,
  đổi giờ, chuyển địa chỉ liên tục — tra lại trên bản đồ và gọi trước khi đi xa hoặc đi đông người.
  Sao chấm theo *độ đáng đi* (ngon, hợp đi hai người, xứng tiền), không phải theo độ nổi tiếng.
- Quy định về đăng ký kết hôn có thể thay đổi — nên hỏi trực tiếp cán bộ tư pháp – hộ tịch
  ở UBND xã hoặc tra trên `dichvucong.gov.vn` trước khi đi làm thủ tục.
