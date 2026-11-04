# wedding-ngocanh

Trang tĩnh ghi lộ trình cưới Thắng & Ngọc Anh (`index.html`), kèm hai trang phụ
"Ăn gì ở Hà Nội" (`an-uong.html`) và "Phòng cưới" (`phong-cuoi.html`). Không framework, không build step —
chỉ HTML + CSS + JavaScript thuần, mở thẳng bằng trình duyệt là chạy.

## Agent skills

### Issue tracker

Issue nằm ở GitHub Issues của chính repo này, thao tác qua `gh` CLI.
See `docs/agents/issue-tracker.md`.

### Triage labels

Giữ nguyên năm nhãn chuẩn: `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` và `docs/adr/` đặt ở gốc repo.
See `docs/agents/domain.md`.

## Deployment

- Cloudflare và các static host chỉ được publish thư mục `_site`.
- Mỗi khi sửa hoặc thêm trang HTML, chạy `npm run build` và xác nhận trang có trong `_site`.
- `tools/prepare-deploy.mjs` tự động chép mọi file `.html` ở thư mục gốc vào `_site`; không đặt HTML riêng tư ở thư mục gốc.
- Không publish trực tiếp gốc repository vì `docs/` chứa nội dung cá nhân.
