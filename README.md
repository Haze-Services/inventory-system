# Inventory Management System

A modern inventory management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Product Management**
  - Unique identifier tracking (ID)
  - Product name management
  - Multiple pricing options:
    - Real price (Precio real)
    - Purchase price (Precio compra)
    - Selling price (Precio venta)
  - Price correction functionality
  - Total profit calculation (Ganancia total)
  - Supplier information
  - Category organization
  - Stock level tracking

## Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/) (React framework with server-side rendering)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive design
- **Database**: [Your preferred database] (MongoDB/PostgreSQL/MySQL recommended)

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- [Database setup]

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/inventory-system.git
cd inventory-system
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory and add your environment variables:

```env
DATABASE_URL=your_database_connection_string
# Add other required environment variables
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Runs the development server
- `npm run build` - Builds the application for production
- `npm start` - Starts the production server
- `npm run lint` - Runs the linter
- `npm test` - Runs the test suite
