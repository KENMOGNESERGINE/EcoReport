# 🌿 EcoReport — Waste Reporting & Recycling Marketplace

[![GitHub](https://img.shields.io/badge/GitHub-EcoReport-green)](https://github.com/KENMOGNESERGINE/EcoReport)
[![Docker](https://img.shields.io/badge/Docker-nkeni%2Fecoreport--backend-blue)](https://hub.docker.com/r/nkeni/ecoreport-backend)

EcoReport is a full-stack mobile platform for waste reporting and recycling in Cameroon. Citizens report waste, associations manage cleanups, and government monitors city-wide statistics.

---

## 🏗️ Architecture

- **Frontend:** React Native (Expo) — role-based navigation for citizen, association, government
- **Backend:** Node.js + Express REST API
- **Database:** PostgreSQL with PostGIS
- **Message Broker:** RabbitMQ (event-driven notifications)
- **Containerization:** Docker + Docker Compose
- **Orchestration:** Kubernetes (9 manifests, HPA, rolling updates)
- **CI/CD:** Jenkins pipeline
- **Monitoring:** Prometheus + Grafana
- **Infrastructure:** DatabaseMart VPS (Ubuntu 22.04, 2 cores, 4GB RAM)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker Desktop
- Git

### 1. Clone the repository
```bash
git clone https://github.com/KENMOGNESERGINE/EcoReport.git
cd EcoReport
```

### 2. Start backend services
```bash
cd backend
cp .env.example .env   # Edit with your values
docker-compose up -d   # Starts PostgreSQL + RabbitMQ
npm install
npm run dev
```

### 3. Start mobile app
```bash
cd mobile
npm install
npx expo start --web   # Press 'w' for browser
```

### 4. Test the API
```bash
curl http://localhost:3000/api/health
```

---

## 🔑 Environment Variables

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wastecycle
DB_USER=postgres
DB_PASSWORD=postgres123
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=30d
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Citizen** | Submit reports, view map, join campaigns, buy/sell in marketplace |
| **Association** | Manage report statuses, create cleanup campaigns |
| **Government** | View all reports, city-wide statistics dashboard |

### Test Accounts
```
Citizen:     citizen@ecoreport.cm  / test1234
Association: assoc@ecoreport.cm    / test1234
Government:  gov@ecoreport.cm      / test1234
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET  | `/api/auth/me` | Get current user profile |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/reports` | Get all reports (paginated) |
| POST | `/api/reports` | Submit a new waste report |
| GET  | `/api/reports/:id` | Get report by ID |
| PATCH | `/api/reports/:id/status` | Update report status (association/gov) |
| GET  | `/api/reports/nearby` | Get nearby reports by coordinates |
| GET  | `/api/reports/stats` | Get report statistics |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/campaigns` | Get all campaigns |
| POST | `/api/campaigns` | Create campaign (association only) |
| POST | `/api/campaigns/:id/join` | Join a campaign |

### Marketplace
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/listings` | Get all listings |
| POST | `/api/listings` | Create a listing |
| POST | `/api/orders` | Place an order |
| GET  | `/api/orders/me` | Get my orders |

---

## 🐳 Docker Deployment

```bash
# Build and push image
docker build -t nkeni/ecoreport-backend:latest ./backend
docker push nkeni/ecoreport-backend:latest

# Run with Docker Compose
docker-compose up -d
```

---

## ☸️ Kubernetes Deployment

```bash
cd k8s
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-configmap.yaml
kubectl apply -f 02-secrets.yaml
kubectl apply -f 03-postgres-pvc.yaml
kubectl apply -f 04-postgres-deployment.yaml
kubectl apply -f 05-rabbitmq-deployment.yaml
kubectl apply -f 06-backend-deployment.yaml
kubectl apply -f 07-ingress.yaml
kubectl apply -f 08-hpa.yaml

# Check status
kubectl get all -n ecoreport
```

---

## 📊 Monitoring

```bash
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3001 (admin / ecoreport2026)
```

---

## 🧪 Testing

```bash
cd backend
npm test                           # Run all tests
npm test -- --coverage --forceExit # With coverage report
```

---

## 📁 Project Structure

```
EcoReport/
├── backend/               # Node.js API
│   ├── src/
│   │   ├── modules/       # Feature modules (auth, reporting, campaigns...)
│   │   ├── middleware/    # Auth, role middleware
│   │   └── shared/        # Database, utilities
│   ├── server.js
│   └── Dockerfile
├── mobile/                # React Native app
│   ├── src/
│   │   ├── features/      # Screens by feature
│   │   ├── navigation/    # Role-based navigation
│   │   └── shared/        # Components, context, services
│   └── App.js
├── k8s/                   # Kubernetes manifests
├── ansible/               # Ansible playbooks
├── monitoring/            # Prometheus + Grafana
├── Jenkinsfile            # CI/CD pipeline
├── nginx.conf             # Reverse proxy config
└── docker-compose.yml
```

---

## 👨‍💻 Team

| Name | Role | Registration |
|------|------|-------------|
| Kenmogne Sergine | Product Owner / Backend Dev |ICTU20233772 |
| Njobe Loveline Nkeni | Scrum Master / Frontend Dev | ICTU20234424 |

---

## 📄 License

MIT License — ICT University Spring 2026