# FOCO — Focus Motif (Web)

FOCO 브랜드 모티프 · 모션 포스터 쇼케이스 정적 사이트.

## Local

```bash
cd website
npx --yes serve .
```

또는 파일을 브라우저로 열기: `index.html`

## GitHub Pages

1. 이 `website` 폴더만 새 저장소로 푸시 (예: `foco-web`)
2. Settings → Pages → Source: **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)`
4. 잠시 후 `https://<username>.github.io/foco-web/`

## Sections

- Hero — FOCO + 8H motif bloom
- System — 1H → 8H motif set
- Motion — poster sequence story + live hover hint
- Product — focus timer UI

## Web intro (AE source of truth)

Site loading intro should match AE comp **`FOCO_INTRO_LOADING`** (1920×1080, 30fps, ~3.5s; 1H bar fill 0→100%). Rebuild/verify: `scripts/build-foco-intro-loading.jsx`, `scripts/verify-foco-intro-loading.jsx`. Do not treat `FOCO_MAIN_MOTION` / `FOCO_MOTION_POSTER` as the web bumper reference.
