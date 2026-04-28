# PPC Deployment Guide: Ubuntu VPS

Follow these instructions to deploy the Preprint Commons (PPC) platform on an Ubuntu server.

## 1. Prerequisites
Install the core system dependencies:
```bash
sudo apt update
sudo apt install -y python3-pip python3-venv nginx certbot python3-certbot-nginx nodejs npm
```

## 2. Backend Setup (FastAPI)
1. **Prepare Directory:**
   Place the project files in `/home/ubuntu/ppc-backend`.
2. **Database:**
   Transfer the `ppc.db` file to the root directory of the project (`/home/ubuntu/ppc-backend/ppc.db`).
3. **Environment:**
   ```bash
   cd /home/ubuntu/ppc-backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. **Configuration:**
   Create a `.env` file in the root directory:
   ```env
   ENVIRONMENT=production
   DEBUG=False
   DATABASE_NAME=ppc.db
   DATABASE_URL=sqlite:///./ppc.db
   API_HOST=0.0.0.0
   API_PORT=8000
   ALLOWED_ORIGINS=["https://your-domain.com"]
   ```

## 3. Frontend Setup (React)
1. **Build:**
   ```bash
   cd /home/ubuntu/ppc-backend/frontend
   npm install
   npm run build
   ```
2. **Deploy Files:**
   Move the build artifacts to the web root:
   ```bash
   sudo cp -r dist/* /var/www/html/
   ```

## 4. Systemd Service (Process Management)
Create a service file at `/etc/systemd/system/ppc.service`:
```ini
[Unit]
Description=Gunicorn instance to serve PPC Backend
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/ppc-backend
Environment="PATH=/home/ubuntu/ppc-backend/venv/bin"
ExecStart=/home/ubuntu/ppc-backend/venv/bin/gunicorn \
    -w 4 \
    -k uvicorn.workers.UvicornWorker \
    app.main:app \
    --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```
**Enable and start:**
```bash
sudo systemctl enable ppc
sudo systemctl start ppc
```

## 5. Nginx Configuration
Create a config file at `/etc/nginx/sites-available/ppc`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
**Enable site and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/ppc /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

## 6. SSL Configuration
Secure the domain using Certbot:
```bash
sudo certbot --nginx -d your-domain.com
```
