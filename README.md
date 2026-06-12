# RoadMap

## Initial Setup

- [x] Created nest project
- [x] TypeScript configuration
- [x] TypeORM configuration
- [x] SQLite configuration
- [x] Project module structure


## Users Module

### Entity
- [x] Create User Entity
- [x] Add timestamps (createdAt, updatedAt)
- [ ] Create necessary indexes

### Dtos
- [x] createUserDto
- [x] findUserParamDto
- [x] updateUserDto
- [x] userResponseDto
- [] create mapper for safer DTO usage

### Controller

- [x] POST /users

- [x] Validate request body with DTO

- [x] Create Swagger documentation

- [x] Return UserResponseDto

- [x] GET /users

- [x] List users

- [ ] Pagination

- [x] GET /users/:id

- [x] Validate id

- [x] Return user by id

- [x] PATCH /users/:id

- [x] Update user

- [x] Validate input data

- [x] DELETE /users/:id

- [x] Remove user

### Service and Business rules

- [] implement user CRUD service
- [] Handle errors properly
- [] Apply repository contract (DI for User repository)

### Database

- [x] create entity User
- [] create migrations
- [] create seed data for testing
- [] create abstract UsersRepository with required methods
- [] create TypeOrmUsersRepository implementing UsersRepository

### Swagger

- [x] Swagger configuration
- [x] Document all users DTOs
- [x] add request/response examples
- [x] organize tags per module (ex: @ApiTags('users'))


--- 

### Security

- [] implement JWT authentication
- [] implement login
- [] crete contract for password hashing and user identity rules 
- [] create Guards
- [] define roles and permissions


### tests

- [] unit tests for services
- [] controller tests
- [] integration tests for API

### Infrastructure (docker)

- [] implement docker
- [] Docker with PostgresSQL
- [] create docker-compose
- [] configuration environment variables 

### Production

- [] configuration production environment variables 
- [] configuration logging
- [] deploy API
- [] configure CI/CD



----

next steps: 
Usersrepository and service | class hashed | add column token in User entity
