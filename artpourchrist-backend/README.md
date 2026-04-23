# Art pour Christ — Spring Boot Backend

REST API backend for the **Art pour Christ - MEEC Centre** admin portal.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.2 |
| Language | Java 17 |
| Security | Spring Security + JWT (JJWT 0.12) |
| Database | H2 (dev) / PostgreSQL (prod) |
| ORM | Spring Data JPA / Hibernate |
| File Storage | Local filesystem |
| Build | Maven |

---

## Quick Start

### 1. Prerequisites
- Java 17+
- Maven 3.8+

### 2. Run (development)
```bash
cd artpourchrist-backend
mvn spring-boot:run
```

Server starts on **http://localhost:3001**

### 3. Default admin credentials
```
Email:    admin@artpourchrist.com
Password: Admin@1234
```
> Change these in `application.properties` before deploying!

---

## API Endpoints

### Auth
| Method | URL | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Login → returns JWT token |
| GET | `/api/auth/me` | ✅ | Get current user info |

### Announcements
| Method | URL | Auth | Description |
|---|---|---|---|
| GET | `/api/announcements` | ❌ | List all announcements |
| GET | `/api/announcements/{id}` | ❌ | Get single announcement |
| POST | `/api/announcements` | ✅ | Create announcement |
| PUT | `/api/announcements/{id}` | ✅ | Update announcement |
| DELETE | `/api/announcements/{id}` | ✅ | Delete announcement |

### Photos
| Method | URL | Auth | Description |
|---|---|---|---|
| GET | `/api/photos` | ❌ | List all photos |
| GET | `/api/photos/{id}` | ❌ | Get single photo |
| POST | `/api/photos` | ✅ | Upload photo (multipart/form-data) |
| PUT | `/api/photos/{id}` | ✅ | Update photo metadata |
| DELETE | `/api/photos/{id}` | ✅ | Delete photo |

**POST /api/photos fields:**
- `photo` (file) — image file
- `title` (text)
- `description` (text, optional)
- `category` (text, optional)

### Videos
| Method | URL | Auth | Description |
|---|---|---|---|
| GET | `/api/videos` | ❌ | List all videos |
| GET | `/api/videos/{id}` | ❌ | Get single video |
| POST | `/api/videos` | ✅ | Upload video (multipart/form-data) |
| PUT | `/api/videos/{id}` | ✅ | Update video metadata |
| DELETE | `/api/videos/{id}` | ✅ | Delete video |

**POST /api/videos fields:**
- `video` (file) — video file
- `thumbnail` (file) — thumbnail image
- `title` (text)
- `description` (text, optional)
- `category` (text, optional)

### Dashboard
| Method | URL | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/stats` | ✅ | Get counts + recent activity |

---

## Authentication

Send the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Configuration (`application.properties`)

```properties
# Port
server.port=3001

# Admin credentials (change these!)
app.admin.email=admin@artpourchrist.com
app.admin.password=Admin@1234

# JWT secret (change this!)
jwt.secret=yourSuperSecretKey
jwt.expiration=86400000   # 24 hours in ms

# CORS (add your frontend URL)
app.cors.allowed-origins=http://localhost:5173

# Base URL for file links
app.base-url=http://localhost:3001

# Upload directory
app.upload.dir=uploads
```

---

## Switch to PostgreSQL (Production)

1. Add the PostgreSQL dependency (already in `pom.xml`, just uncomment)
2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/artpourchrist
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.h2.console.enabled=false
```

---

## Build for Production

```bash
mvn clean package -DskipTests
java -jar target/artpourchrist-backend-1.0.0.jar
```

---

## H2 Console (Dev only)

Visit: **http://localhost:3001/h2-console**
- JDBC URL: `jdbc:h2:file:./data/artpourchrist`
- Username: `sa`
- Password: *(empty)*

---

## Frontend Environment Variable

In your React frontend `.env`:
```
VITE_API_URL=http://localhost:3001/api
```
