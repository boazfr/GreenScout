# greenScout — Developer Guide

## Project Structure

- `backend/` — Java 21 + Spring Boot 3 (Maven)
- `frontend/` — Next.js 14 + TypeScript + Tailwind CSS

## Backend

- **Build:** `cd backend && mvn clean install`
- **Run:** `cd backend && GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=xxx mvn spring-boot:run`
- **Port:** 8080
- **Package:** `com.greenscout.api`
- **Database:** PostgreSQL + PostGIS, managed by Flyway migrations in `src/main/resources/db/migration/`

### Key patterns
- Session-based auth (JSESSIONID cookie), NOT JWT
- OAuth2 login handled entirely by Spring Security — frontend just links to `/oauth2/authorization/google`
- Spatial queries use PostGIS `ST_DWithin` with geography casting
- JTS `Point` type for geometry fields, serialized as GeoJSON via `jackson-datatype-jts`

## Frontend

- **Install:** `cd frontend && npm install`
- **Run:** `cd frontend && npm run dev`
- **Port:** 3000
- **API calls:** Use `apiFetch()` from `src/lib/api.ts` — it adds `credentials: "include"` for cookie auth
- **Maps:** Leaflet loaded dynamically (no SSR) via `MapWrapper.tsx`

## Environment Variables

- Backend: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (passed at runtime)
- Frontend: `NEXT_PUBLIC_API_URL` in `.env.local` (defaults to `http://localhost:8080`)
