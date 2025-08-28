# 🛠️ TechFix Pro - Next-Gen Laptop Repair Management System

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.8.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-cyan)
![React](https://img.shields.io/badge/React-18-blue)

A comprehensive, professional laptop repair management system built with Next.js, TypeScript, MongoDB, and Tailwind CSS. This system provides complete tracking and management of laptop repair requests with authentication, status management, and resolution tracking.

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Modules](#-project-modules)
- [Component Structure](#-component-structure)
- [API Endpoints](#-api-endpoints)
- [Workflow Chart](#-workflow-chart)
- [Installation](#-installation)
- [Usage](#-usage)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Contributing](#-contributing)

## ✨ Features

- **🔐 Secure Authentication System**: JWT-based authentication with protected routes
- **📝 Query Management**: Submit, track, and manage laptop repair requests
- **📊 Status Tracking**: Real-time status updates (Pending, Resolved, Not Resolved)
- **🎯 Priority System**: Assign priorities (Low, Medium, High, Urgent)
- **💰 Cost Management**: Track estimated and actual repair costs
- **🔍 Advanced Filtering**: Filter queries by status, priority, and other criteria
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🚀 Real-time Updates**: Dynamic updates without page refresh
- **🛡️ Data Validation**: Comprehensive server-side and client-side validation
- **📈 Dashboard Analytics**: Overview of repair statistics and metrics

## 🏗️ Project Structure

```
laptop-repair-management/
├── 📁 components/          # Reusable React components
│   ├── AddLaptopQuery.tsx  # Form for submitting new repair requests
│   ├── Layout.tsx          # Main layout wrapper
│   ├── ListSection.tsx     # Display pending queries
│   ├── Navigation.tsx      # Navigation component
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   └── ResolvedSection.tsx # Display resolved queries
├── 📁 contexts/            # React context providers
│   └── AuthContext.tsx     # Authentication context
├── 📁 lib/                 # Utility libraries
│   └── mongoose.ts         # MongoDB connection
├── 📁 models/              # Database models
│   ├── LaptopQuery.ts      # Laptop query schema
│   └── User.ts             # User authentication schema
├── 📁 pages/               # Next.js pages
│   ├── 📁 api/             # API routes
│   │   ├── 📁 auth/        # Authentication endpoints
│   │   │   ├── backup-login.ts
│   │   │   ├── complete-reset.ts
│   │   │   ├── force-reset-users.ts
│   │   │   ├── init-users.ts
│   │   │   ├── login.ts
│   │   │   ├── logout.ts
│   │   │   ├── me.ts
│   │   │   ├── reset-users.ts
│   │   │   └── simple-login.ts
│   │   ├── 📁 debug/       # Debug endpoints
│   │   │   ├── db-status.ts
│   │   │   ├── detailed-users.ts
│   │   │   ├── env-check.ts
│   │   │   └── test-login.ts
│   │   └── 📁 queries/     # Query management endpoints
│   │       ├── [id].ts     # Individual query operations
│   │       ├── index.ts    # Main query operations
│   │       ├── pending.ts  # Pending queries
│   │       └── resolved.ts # Resolved queries
│   ├── _app.tsx            # App wrapper with providers
│   ├── _error.tsx          # Error page
│   ├── index.tsx           # Home page
│   └── login.tsx           # Login page
├── 📁 scripts/             # Utility scripts
│   ├── check-mongodb-users.js
│   ├── complete-fix.js
│   ├── final-setup.js
│   ├── fix-credentials.js
│   ├── init-users.js
│   ├── mongodb-status.js
│   ├── quick-test.js
│   ├── reset-users.js
│   ├── setup-auth.js
│   ├── test-credentials.js
│   └── test-db.js
├── 📁 styles/              # Global styles
│   └── globals.css         # Tailwind CSS and global styles
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.2.5**: React framework with SSR and API routes
- **React 18**: Frontend library
- **TypeScript 5**: Type-safe JavaScript
- **Tailwind CSS 3.4.1**: Utility-first CSS framework

### Backend
- **Node.js**: Runtime environment
- **Next.js API Routes**: Server-side API endpoints
- **MongoDB 6.8.0**: NoSQL database
- **Mongoose 8.5.2**: MongoDB object modeling

### Authentication & Security
- **JSON Web Tokens (JWT) 9.0.2**: Secure authentication
- **bcryptjs 3.0.2**: Password hashing
- **Protected Routes**: Client-side route protection

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 🏛️ System Architecture

The system follows a modern full-stack architecture:

1. **Frontend Layer**: React components with TypeScript
2. **API Layer**: Next.js API routes handling business logic
3. **Database Layer**: MongoDB with Mongoose ODM
4. **Authentication Layer**: JWT-based secure authentication
5. **State Management**: React Context for global state

## 📦 Project Modules

### 1. Authentication Module (`contexts/AuthContext.tsx`)
- **Purpose**: Manages user authentication state
- **Features**:
  - JWT token management
  - User session persistence
  - Login/logout functionality
  - Protected route handling
  - Auto-redirect on authentication failure

### 2. User Management Module (`models/User.ts`)
- **Purpose**: User data model and authentication
- **Features**:
  - User schema definition
  - Password hashing with bcrypt
  - Password comparison methods
  - Username uniqueness validation

### 3. Query Management Module (`models/LaptopQuery.ts`)
- **Purpose**: Laptop repair request data model
- **Features**:
  - Comprehensive query schema
  - Status tracking (pending, resolved, not_resolved)
  - Priority levels (low, medium, high, urgent)
  - Cost management (estimated vs actual)
  - Timestamp tracking

### 4. API Layer
#### Authentication APIs (`pages/api/auth/`)
- `login.ts`: User authentication endpoint
- `logout.ts`: User logout endpoint
- `me.ts`: Current user information
- `init-users.ts`: Initialize default users
- `reset-users.ts`: Reset user database

#### Query APIs (`pages/api/queries/`)
- `index.ts`: Main CRUD operations for queries
- `[id].ts`: Individual query operations
- `pending.ts`: Fetch pending queries
- `resolved.ts`: Fetch resolved queries

#### Debug APIs (`pages/api/debug/`)
- `db-status.ts`: Database connection status
- `env-check.ts`: Environment variable validation
- `test-login.ts`: Authentication testing

### 5. UI Components Module

#### Core Components (`components/`)
- **Layout.tsx**: Main application layout wrapper
- **Navigation.tsx**: Navigation bar with user actions
- **ProtectedRoute.tsx**: Route protection wrapper

#### Feature Components
- **AddLaptopQuery.tsx**: New repair request form
- **ListSection.tsx**: Pending queries display
- **ResolvedSection.tsx**: Resolved queries display

### 6. Database Module (`lib/mongoose.ts`)
- **Purpose**: MongoDB connection management
- **Features**:
  - Connection pooling
  - Error handling
  - Environment-based configuration

### 7. Utility Scripts (`scripts/`)
- Database initialization and maintenance scripts
- User management utilities
- Connection testing tools

## 🧩 Component Structure

### AddLaptopQuery Component
```tsx
interface AddLaptopQueryProps {
  onQueryAdded: () => void
}
```
- **Purpose**: Form for submitting new repair requests
- **Features**: Real-time validation, success/error messaging, responsive design

### ListSection Component
```tsx
interface ListSectionProps {
  onQueryUpdated: () => void
}
```
- **Purpose**: Display and manage pending queries
- **Features**: Status updates, priority filtering, cost tracking

### ResolvedSection Component
- **Purpose**: Display completed repair requests
- **Features**: Resolution details, cost analysis, completion statistics

### Navigation Component
- **Purpose**: Main navigation and user management
- **Features**: User profile, logout functionality, responsive menu

## 🔌 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/init-users` | Initialize users |

### Query Management Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queries` | Get all queries |
| POST | `/api/queries` | Create new query |
| GET | `/api/queries/[id]` | Get specific query |
| PUT | `/api/queries/[id]` | Update query |
| DELETE | `/api/queries/[id]` | Delete query |
| GET | `/api/queries/pending` | Get pending queries |
| GET | `/api/queries/resolved` | Get resolved queries |

### Debug Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/debug/db-status` | Database status |
| GET | `/api/debug/env-check` | Environment check |
| POST | `/api/debug/test-login` | Test authentication |

## 📊 Workflow Chart

```mermaid
graph TD
    A[🚀 Application Start] --> B{👤 User Authenticated?}
    
    B -->|No| C[🔐 Login Page]
    B -->|Yes| D[🏠 Dashboard]
    
    C --> E[📝 Enter Credentials]
    E --> F{✅ Valid Credentials?}
    F -->|No| G[❌ Show Error]
    G --> E
    F -->|Yes| H[🎯 Generate JWT Token]
    H --> I[💾 Store Auth State]
    I --> D
    
    D --> J[📋 Main Navigation]
    J --> K{🎯 User Action}
    
    K -->|Add Query| L[📝 Add Laptop Query Form]
    K -->|View Pending| M[📋 List Pending Queries]
    K -->|View Resolved| N[✅ Resolved Queries]
    K -->|Logout| O[🚪 Logout Process]
    
    L --> P[📊 Form Validation]
    P --> Q{✔️ Valid Data?}
    Q -->|No| R[⚠️ Show Validation Error]
    R --> L
    Q -->|Yes| S[📤 Submit to API]
    S --> T[💾 Save to MongoDB]
    T --> U[🔄 Update UI]
    U --> D
    
    M --> V[🔍 Fetch Pending Queries]
    V --> W[📊 Display Query List]
    W --> X{🛠️ Update Query?}
    X -->|Yes| Y[✏️ Edit Query Form]
    X -->|No| D
    
    Y --> Z[📝 Update Form]
    Z --> AA[📤 Submit Update]
    AA --> BB[💾 Update MongoDB]
    BB --> CC[🔄 Refresh List]
    CC --> W
    
    N --> DD[🔍 Fetch Resolved Queries]
    DD --> EE[📊 Display Resolved List]
    EE --> FF{📈 View Details?}
    FF -->|Yes| GG[📋 Show Query Details]
    FF -->|No| D
    GG --> EE
    
    O --> HH[🗑️ Clear Auth Token]
    HH --> II[💾 Clear User State]
    II --> JJ[🔄 Redirect to Login]
    JJ --> C
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#fce4ec
    style D fill:#e8f5e8
    style L fill:#f3e5f5
    style M fill:#e0f2f1
    style N fill:#e3f2fd
    style O fill:#fff8e1
```

### Detailed Workflow Explanation

#### 🔐 Authentication Flow
1. **Application Start**: User visits the application
2. **Authentication Check**: System verifies if user has valid JWT token
3. **Login Process**: If not authenticated, redirect to login page
4. **Credential Validation**: Server validates username/password against MongoDB
5. **Token Generation**: Create JWT token with user information
6. **State Management**: Store authentication state in React context

#### 📝 Query Management Flow
1. **Query Submission**:
   - User fills out repair request form
   - Client-side validation checks required fields
   - Data submitted to `/api/queries` endpoint
   - Server validates and saves to MongoDB
   - UI updates with success/error message

2. **Query Listing**:
   - Fetch queries from database based on status filter
   - Display in organized list with search/filter capabilities
   - Real-time updates when queries are modified

3. **Query Updates**:
   - Admin can update query status, priority, costs
   - Changes immediately reflected in database
   - UI updates without page refresh

#### 🔄 Data Flow Architecture
1. **Frontend → API**: User interactions trigger API calls
2. **API → Database**: API routes handle business logic and database operations
3. **Database → API**: MongoDB returns requested data
4. **API → Frontend**: Formatted response sent to client
5. **Frontend Update**: React components re-render with new data

#### 🛡️ Security Flow
1. **Request Intercepting**: All protected routes check for valid JWT
2. **Token Validation**: Server validates token signature and expiration
3. **User Context**: Authenticated user data available throughout app
4. **Auto-logout**: Invalid/expired tokens trigger automatic logout

## 🚀 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git for version control

### Steps

1. **Clone the repository**:
```bash
git clone https://github.com/techbizloanindia/TechFix-Pro---Next-Gen-Laptop-Repair-Management.git
cd laptop-repair-management
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment setup**:
```bash
cp .env.example .env.local
```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables))

5. **Initialize database**:
```bash
npm run init-db
```

6. **Start development server**:
```bash
npm run dev
```

7. **Open application**:
Visit `http://localhost:3000`

## 📖 Usage

### Default Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Creating New Repair Requests
1. Navigate to "Add Query" tab
2. Fill out the repair request form:
   - Customer name
   - Laptop brand/model
   - Issue description
   - Contact information (optional)
3. Submit the form
4. Query will appear in "Pending" section

### Managing Queries
1. View pending queries in "List" tab
2. Update status, priority, or costs as needed
3. Mark queries as resolved with resolution details
4. View completed repairs in "Resolved" tab

### Admin Functions
- User management through API endpoints
- Database maintenance scripts
- System status monitoring

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/laptop-repair-db
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/laptop-repair-db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: For production deployment
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
```

### Environment Variable Descriptions
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRES_IN`: JWT token expiration time
- `NEXT_PUBLIC_APP_URL`: Application URL for client-side requests
- `NODE_ENV`: Environment mode (development/production)

## 📜 Scripts

Available npm scripts:

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database Management
npm run init-db      # Initialize database with default users
npm run reset-db     # Reset database (caution: deletes all data)
npm run check-db     # Check database connection

# Testing
npm run test-auth    # Test authentication endpoints
npm run test-db      # Test database connection
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript types
4. Test your changes thoroughly
5. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Create a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful component and function names
- Add proper error handling
- Include JSDoc comments for complex functions
- Ensure responsive design with Tailwind CSS

### Testing Guidelines
- Test all API endpoints with various input scenarios
- Verify authentication flows work correctly
- Check responsive design on multiple screen sizes
- Validate form inputs and error handling

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the robust database solution
- Tailwind CSS for the utility-first CSS framework
- React team for the powerful frontend library
- All contributors who help improve this project



---

**Built with ❤️ by TechFix-Pro Team**

*Transform your laptop repair business with professional management tools.*
