# Piano App Technical Architecture

## Tech Stack Selection

### Frontend
- **Framework**: Next.js 14 (App Router)
  - React for component architecture
  - Server Components for improved performance
  - Built-in API routes
  - Easy deployment and static optimization
- **UI Components**: 
  - shadcn/ui (based on Tailwind CSS)
  - Framer Motion for animations
- **State Management**: 
  - Zustand for global state
  - React Query for server state
- **MIDI Handling**: 
  - WebMIDI API
  - Tone.js for audio synthesis
- **Music Visualization**:
  - VexFlow for sheet music rendering
  - Canvas API for animations

### Backend
- **API**: Next.js API routes (built-in)
- **Authentication**: Next-Auth
- **File Handling**: 
  - AWS S3 for MIDI file storage
  - Sharp for image optimization

### Database
- **Primary Database**: PostgreSQL
  - Complex queries for music library
  - Rich indexing capabilities
  - JSONB support for flexible schema
- **ORM**: Prisma
  - Type-safe database queries
  - Easy schema migrations
  - Great developer experience

### Deployment
- **Web Hosting**: Vercel
- **Database Hosting**: Supabase (PostgreSQL)
- **Asset Storage**: AWS S3
- **Android Packaging**: PWA + TWA (Trusted Web Activity)

## Development Roadmap

### Phase 1: Project Setup & Basic Infrastructure

1. Initialize Next.js project:
```bash
npx create-next-app@latest piano-app --typescript --tailwind --app
```

2. Set up Prisma with PostgreSQL:
```bash
npm install @prisma/client prisma
npx prisma init
```

3. Define initial schema (in `prisma/schema.prisma`):
```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  scores    Score[]
  favorites Sheet[]
}

model Sheet {
  id          String    @id @default(cuid())
  title       String
  difficulty  Int
  midiUrl     String
  imageUrl    String?
  scores      Score[]
  favorites   User[]
}

model Score {
  id        String    @id @default(cuid())
  userId    String
  sheetId   String
  score     Int
  date      DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id])
  sheet     Sheet     @relation(fields: [sheetId], references: [id])
}
```

### Phase 2: Authentication & Basic UI

1. Install and configure NextAuth:
```bash
npm install next-auth @auth/prisma-adapter
```

2. Set up shadcn/ui components:
```bash
npx shadcn-ui@latest init
```

3. Create basic layout components:
- Navigation bar
- Sheet music browser
- User profile section

### Phase 3: MIDI Implementation

1. Create MIDI connection handler:
```typescript
class MIDIHandler {
  async initialize() {
    if (!navigator.requestMIDIAccess) {
      throw new Error('WebMIDI not supported');
    }
    const midi = await navigator.requestMIDIAccess();
    this.setupInputs(midi);
  }

  setupInputs(midi: MIDIAccess) {
    midi.inputs.forEach((input) => {
      input.onmidimessage = this.handleMIDIMessage;
    });
  }

  handleMIDIMessage(message: MIDIMessageEvent) {
    // Handle MIDI input here
  }
}
```

2. Implement sheet music rendering with VexFlow:
```typescript
class SheetRenderer {
  constructor(canvas: HTMLCanvasElement) {
    this.vf = new Vex.Flow.Factory({
      renderer: { elementId: canvas.id }
    });
  }

  renderSheet(notes: Note[]) {
    // Render sheet music
  }
}
```

### Phase 4: Game Logic Implementation

1. Create game state management with Zustand:
```typescript
interface GameState {
  currentNote: Note;
  score: number;
  isPlaying: boolean;
  setNote: (note: Note) => void;
  incrementScore: () => void;
}

const useGameStore = create<GameState>((set) => ({
  currentNote: null,
  score: 0,
  isPlaying: false,
  setNote: (note) => set({ currentNote: note }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
}));
```

### Phase 5: Sheet Music Library

1. Implement sheet music upload to S3:
```typescript
async function uploadMIDIFile(file: File) {
  const presignedUrl = await getPresignedUrl(file.name);
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
  });
}
```

2. Create sheet music browser with filtering and search:
```typescript
async function getSheets(filters: SheetFilters) {
  const sheets = await prisma.sheet.findMany({
    where: {
      difficulty: filters.difficulty,
      // Add more filters
    },
    include: {
      scores: true,
    },
  });
  return sheets;
}
```

### Phase 6: PWA & Android Implementation

1. Add PWA manifest and service worker
2. Configure TWA for Android packaging
3. Implement offline support for saved sheets

### Phase 7: Testing & Optimization

1. Set up testing infrastructure:
```bash
npm install jest @testing-library/react @testing-library/jest-dom
```

2. Create test suites for critical components:
```typescript
describe('MIDI Handler', () => {
  test('should connect to MIDI devices', async () => {
    // Test MIDI connection
  });
});
```

3. Implement performance monitoring
4. Optimize sheet music rendering
5. Add error boundaries and fallbacks

## Deployment Checklist

1. Set up Vercel project
2. Configure environment variables
3. Set up Supabase database
4. Configure S3 buckets
5. Deploy and test PWA
6. Package Android TWA
7. Monitor performance and errors

## Best Practices

1. **Code Organization**:
   - Feature-based folder structure
   - Separation of concerns
   - Custom hooks for reusable logic

2. **Performance**:
   - Use React Suspense and streaming
   - Implement proper caching strategies
   - Optimize assets and bundle size

3. **Security**:
   - Implement proper CORS policies
   - Validate all user inputs
   - Use content security policies

4. **Testing**:
   - Unit tests for utility functions
   - Integration tests for critical flows
   - E2E tests for user journeys

5. **Monitoring**:
   - Error tracking
   - Performance monitoring
   - User analytics

### Phase 1: Project Setup & Basic Infrastructure

1. Configuración inicial del proyecto:
   - Inicializar proyecto Next.js con TypeScript
   - Configurar ESLint y Prettier:
     - Instalar dependencias de ESLint y Prettier
     - Crear archivos de configuración (.eslintrc.js, .prettierrc)
     - Configurar reglas específicas para TypeScript
     - Integrar ESLint con Prettier
     - Añadir scripts en package.json para lint y format
   - Implementar Tailwind CSS y shadcn/ui
   - Establecer estructura de carpetas

2. Configuración del entorno de desarrollo:
   - Configurar variables de entorno
   - Establecer scripts de desarrollo
   - Implementar hot reloading
   - Configurar depuración

3. Implementación de la base de datos:
   - Configurar Supabase
   - Diseñar esquema inicial
   - Configurar Prisma ORM
   - Crear migraciones iniciales

4. Configuración de autenticación:
   - Implementar Next-Auth
   - Configurar proveedores OAuth
   - Crear rutas protegidas
   - Implementar middleware de autenticación

5. Configuración de almacenamiento:
   - Configurar AWS S3
   - Implementar gestión de archivos MIDI
   - Configurar políticas de acceso
   - Implementar carga de archivos

6. Implementación de CI/CD:
   - Configurar GitHub Actions
   - Establecer pipeline de pruebas
   - Configurar despliegue automático
   - Implementar verificaciones de calidad

7. Configuración de monitoreo:
   - Implementar logging
   - Configurar análisis de rendimiento
   - Establecer alertas
   - Configurar métricas de usuario

