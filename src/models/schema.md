# Database Schema

All tables are created and initialized using the `populate.ts` script, which contains the SQL queries with all data types, constraints, and relationships.

Here are all tables with their column lists.
For full column types, constraints, and relationships, refer to [populate.ts](populate.ts).

## Tables

### users

- id
- username
- email
- password
- created_at

### messages

- id
- content
- posted_at
- updated_at
- author_id

### groups

- id
- name
- owner_id
- created_at

### group_members

- user_id
- group_id

### group_messages

- group_id
- message_id

### group_admins

- user_id
- group_id
