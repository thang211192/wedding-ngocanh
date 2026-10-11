# Lộ trình cưới · Thắng & Ngọc Anh

Trang web tĩnh ghi lại toàn bộ lộ trình tiến tới đám cưới theo **phong tục quê Nam Định**:
dựng rạp làm cỗ tại nhà, hai nhà cùng xóm, bên lương thờ cúng tổ tiên.

Gồm sáu nghi lễ truyền thống, lộ trình chi tiết theo từng tuần, **hướng dẫn cầm tay chỉ việc
131 bước** cho 10 giai đoạn, **24 kịch bản lời nói** cho người ngại ăn nói,
kèm một mục đi hết **buổi sang nhà gái đặt vấn đề** từng bước,
checklist 114 đầu việc, máy tính cỗ, bảng chi phí theo giá quê,
kịch bản hai ngày cưới, kiêng kỵ và thủ tục pháp lý.

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
| **Lộ trình** | 10 giai đoạn, mốc thời gian **tự tính ngược** từ ngày cưới bạn nhập. Mỗi giai đoạn mở ra được **chi tiết từng bước** — tổng 131 bước, mỗi bước ghi rõ ai làm · khi nào · làm thế nào · nói câu gì · xong khi nào · chỗ nào dễ sai |
| **Nghi lễ** | Dạm ngõ · Ăn hỏi · Xin dâu · Vu quy · Tân hôn · Lại mặt, kèm nét riêng đám cưới quê Nam Định |
| **Ăn nói** | Ai nói phần nào ở mỗi lễ, bảng xưng hô theo vai vế, **24 kịch bản lời nói** kèm câu mẫu để đọc to lên mà tập, cách gỡ khi bí. Riêng **buổi sang nhà gái đặt vấn đề** có hướng dẫn cả buổi: chuẩn bị, 20 mốc diễn biến, 18 chủ đề nói chuyện, 22 câu hay bị hỏi, 18 tình huống khi buổi đó không theo kịch bản |
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

Trang phụ `phong-cuoi.html` — bản thiết kế phòng cưới (bỏ vách nhôm kính, chuyển bếp ra ngoài).
Có hai bản chuyển qua lại được: **bản tiết kiệm** (mặc định, khoảng 17,5–32 triệu: giường mới 1m8 có sẵn, kệ TV cũ làm bàn trang điểm, giữ cửa 1, đồ mua sẵn, giữ sàn gạch, chưa đóng trần)
và **bản đầy đủ** (khoảng 89–143 triệu). Mặt bằng, 3D và bảng chi phí đổi theo bản đang chọn (`VARIANTS` trong `room.js`).

| Mục | Nội dung |
|---|---|
| **Mặt bằng** | SVG hiện trạng / sau cải tạo, có chú thích đánh số. Nhập số đo thật (rộng, dài, vị trí vách cũ) là vẽ lại |
| **Phối cảnh 3D** | three.js r128 từ cdnjs. Xoay, phóng to, 5 góc nhìn đặt sẵn, chế độ buổi tối và trang trí ngày cưới. Tường quay về phía mắt nhìn tự mờ đi |
| **Màu &amp; vật liệu** | 3 bảng màu (đổi luôn trên 3D) và bảng vật liệu cho từng bề mặt |
| **Tường &amp; mèo** | Bóc xốp, chặn ẩm, sơn hai tông lau chùi được (dải 90 cm); đầu giường và ghế đổi vải chống mèo cào, cây không độc với mèo, trụ cào, không dùng hoa ly |
| **Thi công · chi phí** | Thứ tự 4 tuần, bảng dự trù tick chọn được, lưu ý kỹ thuật khi bỏ bếp, yêu cầu cho bếp ngoài trời |
| **Thông tin** | Số đo đã nhận (phòng 7,2 × 20 viên gạch 40 cm = 2,88 × 8 m, vách ở viên thứ 10, vị trí 3 cửa, trần 4 m, cửa sổ bồn rửa 80 × 100, điều hoà 9.000 BTU inverter giữ nguyên, cửa 3 và cửa sổ bồn rửa đều mở ra ngoài) — đã đủ để xin báo giá |

