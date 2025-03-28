# Hospital Bed Dashboard

A modern dashboard application for hospital bed management. This system helps hospital staff track bed availability, manage patient admissions and discharges, and optimize resource allocation.

## Features

- 🏥 **Hospital Overview**: View total beds, availability, and occupancy rates at a glance
- 🛌 **Bed Management**: Track bed status (available, occupied, maintenance)
- 👨‍⚕️ **Patient Management**: Admit, track, and discharge patients
- 🔑 **Authentication**: Secure login with email/password and Google OAuth
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hospital-bed-dashboard.git
   cd hospital-bed-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the project root:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/hospital_dashboard?schema=public"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3001"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. Generate Prisma client and push schema to database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Running the Application

#### Development

```bash
npm run dev
```

The application will be available at http://localhost:3001

#### Production

```bash
npm run build
npm start
```

## Project Structure

```
/
├── prisma/                  # Prisma schema and migrations
│   └── schema.prisma        # Database models
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   └── auth/        # Authentication API
│   │   ├── auth/            # Auth pages (signin, etc.)
│   │   └── page.tsx         # Dashboard page
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   └── ui/              # UI components
│   ├── lib/                 # Utility functions
│   │   ├── auth.ts          # Auth utilities
│   │   ├── auth-options.ts  # NextAuth configuration
│   │   └── prisma.ts        # Prisma client
│   └── types/               # TypeScript type definitions
└── .env                     # Environment variables
```

## Authentication

The application uses NextAuth.js for authentication with two providers:

1. **Credentials Provider**: Email/password login
2. **Google Provider**: OAuth login with Google

To set up Google authentication:
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Configure the OAuth consent screen
3. Create OAuth credentials
4. Add authorized redirect URIs:
   - For development: `http://localhost:3001/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`

## Database Schema

The database schema includes the following main models:

- **Hospital**: Information about hospitals
- **Ward**: Hospital sections/departments
- **Bed**: Individual beds with status tracking
- **Patient**: Patient information with admission data
- **User**: Authentication and user management

## Deployment

### Vercel

This application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy!

### Other Platforms

For other platforms, ensure you:
1. Set up the PostgreSQL database
2. Configure all environment variables
3. Build the project with `npm run build`
4. Start the server with `npm start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
