# greenScout

A location-based web app for parents to find nearby nature activities (hikes, gardens, playgrounds) with their children.

## Stack

- **Backend:** Java 21 + Spring Boot 3 (REST API, OAuth2 with Google)
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Database:** PostgreSQL + PostGIS
- **Maps:** Leaflet / React-Leaflet

## Prerequisites

- Java 21
- Node.js 18+
- PostgreSQL with PostGIS extension
- Google OAuth2 credentials (Client ID + Secret)

### Database setup

```bash
createdb greenscout
psql -d greenscout -c "CREATE EXTENSION postgis;"
```

## Running

```bash
# Terminal 1 — backend
cd backend
GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=xxx mvn spring-boot:run

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:3000
