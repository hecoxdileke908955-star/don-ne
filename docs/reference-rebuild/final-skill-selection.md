# Final Skill Selection — Round 2 Verification

> Phương pháp: kiểm tra trực tiếp filesystem thật của Claude Code trên máy (`~/.claude/plugins/cache`, `~/.claude/plugins/marketplaces`, `~/.agents/skills`), không giả định. Đối chiếu với danh sách skill mà harness thực sự công bố khả dụng cho phiên này (system-reminder "available skills", nguồn cấu hình thật của harness — không phải suy đoán).

## Vị trí thực tế đã kiểm tra

- `~/.agents/skills/` → 2 skill: `commit-archaeologist`, `scope-creep-detector` (không liên quan).
- `~/.claude/plugins/cache/claude-plugins-official/superpowers/6.1.1/skills/` → 14 skill thật (đã đọc trực tiếp `SKILL.md` của các skill liên quan).
- `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/` → danh mục plugin đầy đủ (bao gồm `code-review`, `security-guidance`, `frontend-design`, `pr-review-toolkit`...) — đây là catalog plugin, không phải mọi plugin đều "khả dụng để invoke" trong phiên này.
- Một số skill trong danh sách "available skills" của harness (`run`, `security-review`) **không tìm thấy file `SKILL.md` thô tương ứng** qua tìm kiếm filesystem trực tiếp trong `~/.claude/plugins/` — đây có thể là skill lõi (built-in) của harness không biểu diễn dưới dạng file plugin thông thường. Ghi nhận trung thực: xác nhận tồn tại qua chính danh sách skill mà harness công bố (nguồn cấu hình thật), không qua file thô.

| Skill | Path | Purpose | Evidence từ SKILL.md | USE/SKIP | Why | Order |
|---|---|---|---|---|---|---|
| `systematic-debugging` | `superpowers/6.1.1/skills/systematic-debugging/SKILL.md` | "Use when encountering any bug... before proposing fixes"; Iron Law: "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST" | Đọc trực tiếp: yêu cầu Phase 1 root-cause trước khi sửa | **USE** | Đúng tinh thần Phase 20 "chỉ sửa sau khi có evidence" | 1 (trong suốt Phase 3-19) |
| `verification-before-completion` | `superpowers/6.1.1/skills/verification-before-completion/SKILL.md` | "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE" | Đọc trực tiếp: gate function bắt buộc chạy lệnh thật trước khi tuyên bố | **USE** | Chi phối toàn bộ cách viết Phase 21-24 (build/test phải chạy thật, không suy đoán) | 2 (xuyên suốt) |
| `requesting-code-review` | `superpowers/6.1.1/skills/requesting-code-review/SKILL.md` | Dispatch subagent reviewer độc lập với `BASE_SHA`/`HEAD_SHA` | Đọc trực tiếp: quy trình dùng git SHA giữa 2 commit | **SKIP (áp dụng tinh thần, không dispatch subagent riêng)** | Repo không có commit boundary mới (toàn bộ là uncommitted diff từ 1 baseline) — dùng `git diff` trực tiếp thay vì SHA range; dispatch subagent riêng sẽ mất context đã có sẵn về yêu cầu gốc mà không có lợi ích tương xứng | — |
| `code-review` (top-level plugin) | `plugins/marketplaces/.../plugins/code-review/commands/code-review.md` | Review diff hiện tại tìm bug/simplification | Xác nhận tồn tại qua danh sách skill khả dụng của harness | **USE** | Áp dụng trực tiếp cho Phase 18, review toàn bộ diff chưa commit | 3 |
| `run` | (built-in, không thấy SKILL.md thô) | Launch app, screenshot để xác nhận thay đổi hoạt động thật | Xác nhận tồn tại qua danh sách skill harness | **SKIP (đã tự thực hiện tương đương)** | Đã tự dựng disposable PostgreSQL + `next start` + Playwright screenshot thật ở lượt trước và lượt này — đạt cùng mục tiêu bằng chứng thực tế, không cần gọi lại qua skill generic | — |
| `security-review` | (built-in, không thấy SKILL.md thô) | Review bảo mật cho pending changes | Xác nhận tồn tại qua danh sách skill harness | **SKIP (regression check thủ công đủ)** | `git diff --name-status` xác nhận 100% file thay đổi là public frontend (Header/Footer/page/[slug]/dich-vu/ProcessSection/BeforeAfterSlider/next.config.js) — **0 file admin/API/auth/CSRF/RBAC** bị đụng tới. Rủi ro bảo mật gần như bằng 0 theo blast radius; verify bằng grep + test thay vì invoke toàn bộ skill | — |

## Kết luận
Skill thực sự dùng: **`systematic-debugging`** (nguyên tắc điều tra trước khi sửa, áp dụng Phase 3-19), **`verification-before-completion`** (nguyên tắc bằng chứng trước tuyên bố, áp dụng Phase 21-24), **`code-review`** (áp dụng Phase 18). Không cài/update skill mới nào.
