Here's your full presentation script:

---

## 🎤 PRESENTATION SCRIPT — EcoReport (10 minutes)

---

### INTRO (30 seconds) — Both on camera

> "Good morning/afternoon. We are presenting **EcoReport** — a waste reporting and recycling marketplace platform built for Cameroon. I am **[Your Name]** and my teammate is **[Sergine's Name]**. Our project solves the problem of unmanaged waste in Cameroonian cities by connecting citizens, environmental associations, and government authorities on a single mobile platform."

---

### PART 1 — ARCHITECTURE (You present — 2 minutes)

> "EcoReport follows an **event-driven microservices architecture** built on a **layered design pattern** with **role-based access control**."

Show the architecture diagram from the Word doc, then say:

> "Our system has three main layers:
> - The **presentation layer** — a React Native mobile app built with Expo
> - The **business logic layer** — a Node.js Express REST API
> - The **data layer** — PostgreSQL with PostGIS for geolocation, and RabbitMQ as our **message broker** for event-driven notifications
>
> We chose this architecture because it gives us **scalability, loose coupling, and real-time event processing**. When a citizen submits a report, RabbitMQ publishes a `report.submitted` event, which triggers notifications to associations.
>
> Our API follows **RESTful principles** with JWT authentication and **middleware-based authorization** for three roles — citizen, association, and government."

---

### PART 2 — INFRASTRUCTURE (You present — 2 minutes)

Open the VPS terminal and show:

```bash
docker ps
```

> "Our application is deployed on a **Virtual Private Server** provisioned on DatabaseMart — 2 CPU cores, 4GB RAM, 60GB SSD running Ubuntu 22.04. We use **Docker** for containerization with three containers — PostgreSQL, RabbitMQ, and our Node.js backend."

Show the health endpoint in browser:
```
http://93.127.139.4:10051/api/health
```

> "Our API is publicly accessible at this endpoint. The response confirms the server is live in production."

Then show Kubernetes:
```bash
kubectl get all -n ecoreport
kubectl get hpa -n ecoreport
```

> "We also deployed to **Kubernetes** locally using Docker Desktop. We have 9 Kubernetes manifest files including a **Horizontal Pod Autoscaler** that scales our backend from 2 to 5 replicas based on CPU usage — this ensures **high availability and fault tolerance**. We implemented **rolling updates** so the app stays live during deployments."

Show GitHub:
> "All our **Infrastructure as Code** is on GitHub — Kubernetes YAMLs, an **Ansible** playbook for automated server provisioning, a **Jenkinsfile** for our CI/CD pipeline that automates build, test, Docker image push, and Kubernetes deployment."

---

### PART 3 — APPLICATION DEMO — Reporting (Sergine presents — 3 minutes)

Login as citizen:
> "I'm logging in as a **citizen**. The app detects my role and shows the citizen navigation — Reports, Map, Campaigns, Rewards, Marketplace and Sell tabs."

Submit a report:
> "I'll submit a waste report. I take a photo, the app captures my **GPS coordinates** using the device location API, I add a title and description, select the waste type, and submit. The report is saved to PostgreSQL and a **RabbitMQ event** is published to notify associations."

Show report list:
> "The report appears in the list with its status as **pending**."

Show map:
> "The **map view** shows all reports as markers based on their GPS coordinates."

Login as association:
> "Now logging in as the **Green Cameroon association**. The role-based navigation switches to the association dashboard showing pending reports, resolved counts, and quick actions."

Update report status:
> "I can see all citizen reports and update their status — from **pending** to **in progress** to **resolved**. This is how associations manage cleanup operations."

Create campaign:
> "I can also create a **cleanup campaign** — add a title, description, location and date. Once created, all citizens are notified through our event-driven notification system."

---

### PART 4 — APPLICATION DEMO — Marketplace (You present — 2 minutes)

Login as citizen again:
> "Back as a citizen, I navigate to the **Recycling Marketplace** — our innovation feature. Citizens can buy and sell recycled materials, reducing waste and creating economic value."

Show marketplace:
> "The marketplace shows all available listings with photos, prices and conditions."

Create listing:
> "I can create a new listing — upload a photo, set a title, description, price, category and condition. This is our **circular economy** feature unique to EcoReport."

Show government dashboard:
> "Logging in as the **CUY government official** — they see a dashboard with city-wide statistics, total reports, resolution rates, and can access all reports for oversight."

---

### PART 5 — INNOVATION & CHAOS ENGINEERING (30 seconds)

> "Our innovation includes:
> - **GPS-based waste reporting** with photo capture
> - **Recycling marketplace** for circular economy
> - **Gamification** with reward points for citizens
> - **Role-based multi-actor** system connecting citizens, NGOs and government
> - **AI-assisted development** using Claude AI for code generation"

If teacher does chaos engineering — kill a pod:
```bash
kubectl delete pod -n ecoreport -l app=ecoreport-backend
kubectl get pods -n ecoreport -w
```

> "Even when a pod is terminated, Kubernetes **automatically restarts it** within seconds — demonstrating our system's **resilience and self-healing capabilities**."

---

### CLOSING (30 seconds) — Both on camera

> "EcoReport demonstrates a complete software architecture solution — from mobile frontend to cloud infrastructure. We used event-driven architecture for real-time notifications, containerization for portability, Kubernetes for orchestration and scaling, and CI/CD for automated deployment. Thank you."

---

## Key words to mention:
- Event-driven architecture
- Microservices
- Role-based access control
- REST API, JWT authentication
- Docker containerization
- Kubernetes orchestration
- Horizontal Pod Autoscaler
- Rolling updates
- RabbitMQ message broker
- Infrastructure as Code
- Ansible, Jenkinsfile, CI/CD
- PostgreSQL, PostGIS
- Circular economy
- GPS-based reporting
- Self-healing, fault tolerance
- High availability

Good luck! 🎉
