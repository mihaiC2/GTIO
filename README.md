# Voting System for OT  

This is a voting system designed for the reality show **Operación Triunfo (OT)**, allowing users to vote for their favorite contestants and view real-time results. The system includes secure authentication, vote management, and a user-friendly interface.

## 👥 Team Members  
- **Roberto** 
- **Jazmin**
- **Mihail**
- **Nikol**
- **Yasin**

## ✨ Features  
- [x] User registration and login using **Supabase Auth**  
- [x] Secure voting system with per-user vote limits  
- [x] Real-time vote result visualization  
- [x] RESTful API for frontend-backend communication  
- [x] Responsive and modern UI ([Frontend repo](https://github.com/klou17/ProyectoVotacionWeb))
- [x] Microservices architecture (auth, singers, users, votes)
- [x] API Gateway with **Kong** and **Konga**
- [x] Dockerized deployment
- [x] Infrastructure as code (Terraform + AWS)
- [ ] Admin panel for managing contestants and voting rounds *(coming soon)*  
 
 > 📌 *Check back for upcoming features and improvements!*

 ## 🧱 Infrastructure & Technologies

- **Frontend:** React ([Frontend repo](https://github.com/klou17/ProyectoVotacionWeb))
- **Backend:** Node.js + Express (Microservices architecture)
- **Database:** PostgreSQL (Supabase) and MongoDB (for logs)  
- **Authentication:** Supabase (Auth & JWT)
- **API Gateway:** Kong + Konga  
- **Cloud & IaC**: AWS + Terraform
- **Deployment**: Docker + Docker Compose
  
## 🧩 Local Installation (via Docker)

### 1. Clone the repository:  
   ```bash
   git clone https://github.com/mihaiC2/GTIO.git
   cd GTIO
   ```
### 2. Environment variables
Set up the required `.env` files for each service:

- `ot/backend/auth-service/.env`
- `ot/backend/singer-service/.env`
- `ot/backend/user-service/.env`
- `ot/backend/vote-service/.env`

### 3. Run the services
```bash
docker-compose up --build
```

## 📬 API Documentation
You can explore and test the API using Postman:

👉 [View Postman Collection](https://documenter.getpostman.com/view/13344627/2sB2qXjN7v)

## 🌐 External Links
- 🔗 Frontend Repo: [ProyectoVotacionWeb](https://github.com/klou17/ProyectoVotacionWeb)

- 💬 Discord Server: [Join our OT Voting Discord](https://discord.gg/eSSum25Vtf)

- 🧪 Postman Collection: [Explore here](https://documenter.getpostman.com/view/13344627/2sB2qXjN7v)

## 🌱 Branches
- `main`: Stable, production-ready code

- `dev`: Active development. New features and updates go here first

> Please use the `dev` branch when contributing and submit pull requests to merge into `main`.