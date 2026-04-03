# Members Only

This site is developed for education purpose as part of the [The Odin Project](https://www.theodinproject.com) NodeJS course.

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

## Tech Stacks

- TypeScript
- Node.js
- Express.js
- Passport.js for authentication
- EJS for templating
- PostgreSQL for database
- CSS3

## Installation

1. clone the repository:

```bash
git clone https://github.com/SaleamlakH/members-only.git
cd members-only
```

2. install all dependencies:

```bash
npm install
```

3. setup environment variables:

```bash
NODE_ENV=(dev | prod)
DATABASE_URL=your_database_url
SESSION_SECRET=your_secret_key
```

4. Run dev server:

```bash
npm run dev
```

## Project Structure

Follows MVC architecture:

- controllers/ — request handling logic
- models/ — database schema and queries
- routes/ — route definitions
- views/ — EJS templates

## Database Schema

### Tables

- **users**
  - id
  - username
  - email
  - password
  - created_at
- **messages**
  - id
  - title
  - content
  - posted_at
  - updated_at
  - author_id
- **Groups**
  - id
  - name
  - owner_id
  - created_at
- **group_members**
  - user_id
  - group_id
- **group_admins**
  - user_id
  - group_id

## License

This project is licensed under the MIT License.
