// main.js — entry: khởi tạo canvas, letterbox scale-to-fit 1080x1920,
// load asset (manifest rỗng = full graybox), tạo Game, chạy loop (M0 task 3-5).
import { CANVAS_W, CANVAS_H } from './core/constants.js';
import { State } from './core/StateMachine.js';
import { Game } from './core/Game.js';
import { GameLoop } from './core/GameLoop.js';
import { AssetStore } from './render/AssetStore.js';
import { Renderer } from './render/Renderer.js';
import { InputController } from './input/InputController.js';
import { manifest } from '../assets/manifest.js';

const canvas = document.getElementById('game');
canvas.width = CANVAS_W;   // hệ px NỘI BỘ cố định — mọi logic/render dùng hệ này
canvas.height = CANVAS_H;
const ctx = canvas.getContext('2d');

// Letterbox scale-to-fit: canvas giữ tỉ lệ 9:16, căn giữa qua CSS (flex ở index.html)
function fitCanvas() {
  const scale = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H);
  if (!(scale > 0)) return; // viewport chưa có kích thước (0x0) -> chờ resize/observer
  canvas.style.width = `${Math.floor(CANVAS_W * scale)}px`;
  canvas.style.height = `${Math.floor(CANVAS_H * scale)}px`;
}
window.addEventListener('resize', fitCanvas);
// ResizeObserver bắt cả trường hợp viewport đổi size mà không bắn window.resize
// (webview/iframe khởi tạo 0x0 rồi mới được cấp kích thước)
if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(fitCanvas).observe(document.documentElement);
}
fitCanvas();

const store = new AssetStore();
const renderer = new Renderer(ctx, store);
const game = new Game(renderer);
new InputController(canvas, game); // tap/drag (§A6) — tự đăng ký pointer events

// Test nhanh đổi level: ?level=1 -> Chữ U (mặc định 0 -> Thẳng)
const params = new URLSearchParams(window.location.search);
const levelIndex = Number.parseInt(params.get('level') ?? '0', 10) || 0;

(async function boot() {
  await store.loadFromManifest(manifest); // manifest rỗng -> xong ngay (§A2.1)
  game.loadLevel(levelIndex);
  game.sm.set(State.PLAYING);
  new GameLoop(game).start();
})();

// Debug console: window.game.loadLevel(1) để đổi level tại chỗ
window.game = game;
