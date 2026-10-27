document.getElementById('copy').addEventListener('click', async () => {
  const status = document.getElementById('copyStatus');
  try {
    await navigator.clipboard.writeText(document.getElementById('brief').textContent);
    status.textContent = 'Đã sao chép. Bạn có thể dán để hỏi cửa hàng.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('brief'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Đã chọn nội dung. Nhấn Ctrl+C hoặc chạm giữ để sao chép.';
  }
});

const grid = document.getElementById('ringGrid');
const cards = [...grid.querySelectorAll('.card')];
const brand = document.getElementById('ringBrand');
const budget = document.getElementById('ringBudget');
const style = document.getElementById('ringStyle');
const sort = document.getElementById('ringSort');
function filterRings() {
  let visible = 0;
  const ordered = sort.value === 'price'
    ? [...cards].sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price))
    : cards;
  ordered.forEach(card => {
    card.hidden = !((brand.value === 'all' || card.dataset.brand === brand.value)
      && Number(card.dataset.price) <= Number(budget.value)
      && (style.value === 'all' || card.dataset.style === style.value));
    if (!card.hidden) visible++;
    grid.append(card);
  });
  document.getElementById('ringCount').textContent = `Đang xem ${visible} / ${cards.length} mẫu`;
  document.getElementById('ringEmpty').hidden = visible !== 0;
}
[brand, budget, style, sort].forEach(control => control.addEventListener('change', filterRings));
filterRings();
