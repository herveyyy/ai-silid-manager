# GitHub Actions - Huawei Cloud SWR Deployment

This workflow automatically builds a Docker image for the Silid School Manager (Next.js) and pushes it to Huawei Cloud SWR (Software Repository for Containers).

An optional deploy job SSHes into a VM to pull the new image and restart the container.

## Prerequisites

### 1. Huawei Cloud SWR Setup

Create an organization and repository in the [Huawei Cloud SWR Console](https://console.huaweicloud.com/swr/):

- **Region:** `ap-southeast-2`
- **Organization:** `silid-v3-staging-1`
- **Repository:** `school-monitoring-manager`

### 2. Configure GitHub Secrets & Variables

Go to your repository → **Settings → Secrets and variables → Actions**.

#### Variables (non-sensitive)

| Variable | Description | Example |
|---|---|---|
| `SWR_LOGIN_USER` | SWR login username | `your-huawei-username` |

#### Secrets

| Secret | Description |
|---|---|
| `SWR_LOGIN_PASSWORD` | SWR login password or long-term access key |

#### VM Deployment Secrets (required if deploy job is enabled)

| Secret | Description | Example |
|---|---|---|
| `VM_HOST` | IP or hostname of your VM | `120.0.0.1` |
| `VM_USERNAME` | SSH user on the VM | `root` |
| `VM_SSH_KEY` | Private SSH key for the VM | Contents of `~/.ssh/id_ed25519` |

### 3. VM Setup (one-time)

On your VM, create the runtime environment file:

```bash
nano ~/.env.silid
```

Add your production variables:

```
DATABASE_URL=mysql://user:password@host:3306/silid_school_manager
AUTH_SECRET=your-secret-here
AUTH_URL=http://your-vm-ip:3000
APP_ENV=production
```

Ensure Docker is installed and the VM can pull from Huawei SWR:

```bash
docker login -u ap-southeast-2@YOUR_USER -p YOUR_PASSWORD swr.ap-southeast-2.myhuaweicloud.com
```

## Workflow Triggers

The workflow runs on:

- **Push** to `huawei` branch (builds, pushes, and deploys)
- **Pull request** to `huawei` branch (builds and pushes only, no deploy)
- **Manual trigger** via GitHub Actions UI (`workflow_dispatch`)

## Image Tagging Strategy

Images are tagged with:

- `latest` — always points to the most recent build
- `huawei-<sha>` — Git SHA prefixed with branch name for traceability

## Jobs

### `build-and-push`

1. Checks out the code
2. Logs in to Huawei Cloud SWR
3. Builds the Docker image (multi-stage: Bun for deps/build, Node for runtime)
4. Pushes to SWR with `latest` and SHA-based tags

### `deploy` (currently commented out)

Runs only on push (not PRs). SSHes into the VM and:

1. Pulls the latest image from SWR
2. Stops and removes the old `silid-app` container
3. Starts a new container with `--restart unless-stopped` and `--env-file`
4. Cleans up old images

To enable, uncomment the `deploy` job in `deploy-ecr.yml` and add the VM secrets above.

## Environment Variables

Environment variables are **not baked into the Docker image**. They live on the VM in `~/.env.silid` and are passed to the container at runtime via `--env-file`.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MySQL connection URL |
| `AUTH_SECRET` | Yes | NextAuth session signing secret |
| `AUTH_URL` | Yes | Public URL of the app (e.g. `http://your-vm-ip:3000`) |
| `APP_ENV` | No | `development`, `staging`, or `production` |

To update env vars, edit `~/.env.silid` on the VM and restart the container:

```bash
docker restart silid-app
```

## Manual Deployment

### Trigger via GitHub

1. Go to **Actions** tab in GitHub
2. Select **"Build and Push to Huawei Cloud SWR"**
3. Click **"Run workflow"**
4. Select the branch and click **"Run workflow"**

### Manual deploy on the VM

```bash
IMAGE=swr.ap-southeast-2.myhuaweicloud.com/silid-v3-staging-1/school-monitoring-manager:latest

docker pull $IMAGE
docker stop silid-app || true
docker rm silid-app || true
docker run -d \
  --name silid-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file ~/.env.silid \
  $IMAGE
```

## Local Testing

```bash
# Build the image locally
docker build -t silid-school-manager .

# Run with a local env file
docker run -p 3000:3000 --env-file .env silid-school-manager
```

## Troubleshooting

### SWR Authentication Failed

- Verify `SWR_LOGIN_USER` (variable) and `SWR_LOGIN_PASSWORD` (secret) are set correctly
- Ensure the SWR organization and repository exist in the correct region

### Build Failed

- Check the build logs in GitHub Actions
- Verify `bun.lock` is committed (the Dockerfile uses `--frozen-lockfile`)
- Ensure `output: "standalone"` is set in `next.config.ts`

### Push Failed

- Verify the SWR repository exists and the login user has push permissions
- Check the image name matches `swr.<region>.myhuaweicloud.com/<org>/<repo>`

### Deploy Failed (SSH)

- Verify `VM_HOST`, `VM_USERNAME`, and `VM_SSH_KEY` secrets are correct
- Ensure Docker is running on the VM
- Check that the VM can reach SWR (`docker pull` works)

### Container Crashes on Startup

- Check logs: `docker logs silid-app`
- Verify `~/.env.silid` has all required variables (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`)
- Ensure the MySQL database is accessible from the VM
