# Reetr Admin Panel - Project Context

## Project Overview

**Purpose**: Admin panel for managing Reetr documents and content, specifically focused on Life Hacks management with Auth0 authentication.

**Tech Stack**: 
- Next.js 15.3.5 with **Pages Router** (App Router has Auth0 compatibility issues)
- TypeScript
- Tailwind CSS
- Auth0 for authentication
- React 19

## Project Structure

```
reetr-admin-crud/
├── pages/
│   ├── _app.tsx                    # App wrapper with Auth0 UserProvider
│   ├── _document.tsx               # HTML document structure
│   ├── index.tsx                   # Main page with Auth0 authentication
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...auth0].ts       # Auth0 API routes
│   │   └── lifehacks.ts            # Life hacks CRUD API
│   ├── components/
│   │   └── AdminDashboard.tsx      # Main dashboard component
│   └── types/
│       └── lifeHacks.ts            # TypeScript interfaces
├── styles/
│   └── globals.css                 # Global Tailwind CSS
├── .env.local                      # Auth0 configuration
└── package.json                    # Dependencies
```

## Key Dependencies

```json
{
  "dependencies": {
    "@auth0/nextjs-auth0": "^4.8.0",
    "next": "15.3.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.5"
  }
}
```

## Auth0 Configuration

### Environment Variables (.env.local)
```bash
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://dev-6or0flvn08l0yt21.us.auth0.com'
AUTH0_CLIENT_ID='s8caHVrF8wwgdzV8YYhx9BI96GbptLuD'
AUTH0_CLIENT_SECRET='hzmcossb3cEZOOcmwWKay7aMawsT4-gyOCLxud1tW84pue9J9-z5LconIo5jis1g'
AUTH0_AUDIENCE='your_auth_api_identifier'
AUTH0_SCOPE='openid profile email read:shows'

# Your actual API base URL
NEXT_PUBLIC_API_BASE_URL=https://reetr-backend-production.up.railway.app/api
```

### Auth0 Dashboard Settings
- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
- **Allowed Logout URLs**: `http://localhost:3000`
- **Application Type**: Regular Web Application

## Data Models

### LifeHack Interface
```typescript
export enum LifeHackCategory {
  FAITH = "faith",
  FITNESS = "fitness", 
  FAMILY = "family",
  MARRIAGE_SIGNIFICANT_OTHER = "marriage/significant-other",
  CAREER = "career",
  MENTAL = "mental",
  COMMUNITY = "community"
}

export enum Day {
  MONDAY = "Mon",
  TUESDAY = "Tue",
  WEDNESDAY = "Wed", 
  THURSDAY = "Thu",
  FRIDAY = "Fri",
  SATURDAY = "Sat",
  SUNDAY = "Sun"
}

export interface LifeHack {
  id: string;
  icon: string | null;
  category: LifeHackCategory;
  type: string; // Display title (e.g., "Daily Reflection")
  description: string; // User-facing description
  adjustableTime: boolean; // Can user customize time?
  adjustableDay: boolean; // Can user customize day?
  isDaily: boolean; // Daily vs specific day/weekly
  defaultDay?: Day; // Pre-set day if not adjustable
  defaultTime?: Date; // Pre-set time if not adjustable
}
```

## Application Flow

### Authentication Flow
1. **App loads** → Checks Auth0 authentication status
2. **If unauthenticated** → Shows login page with "Sign in with Auth0" button
3. **Click login** → Redirects to Auth0 universal login
4. **Auth0 callback** → Returns to app with user session
5. **If authenticated** → Shows admin dashboard

### Dashboard Features
- **Header**: Shows user info (name, email, picture) and logout button
- **Tab Navigation**: Life Hacks and Assessments tabs
- **Life Hacks Tab**: Form to create new life hacks with full validation
- **Assessments Tab**: Placeholder with lorem ipsum

## Key Implementation Details

### Pages Router vs App Router
- **CRITICAL**: Must use Pages Router, not App Router
- App Router has incompatible Auth0 exports (`handleAuth` doesn't exist)
- Pages Router works seamlessly with `@auth0/nextjs-auth0`

### Auth0 Implementation
```typescript
// pages/_app.tsx
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Component {...pageProps} />
      </div>
    </UserProvider>
  );
}

// pages/api/auth/[...auth0].ts
import { handleAuth } from '@auth0/nextjs-auth0';
export default handleAuth();

// pages/index.tsx
import { useUser } from '@auth0/nextjs-auth0/client';
const { user, error, isLoading } = useUser();
```

### Life Hacks Form Features
- **Required Fields**: Type/Title, Description, Category
- **Optional Fields**: Icon, Default Time, Default Day
- **Boolean Toggles**: Is Daily, Adjustable Time, Adjustable Day
- **Validation**: Ensures required fields and business logic
- **Time Handling**: Converts HTML time input to Date objects
- **API Integration**: Posts to `/api/lifehacks` endpoint

### Styling
- **Framework**: Tailwind CSS 4
- **Theme**: Green accent colors (#12493e, green-600/700)
- **Layout**: Responsive design with mobile-first approach
- **Components**: Clean, professional admin interface

## API Endpoints

### Local Development
- `GET/POST /api/lifehacks` - CRUD operations for life hacks
- `GET /api/auth/login` - Auth0 login
- `GET /api/auth/logout` - Auth0 logout
- `GET /api/auth/callback` - Auth0 callback

### External API
- **Production**: `https://reetr-backend-production.up.railway.app/api`
- **Expected Endpoints**: Same structure as local API
- **Authentication**: JWT tokens from Auth0

## Known Issues & Solutions

### Auth0 Package Compatibility
- **Issue**: `@auth0/nextjs-auth0` exports differ between versions
- **Solution**: Use version 4.8.0 with Pages Router
- **Imports**: Use `/client` suffix for client-side hooks

### Environment Variables
- **Issue**: Variable names must match Auth0 SDK expectations
- **Solution**: Use exact names: `AUTH0_ISSUER_BASE_URL`, `AUTH0_BASE_URL`

### Time Handling
- **Issue**: HTML time input vs Date objects
- **Solution**: Convert using `setHours()` and `toTimeString().slice(0, 5)`

## Setup Instructions

1. **Create Next.js project** with Pages Router
2. **Install dependencies** from package.json above
3. **Configure Auth0** with provided environment variables
4. **Set up Auth0 dashboard** with callback/logout URLs
5. **Create pages structure** as outlined above
6. **Implement authentication flow** with UserProvider
7. **Build dashboard components** with form validation
8. **Test authentication** end-to-end

## Future Enhancements

- Add user role-based permissions
- Implement data persistence with database
- Add more document types beyond Life Hacks
- Implement real-time updates
- Add bulk import/export functionality
- Enhanced error handling and logging

## Critical Notes

- **NEVER use App Router** - Auth0 compatibility issues
- **Always validate forms** before API submission
- **Handle Auth0 loading states** properly
- **Use consistent styling** with Tailwind classes
- **Test authentication flow** thoroughly
- **Keep environment variables secure**