# Members Only

This site is developed for education purpose as part of the [The Odin Project](https://www.theodinproject.com) NodeJS course.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Implementation details](#implementation-details)
- [Key Design Decisions](#key-design-decisions)
- [Project Structure](#project-structure)
- [Routes (Endpoints)](#routes-endpoints)
- [Database Schema](#database-schema)
- [Installation Guides](#installation)

## Overview

Members Only is a group-based text posting platform where all users can read messages but only members can see the author and posting date.

This is a full-stack Node.js application built using the MVC design pattern.

## Features

- User authentication (sing up, log in)
- Create or Join groups
- Post text based messages in groups
- messages are visible for all users
- Authors and timestamps are visible only to group members
- Group owners can delete groups
- Group owners and admins can:
  - Delete messages
  - Edit group "About" section
- Messages authors can edit or delete their own messages

## Tech Stack

- TypeScript
- Node.js
- Express.js
- Express Validator
- Passport.js for authentication
- EJS for templating
- PostgreSQL for database
- CSS3

## Implementation details

- Server-side form validation using Express Validator.
- Parameterized queries to prevent SQL injection.
- Transactions for multi-step database operations.

## Key Design Decisions

- User identity resolved from session instead of passing userId in routes.
- Role-based permissions (owner, admin, member) control access.
- Foreign key constraints with ON DELETE CASCADE for referential integrity.

## Project Structure

Follows MVC architecture:

- controllers/ request handling logic
- models/ — database schema and queries
- routes/ — route definitions
- views/ — EJS templates

## Routes (Endpoints)

### Root

- GET / - Render the home page with login and signup views. The views are conditionally displayed on the client using JavaScript.

### Auth

- GET /signup - render signup form
- POST /signup - Create a new account
- GET /login - render login form
- POST /login - Authenticate user
- GET /logout - logout a user and redirect to home

### Users

All user routes require authentication. The user is resolved from the session.

- GET /users/profile - view current user profile
- GET /users/settings - view user settings
- PUT /users/settings/profile - Update profile information
- PUT /users/settings/password - Update password
- DELETE /users - Delete current user

### Groups

Creating groups and posting messages require authentication.

- GET /groups - view all group lists
- GET /groups/create - render form to create group
- POST /groups/create - Create a new group
- GET /groups/:groupId - View a group
- POST /groups/:groupId - Post a message to a group

## Database Schema

This project uses PostgreSQL for data storage. All tables are created and initialized using the `populate.ts` script, which contains the SQL queries to create the tables with their respective constraints (primary keys, foreign keys, and cascading rules).

The database consists of the following tables:

### Tables

- **users**: stores user accounts
- **messages**: stores messages posted by users
- **groups**: stores groups created by users
- **group_members**: join table connecting users and groups
- **group_messages**: join table connecting groups and messages
- **group_admins**: join table for group admin privileges

Refer:

- [schema.md](src/models/schema.md) for full table column list.
- [populate.ts](src/models/populate.ts) for full column types, constraints, and relationships.

## Installation Guides

1. clone the repository:

```bash
git clone https://github.com/SaleamlakH/members-only.git
cd members-only
```

2. create tables

```bash
npm run create-tables
```

3. install all dependencies:

```bash
npm install
```

4. setup environment variables:

```bash
NODE_ENV=(dev | prod)
DATABASE_URL=your_database_url
SESSION_SECRET=your_secret_key
```

5. Run dev server:

```bash
npm run dev
```

## License

This project is licensed under the MIT License.
