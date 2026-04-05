import { Client } from 'pg';

const usersSql = `
CREATE TABLE IF NOT EXISTS users (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
username VARCHAR(255) UNIQUE NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const messagesSql = `
CREATE TABLE IF NOT EXISTS messages (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR(255) NOT NULL,
content VARCHAR(255) NOT NULL,
posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_author_id ON messages(author_id);
`;

const groupsSql = `
CREATE TABLE IF NOT EXISTS groups (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR(255) UNIQUE NOT NULL,
owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
about VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const groupMembersSql = `
CREATE TABLE IF NOT EXISTS group_members (
user_id INT NOT NULL REFERENCES users(id),
group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
`;

const groupMessagesSql = `
CREATE TABLE IF NOT EXISTS group_messages (
group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
message_id INT NOT NULL REFERENCES messages(id)
);

CREATE INDEX IF NOT EXISTS idx_group_messages_group ON group_messages(group_id);
`;

const groupAdmins = `
CREATE TABLE IF NOT EXISTS group_admins (
user_id INT NOT NULL REFERENCES users(id),
group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE
);
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to the database...');
    await client.connect();

    // create tables
    console.log('Creating users table');
    await client.query(usersSql);

    console.log('creating messages table');
    await client.query(messagesSql);

    console.log('creating groups table');
    await client.query(groupsSql);

    console.log('creating group_members table');
    await client.query(groupMembersSql);

    console.log('creating group_messages table');
    await client.query(groupMessagesSql);

    console.log('creating group_admins table');
    await client.query(groupAdmins);

    console.log('done');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
