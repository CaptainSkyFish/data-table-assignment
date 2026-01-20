<div align="center">

# Collection Table

A modular, stress-tested, type-safe data table with advanced selection UX, built using **Vite + React + TypeScript + PrimeReact**.

</div>

---

## Demo

https://private-user-images.githubusercontent.com/88182722/537855108-4acd6656-383a-40d5-890d-683bf398415c.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Njg4ODg2OTksIm5iZiI6MTc2ODg4ODM5OSwicGF0aCI6Ii84ODE4MjcyMi81Mzc4NTUxMDgtNGFjZDY2NTYtMzgzYS00MGQ1LTg5MGQtNjgzYmYzOTg0MTVjLm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAxMjAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMTIwVDA1NTMxOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWE3Y2RiM2UzMDRlMDQ0NTZlNGFmOGJlN2MzZGFlY2E4NWY2YTgxNTEzMjEzODMxODAxZjk0ZDJlZDJhMmFlMzUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.H_VcZkvjSPL0BStWZibrOc8ysjo9-AO7Y4Ue-PIkVa4


---

## Features

- Server-side pagination
- Row selection (manual + bulk modes)
- "Select N rows" overlay
- Persistent selection across pages
- Skeleton loading state
- Fully typed (TypeScript)
- Context-based state management
- PrimeReact DataTable integration

---

## Architecture

- **SelectionContext** manages row selection state (manual + bulk modes)
- **useSelection()** hook provides access to selection state
- **useCollection** hook manages pagination, loading, and data fetching
- UI components are dumb/presentational
- PrimeReact DataTable wrapped with custom selection logic

---

## Folder Structure
```
src/
├── App.tsx
├── components/
│   ├── CollectionTable.tsx        # DataTable wrapper with selection
│   ├── CollectionTableSkeleton.tsx
│   ├── SelectionOverlay.tsx       # Bulk select dropdown
│   └── TablePaginator.tsx         # External paginator
├── context/
│   └── SelectionContext.tsx       # Selection state (manual + bulk)
├── hooks/
│   ├── useCollection.ts           # Data + pagination hook
│   └── useSelection.ts            # Selection hook
├── lib/
│   └── api.ts
├── types/
│   └── artworks.ts
└── App.css
```
---

## Data Flow

```mermaid
flowchart TD
    App --> SelectionProvider
    SelectionProvider --> AppContent

    SelectionProvider -->|selection state| CollectionTable
    useCollection -->|items, loading, pagination| CollectionTable
    useCollection -->|pagination state| TablePaginator

    CollectionTable -->|toggle selection| SelectionProvider
    SelectionOverlay -->|bulk select N| SelectionProvider
```

---

## TODO

- [x] Project Setup (TypeScript + Vite + React + TailwindCSS + PrimeReact)
- [x] PrimeReact DataTable
- [x] SSR Pagination
- [x] Row Selection
- [x] Persistent Selection across pages
- [x] Bulk Row Selection via PrimeReact Overlay 
- [x] Across Pages Row Selection
- [ ] Themes with Light/Dark Mode

---

## Getting Started

```bash
npm install
npm run dev
```