Mặt bằng và 3D cùng vẽ từ một hàm `layout()` trong `assets/js/room.js`. Số đo và bảng màu
lưu dưới khoá `wnc:room`. Không có mạng thì phần 3D báo lỗi nhẹ nhàng, mặt bằng vẫn chạy.
Ảnh chụp hiện trạng **không** đưa vào repo vì trang được deploy công khai.

## Tính năng

- **Đổi ngày cưới** ở đầu trang → toàn bộ mốc thời gian trong lộ trình tự tính lại, kèm đếm ngược.
- **Máy tính cỗ** — nhập số mâm hai nhà, số người mỗi mâm (mặc định 6 như cỗ quê) và đơn giá;
  tiền cỗ hai bên, tổng số mâm và số khách dự kiến tự tính, đổ thẳng vào bảng chi phí.
- **Buổi sang nhà đặt vấn đề** (`#dat-van-de`) — buổi mở đường cho cả lộ trình, nên được tách
  riêng và viết kỹ nhất: sáu thẻ chuẩn bị (chọn giờ, quà và những món kiêng, mặc gì, hỏi Ngọc Anh
  trước, thưa bố mẹ mình trước, cách tập nói), dòng thời gian 20 mốc từ ba hôm trước đến tối hôm
  đó, năm cách nói lời đặt vấn đề cho năm hoàn cảnh, 18 chủ đề nói chuyện lúc ngồi uống nước,
  22 câu hai bác hay hỏi kèm câu trả lời mẫu, và 18 tình huống khi buổi đó không theo kịch bản
  (nhà có khách, thiếu một bác, bị ép rượu, bị từ chối thẳng, điện thoại reo giữa chừng…).
  Luật xuyên suốt: **chú rể chỉ xin phép cho người lớn hai bên gặp nhau** — không tự xin cưới,
  không tự chốt ngày, không bàn lễ đen.
- **Kịch bản lời nói** (`#an-noi`) — 24 tình huống chú rể thật sự phải mở miệng, xếp theo
  giai đoạn: thưa bố mẹ, ra mắt nhà gái, hỏi giá đội nấu cỗ, đi mời cưới, chào bàn, khi bị ép
  rượu, lễ lại mặt. Mỗi tình huống có câu mẫu đầy đủ, bản rút gọn, cái cần tránh và cách đáp khi
  bị hỏi lại. Kèm bảng xưng hô theo vai vế và bảng "ở mỗi lễ ai nói phần nào". Từng giai đoạn
  trong Lộ trình có link trỏ thẳng sang đúng nhóm câu mẫu của giai đoạn đó.
- **Chi tiết từng bước** — mỗi giai đoạn trong lộ trình có một khối bấm để mở, bên trong là
  các bước đánh số kèm ô tích và thanh tiến độ riêng. Phần lời thoại mẫu (“Nói thế nào”) có ở
  các bước nghi lễ: thưa chuyện dạm ngõ, xin cưới, xin dâu, đi mời cỗ.
- **Hai bảng tiến độ tách nhau.** Chi tiết từng bước trả lời *làm thế nào* (lưu dưới khoá
  `wnc:steps`); checklist 114 đầu việc trả lời *còn thiếu việc gì* (khoá `wnc:tasks`).
  Tick bên này không ghi đè bên kia.
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
phong-cuoi.html         Trang phụ thiết kế phòng cưới (viết tay)
tools/data.mjs          90 quán, 11 khu vực, 7 cung đường
tools/build.mjs         Sinh an-uong.html từ data.mjs
tests/                  Bộ test Playwright chạy trên trang đã dựng
assets/css/style.css    Design tokens, layout, sáng/tối, bản in
assets/js/app.js        Dùng chung cho cả hai trang: tính ngày, checklist, máy tính cỗ,
                        chi phí, lọc quán ăn (vanilla JS, không thư viện)
assets/js/room.js       Riêng trang phòng cưới: mặt bằng SVG + 3D (three.js)
assets/css/room.css     Riêng trang phòng cưới
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
