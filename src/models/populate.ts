import { Client } from 'pg';

const usersSql = `
CREATE TABLE users (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
username VARCHAR(255) UNIQUE NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const messagesSql = `
CREATE TABLE messages (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(255) NOT NULL,
content VARCHAR(255) NOT NULL,
posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_author_id ON messages(author_id);
`;

const groupsSql = `
CREATE TABLE groups (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR(255) UNIQUE NOT NULL,
owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const groupMembersSql = `
CREATE TABLE group_members (
user_id INT NOT NULL REFERENCES users(id),
group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE
);

CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);
`;

const groupAdmins = `
CREATE TABLE group_admins (
user_id INT NOT NULL REFERENCES users(id),
group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE
);
`;

async function main() {
  console.log('Start seeding...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // create tables
    await client.query(usersSql);
    await client.query(messagesSql);
    await client.query(groupsSql);
    await client.query(groupMembersSql);
    await client.query(groupAdmins);

    console.log('done');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
