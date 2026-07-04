# Invoice API

A RESTful API for invoice management built with NestJS, TypeScript, and TypeORM.

This project was developed to practice backend architecture, business rules, authentication, data validation, and relational database modeling using modern development practices.

---

## Features

- User authentication with JWT
- Create draft invoices
- Create pending invoices
- Update invoices
- List all user invoices
- Get invoice details
- Invoice item management
- Automatic invoice code generation
- Automatic due date calculation
- Input validation using class-validator
- Swagger API documentation

---

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- SQLITE -> POSTGRESQL
- JWT Authentication
- Swagger
- class-validator
- class-transformer

---

## Project Structure

```
src/
├── auth/
├── invoices/
│   ├── controllers
│   ├── dtos
│   ├── entities
│   ├── mappers
│   ├── repositories
│   ├── services
│   └── types
├── users/
└── ...
```

---

## Business Rules

### Draft invoices

- Can contain incomplete information.
- Fields may be empty.
- Items are optional.
- Due date is recalculated when the invoice date or payment terms change.

### Pending invoices

- Require all billing information.
- Require at least one item.
- Invoice date cannot be changed after creation.
- Due date is recalculated only when payment terms change.

---

## API Documentation

Swagger is available after starting the application:

```
http://localhost:3000/api
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-user/invoice-api.git
```

Install dependencies:

```bash
npm install
```

Configure your environment variables:

```env
DATABASE_URL=
JWT_SECRET=
```

Run migrations:

```bash
npm run typeorm migration:run
```

Start the server:

```bash
npm run start:dev
```

---

## Future Improvements

- Unit tests
- Integration tests
- Docker support
- CI/CD pipeline
- Pagination
- Filtering and sorting
- PDF generation
- Email notifications

---

## Learning Goals

This project was built to improve knowledge in:

- REST API design
- Backend architecture
- Authentication & Authorization
- DTO validation
- Database relationships
- Business logic organization
- Repository pattern
- Clean code principles

---

## License

This project is available under the MIT License.