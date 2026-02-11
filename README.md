# Website Preview & Deployment

## 1) Test locally before deploying

Run a local static server:

```bash
./preview.sh
```

Open:

- Main site: [http://localhost:4173/index.html](http://localhost:4173/index.html)
- Terms route: [http://localhost:4173/terms](http://localhost:4173/terms)

Quick health checks:

```bash
curl -I http://localhost:4173/index.html
curl -I http://localhost:4173/terms
curl -I http://localhost:4173/terms/
```

## 2) Push this project to GitHub

If this repo is not already connected to GitHub:

```bash
git init
git add .
git commit -m "Initial site ready for deploy"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

If it is already connected:

```bash
git add .
git commit -m "Prepare project for Vercel deployment"
git push
```

## 3) Deploy on Vercel (free)

### Option A: Vercel dashboard (easiest)
1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project**.
3. Import your GitHub repo.
4. Framework Preset: **Other**.
5. Build Command: **(leave empty)**.
6. Output Directory: **(leave empty)**.
7. Install Command: **(leave empty)**.
8. Click **Deploy**.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

When prompted:
- Set up and deploy: **Yes**
- Link to existing project: choose as needed
- Build command: **none**
- Output directory: **none**

## 4) Build/output settings (correct for this project)

This is a static HTML/CSS/JS site, so Vercel serves files directly:

- Framework Preset: `Other`
- Build Command: *(none)*
- Output Directory: *(none)*
- Install Command: *(none)*

`vercel.json` is included to keep clean URLs and route `/terms` to `/terms/` correctly.

