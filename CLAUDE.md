# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.
Instead use:
- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.
Instead use:
- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED
WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.
Instead use:
- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)
Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)
If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)
Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |

---

# Luật riêng dự án BeaverRush

> Nguyên tắc chung (nghĩ trước khi code, đơn giản trước, sửa có phẫu thuật,
> mục tiêu verify được) nằm ở `~/.claude/CLAUDE.md` — áp dụng mọi project.
> Dưới đây chỉ là phần ĐẶC THÙ của repo này.

## Docs đi cùng code (BẮT BUỘC)
Chốt/đổi cơ chế gameplay → cập nhật CẢ 3 tài liệu trong `docs/design/` CÙNG LƯỢT với code:
1. `game-design-document.md` — thêm changelog `vX.Y` (format: amend, "chỗ nào mâu thuẫn bản mới THẮNG") + sửa các câu khẳng định sai trong section liên quan. Mạch version v3.x.
2. `prototype-plan.md` — thêm changelog (mạch v2.x, ĐỘC LẬP với GDD) + sửa số liệu §D1/§D3/§D6; JSON §D8 phải khớp `src/config/levels.js` từng field.
3. `progress-checklist.md` — mục milestone + section "Thiết kế đã chốt" (đánh dấu 🆕 kèm ngày).

## Verify pipeline (loop tới khi pass hết)
1. `node tests/smoke.mjs` pass 100% — cơ chế mới PHẢI kèm assertion mới; test cũ giả định
   "sông sạch" phải tắt schedule obstacle qua helper `noSchedule` (bài học: schedule M4 từng phá ngầm test M2).
2. E2E browser qua preview server (`npx http-server -p 8123`, config `.claude/launch.json`) —
   thay đổi liên quan input phải test bằng PointerEvent THẬT, không gọi tắt hàm.
3. Console browser sạch (không error/warning).

## Kiến trúc & style (port Unity sau này)
- Tách 3 tầng NGHIÊM: `model/` = data thuần (không đụng canvas) · `systems/` = logic ·
  `render/` chỉ ĐỌC model, không ghi. Input ra lệnh qua `world.pendingCommand`.
- MỌI lệnh vẽ đi qua `drawSprite`/`drawTiledSprite` (asset-swap layer) — thêm visual mới
  = thêm key + GRAYBOX fallback, KHÔNG vẽ trực tiếp.
- Comment tiếng Việt, kèm tham chiếu spec (§A4.1, §D6, M3...) như code hiện có.
- Số liệu gameplay = data-driven trong `src/config/levels.js` (per level) hoặc
  `src/core/constants.js` (toàn cục), đánh dấu tunable — KHÔNG hardcode rải trong system.
- State phải reset được qua `loadLevel` (nằm trong `world`, không giữ trong system instance) —
  restart tại chỗ là tính năng cốt lõi.

## Scope prototype (STRICT — theo GDD)
Chỉ block 1x1 + 2 obstacle (đá, gỗ trôi). ĐÃ LOẠI: bom nước, xoáy nước, tool, skill,
economy, size lớn — KHÔNG tự thêm khi chưa được yêu cầu.
