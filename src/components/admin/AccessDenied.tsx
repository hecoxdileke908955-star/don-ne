export function AccessDenied() {
  return (
    <div className="rounded-card border border-dashed border-gray-200 bg-white p-10 text-center">
      <p className="text-sm font-semibold text-text-main">Bạn không có quyền truy cập mục này.</p>
      <p className="mt-1 text-xs text-text-muted">Liên hệ quản trị viên nếu bạn cần quyền truy cập.</p>
    </div>
  );
}
