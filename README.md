# SwiftBed: Streamlining Hospital Bed Utilization

SwiftBed is a modern web application designed to streamline hospital bed management and utilization. It provides real-time tracking of bed availability, patient assignments, and ward management, helping healthcare facilities optimize their resources and improve patient care.

## Features

- **Real-time Bed Management**
  - Track bed availability and occupancy status
  - Quick bed assignment and status updates
  - Visual ward layout for easy navigation

- **Patient Management**
  - Efficient patient admission and discharge processes
  - Patient information tracking
  - Medical condition monitoring

- **Ward Organization**
  - Structured ward layout
  - Specialized bed categorization
  - Maintenance status tracking

- **User Authentication**
  - Secure login and registration
  - Role-based access control
  - Google authentication support

- **Modern UI/UX**
  - Responsive design
  - Intuitive interface
  - Real-time updates
  - Dark/Light mode support

## Tech Stack

- **Frontend**
  - Next.js 14
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - NextAuth.js

- **Backend**
  - Next.js API Routes
  - MongoDB
  - Mongoose

- **Authentication**
  - NextAuth.js
  - Google OAuth
  - JWT

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB
- Google OAuth credentials (for Google Sign-in)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/swiftbed.git
   cd swiftbed
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3001
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3001`.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── beds/              # Bed management pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── Layout.tsx        # Main layout component
├── lib/                  # Utility functions
└── types/               # TypeScript type definitions
```

## Usage

1. **Authentication**
   - Register a new account or sign in with Google
   - Access the dashboard after authentication

2. **Bed Management**
   - View bed status in the dashboard
   - Click on a bed to update its status
   - Assign patients to available beds

3. **Ward Management**
   - Navigate through different wards
   - Monitor bed availability
   - Update maintenance status

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- Shadcn UI for the component library
- All contributors and maintainers
