# BioScopeAI Web

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, high-performance web application for biological scope analysis powered by AI

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [UML Activity Diagrams](#uml-activity-diagrams)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## 🔬 Overview

BioScopeAI Web is a cutting-edge frontend application designed for biological image analysis and classification. Built with modern web technologies, it provides an intuitive interface for managing datasets, analyzing biological images, viewing real-time streams, and leveraging AI-powered classification capabilities.

## ✨ Features

- 🔐 **Authentication System** - Secure user authentication with JWT tokens and automatic refresh
- 📊 **Dashboard** - Comprehensive overview of system status and recent activities
- 🗂️ **Dataset Management** - Create, view, and manage biological datasets with ease
- 🖼️ **Image Analysis** - Advanced image viewing and classification tools
- 📹 **Real-time Streaming** - Live video streaming from connected devices
- 🔬 **AI-Powered Classification** - Automated biological specimen classification
- 📱 **Device Management** - Monitor and control connected microscope devices
- 👤 **User Management** - Admin panel for user and system administration
- 🎨 **Modern UI/UX** - Clean, responsive design with TailwindCSS
- ⚡ **High Performance** - Optimized build with Vite and React 19

## 📊 UML Activity Diagrams

Comprehensive UML activity diagrams documenting all major user workflows are available in the [`docs/diagrams`](./docs/diagrams) directory:

- **[User Authentication](./docs/diagrams/user-authentication.md)** - Login, registration, and token management flows
- **[Dataset Management](./docs/diagrams/dataset-management.md)** - Create, view, edit, and delete datasets
- **[Image Classification](./docs/diagrams/image-classification.md)** - AI-powered classification workflows and result viewing
- **[Device & Streaming](./docs/diagrams/device-streaming.md)** - Device management and real-time WebRTC streaming
- **[Admin Operations](./docs/diagrams/admin-operations.md)** - User management and system monitoring

These diagrams provide detailed visualization of:
- User interaction flows
- System decision points
- API integration patterns
- Error handling procedures
- Success and failure paths

Perfect for understanding the application architecture, onboarding new developers, or planning test scenarios.

## 🛠️ Technology Stack

### Core Framework
- **[React 19.2.0](https://reactjs.org/)** - Modern UI library with latest features and improvements
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - Type-safe JavaScript for robust code
- **[Vite 7.2.4](https://vitejs.dev/)** - Next-generation frontend build tool

### Routing & State
- **[React Router DOM 7.10.1](https://reactrouter.com/)** - Declarative routing for React applications
- **Context API** - Built-in state management for authentication and global state

### Styling & UI
- **[TailwindCSS 4.1.17](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React 0.556.0](https://lucide.dev/)** - Beautiful, consistent icon set

### Development Tools
- **[ESLint 9.39.1](https://eslint.org/)** - JavaScript/TypeScript linting
- **[TypeScript ESLint 8.46.4](https://typescript-eslint.io/)** - TypeScript-specific linting rules
- **[Vite Plugin React SWC](https://github.com/vitejs/vite-plugin-react-swc)** - Fast refresh with SWC compiler

### Build & Compilation
- **[SWC](https://swc.rs/)** - Super-fast TypeScript/JavaScript compiler
- **Vite Build** - Optimized production builds with code splitting

## 📁 Project Structure

```
bioscopeai-web/
├── public/                      # Static assets
│   └── favicon.svg             # Application favicon
├── src/                        # Source code
│   ├── api/                    # API integration layer
│   │   └── apiClient.ts       # HTTP client with auth & error handling
│   ├── components/             # Reusable UI components
│   │   ├── Alert.tsx          # Alert/notification component
│   │   ├── Badge.tsx          # Badge/tag component
│   │   ├── Button.tsx         # Custom button component
│   │   ├── Input.tsx          # Form input component
│   │   ├── Loading.tsx        # Loading indicators
│   │   ├── Logo.tsx           # Application logo
│   │   ├── Modal.tsx          # Modal/dialog component
│   │   ├── PublicRoute.tsx    # Route wrapper for public pages
│   │   ├── Spinner.tsx        # Spinner component
│   │   └── index.ts           # Component exports
│   ├── features/               # Feature-based modules
│   │   ├── auth/              # Authentication feature
│   │   │   ├── api/           # Auth-related API calls
│   │   │   ├── components/    # Auth-specific components
│   │   │   ├── context/       # Auth context & provider
│   │   │   ├── hooks/         # Auth-related hooks
│   │   │   └── types/         # Auth TypeScript types
│   │   ├── classifications/    # Classification feature
│   │   │   ├── api/           # Classification API
│   │   │   ├── components/    # Classification UI components
│   │   │   ├── hooks/         # Classification hooks
│   │   │   └── types/         # Classification types
│   │   ├── datasets/          # Dataset management feature
│   │   │   ├── api/           # Dataset API calls
│   │   │   ├── components/    # Dataset UI components
│   │   │   ├── hooks/         # Dataset-related hooks
│   │   │   └── types/         # Dataset TypeScript types
│   │   ├── devices/           # Device management feature
│   │   │   ├── api/           # Device API calls
│   │   │   ├── components/    # Device UI components
│   │   │   ├── hooks/         # Device-related hooks
│   │   │   └── types/         # Device TypeScript types
│   │   ├── images/            # Image analysis feature
│   │   │   ├── api/           # Image API calls
│   │   │   ├── components/    # Image viewer components
│   │   │   ├── hooks/         # Image-related hooks
│   │   │   └── types/         # Image TypeScript types
│   │   └── stream/            # Real-time streaming feature
│   │       ├── components/    # Stream UI components
│   │       ├── hooks/         # Stream-related hooks
│   │       └── types/         # Stream TypeScript types
│   ├── layouts/               # Page layouts
│   │   ├── AppLayout.tsx      # Main application layout
│   │   └── components/        # Layout-specific components
│   ├── pages/                 # Page components
│   │   ├── AdminPage.tsx      # Admin dashboard
│   │   ├── DashboardPage.tsx  # Main dashboard
│   │   ├── DatasetDetailsPage.tsx  # Dataset detail view
│   │   ├── DatasetsPage.tsx   # Dataset list view
│   │   ├── DevicesPage.tsx    # Device management
│   │   ├── LoginPage.tsx      # Login page
│   │   ├── NotFoundPage.tsx   # 404 error page
│   │   ├── RegisterPage.tsx   # User registration
│   │   └── StreamPage.tsx     # Live stream viewer
│   ├── router/                # Application routing
│   │   └── index.tsx          # Route configuration
│   ├── index.css              # Global styles & Tailwind imports
│   ├── main.tsx               # Application entry point
│   └── vite-env.d.ts          # Vite type declarations
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point
├── package.json               # Project dependencies & scripts
├── tsconfig.json              # TypeScript base configuration
├── tsconfig.app.json          # TypeScript app configuration
├── tsconfig.node.json         # TypeScript Node configuration
├── vite.config.ts             # Vite configuration
└── README.md                  # This file
```

### Architecture Principles

- **Feature-Based Structure**: Code is organized by features rather than technical layers, improving maintainability and scalability
- **Component Reusability**: Shared UI components in the `components/` directory promote consistency
- **Type Safety**: Comprehensive TypeScript types in each feature module ensure code reliability
- **API Abstraction**: Centralized API client with authentication and error handling
- **Context-Based State**: React Context API for global state management (authentication, etc.)
- **Custom Hooks**: Reusable logic encapsulated in custom hooks for each feature

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aleksanderbialka/bioscopeai-web.git
   cd bioscopeai-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your environment variables (see [Environment Variables](#environment-variables))

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 💻 Development

### Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production (TypeScript compilation + Vite build)
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality

### Development Workflow

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the existing code style

3. Lint your code
   ```bash
   npm run lint
   ```

4. Build to ensure no compilation errors
   ```bash
   npm run build
   ```

5. Commit your changes with descriptive messages

6. Push and create a pull request

### Code Style Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write self-documenting code with clear variable names
- Add comments for complex logic
- Keep components small and focused
- Use TypeScript interfaces for data structures
- Follow the established folder structure

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

This command:
1. Compiles TypeScript using `tsc -b`
2. Builds optimized production bundle with Vite
3. Outputs static files to `dist/` directory

### Preview Production Build

```bash
npm run preview
```

### Deployment

The built application in `dist/` can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3 + CloudFront**: Upload to S3 and serve via CloudFront
- **Docker**: Create a Docker image with nginx serving the static files

Example nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔧 Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` | Yes |

Example `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the application.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your PR:
- Follows the existing code style
- Includes appropriate tests (if applicable)
- Updates documentation as needed
- Has a clear description of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Aleksander Białka** - [@aleksanderbialka](https://github.com/aleksanderbialka)

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/)
- UI components styled with [TailwindCSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Made with ❤️ for the biological research community**
