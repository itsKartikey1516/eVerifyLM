# 🚀 Step-by-Step Guide: Pushing eVerify LM to GitHub

This guide covers all steps to push this full-stack project to a new or existing GitHub repository.

---

## 1. Prerequisites
- **Git** installed on your system (`git --version`)
- A **GitHub account** ([github.com](https://github.com))
- Optional: **GitHub CLI** (`gh`) installed

---

## 2. Option A: Using GitHub Web + Git CLI (Recommended)

### Step 1: Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Set **Repository name**: `everify-legal-metrology` (or your preferred name).
3. Set Visibility: **Public** or **Private**.
4. **Do NOT** initialize with a README, .gitignore, or license (we already have them).
5. Click **Create repository**.

### Step 2: Initialize & Commit Locally
In your project terminal root:
```bash
# Initialize local git repository (if not already initialized)
git init

# Set the default branch to main
git branch -M main

# Stage all files
git add .

# Create the initial commit
git commit -m "feat: complete eVerify LM full-stack portal with database schema and docs"
```

### Step 3: Link and Push to Remote
Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub details:

```bash
# Add the remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/everify-legal-metrology.git

# Push to main branch
git push -u origin main
```

*(If prompted, enter your GitHub username and Personal Access Token / PAT)*.

---

## 3. Option B: Using GitHub CLI (`gh`) in 1 Command

If you have GitHub CLI installed and authenticated:
```bash
# Create remote repo and push in one step
gh repo create everify-legal-metrology --public --source=. --remote=origin --push
```

---

## 4. Option C: Using SSH Authentication

If your SSH keys are configured with GitHub:
```bash
git remote add origin git@github.com:YOUR_USERNAME/everify-legal-metrology.git
git branch -M main
git push -u origin main
```

---

## 5. Setting up Environment Variables in GitHub (For CI/CD & Deployments)

1. In your GitHub repository, navigate to **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Add the following secrets:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Public Anonymous Key
   - `VITE_GOOGLE_CLIENT_ID`: (Optional) Google OAuth Client ID

---

## 6. One-Click Deployment to Vercel or Netlify

### Deploying to Vercel:
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository `everify-legal-metrology`.
3. Framework Preset will auto-detect **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Deploying to Netlify:
1. Go to [app.netlify.com](https://app.netlify.com).
2. Click **Add new site** > **Import an existing project** > **GitHub**.
3. Select `everify-legal-metrology`.
4. Build command: `npm run build`, Publish directory: `dist`.
5. Click **Deploy Site**.
