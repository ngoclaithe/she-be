# she-be-backend

## Project Overview
This project is a backend application for managing personal finance, including features for user authentication, transaction management, category management, savings goals, budgets, and reporting.

## Features
- **Authentication**: User registration, login, logout, and session management.
- **Transaction Management**: Create, update, delete, and retrieve transactions.
- **Category Management**: Manage categories for income and expenses.
- **Savings Goals**: Set and track savings goals.
- **Budgeting**: Create and manage budgets.
- **Reporting**: Generate reports and statistics based on financial data.

## Project Structure
```
she-be-backend
├── src
│   ├── controllers          # Controllers for handling requests
│   ├── routes               # Route definitions
│   ├── models               # Database models
│   ├── middlewares          # Middleware functions
│   ├── services             # Business logic
│   ├── utils                # Utility functions
│   ├── types                # TypeScript types and interfaces
│   └── app.ts               # Entry point of the application
├── prisma                   # Prisma schema
├── package.json             # NPM configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd she-be-backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up the database**:
   - Configure your database connection in the `prisma/schema.prisma` file.
   - Run the following command to generate the database schema:
   ```
   npx prisma migrate dev --name init
   ```

4. **Start the application**:
   ```
   npm run dev
   ```

## API Usage
Refer to the individual route files in the `src/routes` directory for detailed API endpoint documentation. Each controller handles specific functionalities related to the endpoints.

## License
This project is licensed under the MIT License.