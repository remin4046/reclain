// 리클라인 몬스터 시트 도구 (Node + Playwright)
//  미리보기: node tools/mrbake.js preview <출력.png> 이름1 [이름2 ...]   → 이전 시트(위) vs 새 렌더(아래) 비교 그림
//  시트 굽기: node tools/mrbake.js bake [이름 ...]                       → sprites/monsters/*.png 다시 생성(이름 없으면 HQ 적용된 전체)
//  옵션: --nohq  (HQ 파일 없이 렌더)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const MDIR = path.join(ROOT, 'sprites/monsters');
const man = JSON.parse(fs.readFileSync(path.join(MDIR, 'manifest.json'), 'utf8'));

(async () => {
  const args = process.argv.slice(2), nohq = args.includes('--nohq');
  const pos = args.filter(a => !a.startsWith('--'));
  const cmd = pos.shift();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('페이지 오류:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('콘솔:', m.text()); });
  await page.setContent('<!doctype html><html><body></body></html>');
  if (!nohq) for (const i of [1, 2, 3]) {
    const f = path.join(MDIR, 'hq', `w${i}.js`);
    if (fs.existsSync(f)) await page.addScriptTag({ content: fs.readFileSync(f, 'utf8') + '\n//# sourceURL=w' + i + '.js' });
  }
  await page.addScriptTag({ content: fs.readFileSync(path.join(MDIR, 'mon3d.js'), 'utf8') + "\nMR.SPEC['도펠겡어']=MR.SPEC['도펠갱어'];\nwindow.MR=MR;" });

  const sheetB64 = async (name) => page.evaluate(([name, e]) => {
    const cv = document.createElement('canvas'); cv.width = e.cell * 20; cv.height = e.cell * 8; const c = cv.getContext('2d');
    let clip = 0;
    for (let r = 0; r < 8; r++) for (let col = 0; col < 20; col++) {
      const tmp = document.createElement('canvas'); tmp.width = tmp.height = e.cell; const tc = tmp.getContext('2d');
      MR.render(tc, MR.SPEC[name], MR.ROWS[r], MR.SHEET[col * 2 + 1], MR.SHEET[col * 2], e.footX, e.footY, e.scale, 0);
      const d = tc.getImageData(0, 0, e.cell, e.cell).data, N = e.cell;
      for (let i = 0; i < N; i++) { if (d[(i) * 4 + 3] > 30 || d[((N - 1) * N + i) * 4 + 3] > 30 || d[(i * N) * 4 + 3] > 30 || d[(i * N + N - 1) * 4 + 3] > 30) { clip++; break; } }
      c.drawImage(tmp, col * e.cell, r * e.cell);
    }
    return { url: cv.toDataURL('image/png'), clip };
  }, [name, man.monsters[name]]);

  if (cmd === 'bake') {
    const names = pos.length ? pos : await page.evaluate(() => Object.keys(MR.SPEC).filter(n => MR.SPEC[n].hq));
    for (const n of names) {
      const e = man.monsters[n]; if (!e) { console.log('없음:', n); continue; }
      const { url, clip } = await sheetB64(n);
      fs.writeFileSync(path.join(ROOT, e.file), Buffer.from(url.split(',')[1], 'base64'));
      console.log('굽기', n, '→', e.file, clip ? `(가장자리 닿는 칸 ${clip})` : '');
    }
  } else if (cmd === 'preview') {
    const out = pos.shift(), names = pos;
    const blocks = [];
    for (const n of names) {
      const e = man.monsters[n]; if (!e) { console.log('없음:', n); continue; }
      const now = await sheetB64(n);
      const old = fs.readFileSync(path.join(ROOT, e.file)).toString('base64');
      blocks.push({ n, e, now: now.url, clip: now.clip, old: 'data:image/png;base64,' + old });
    }
    // 비교 그림: 각 몬스터마다 [이전 / 새] × (8방향 대기 + 남쪽 걷기2·공격2·버프2·스킬3)
    const url = await page.evaluate(async (blocks) => {
      const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
      const picks = [];
      for (let r = 0; r < 8; r++) picks.push([r, 0]);
      for (const col of [2, 10, 13, 18]) picks.push([0, col]);
      for (const col of [10, 18]) picks.push([6, col]);
      const Z = 2, W = 96 * picks.length, Hh = blocks.length * (2 * 96 + 24);
      const cv = document.createElement('canvas'); cv.width = W * Z / 2 * 2; cv.height = Hh * Z; const c = cv.getContext('2d'); c.scale(Z, Z);
      c.fillStyle = '#4a5a3a'; c.fillRect(0, 0, W, Hh);
      let y = 0;
      for (const b of blocks) {
        c.fillStyle = '#fff'; c.font = '14px sans-serif'; c.fillText(b.n + (b.clip ? `  ⚠ 칸 가장자리 닿음 ${b.clip}` : ''), 4, y + 16); y += 22;
        for (const [k, src] of [['이전', b.old], ['새', b.now]]) {
          const im = await load(src);
          picks.forEach(([r, col], i) => { const s = b.e.cell; c.drawImage(im, col * s, r * s, s, s, i * 96, y, 96, 96); });
          c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(0, y, 30, 14); c.fillStyle = '#fff'; c.font = '11px sans-serif'; c.fillText(k, 3, y + 11);
          y += 96;
        }
        y += 2;
      }
      return cv.toDataURL('image/png');
    }, blocks);
    fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
    console.log('미리보기 저장:', out);
  } else console.log('사용법: preview <out.png> 이름... | bake [이름...]');
  await browser.close();
})();
