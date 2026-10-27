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
