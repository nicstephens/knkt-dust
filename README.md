[![](https://dcbadge.vercel.app/api/server/8NJR3zQU5X?compact=true&style=flat)](https://discord.gg/8NJR3zQU5X) [![Twitter](https://img.shields.io/twitter/url.svg?label=Follow%20%40dust4ai&style=social&url=https%3A%2F%2Ftwitter.com-dust4ai)](https://twitter.com/dust4ai)

# [Dust](https://dust.tt)

Design and Deploy Large Language Model Apps

## :book: Documentation Portal

- [LLM apps Primer](https://docs.dust.tt/introduction)
- [Platform overview](https://docs.dust.tt/overview)
- [Blocks documentation](https://docs.dust.tt/core-blocks)
- [Getting started guide](https://docs.dust.tt/quickstart)
- [Runs API Reference](https://docs.dust.tt/runs)

### Questions / Help

Join our [Discord](https://discord.gg/8NJR3zQU5X).

## Setup Environment 

### SQL Tables Creation 

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "provider" TEXT NOT NULL CHECK (provider IN ('github', 'google')),
  "providerId" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL
);

CREATE INDEX "username_index" ON "users"("username");
CREATE INDEX "provider_providerId_index" ON "users"("provider", "providerId");

CREATE TABLE "workspaces" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "uId" TEXT NOT NULL,
  "sId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "allowedDomain" TEXT,
  "type" TEXT NOT NULL CHECK (type IN ('personal', 'team')),
  "plan" TEXT
);

CREATE UNIQUE INDEX "sId_index" ON "workspaces"("sId");

CREATE TABLE "memberships" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "role" TEXT NOT NULL CHECK (role IN ('admin', 'builder', 'user', 'revoked')),
  "userId" INTEGER REFERENCES "user"("id"),
  "workspaceId" INTEGER REFERENCES "workspace"("id")
);

CREATE INDEX "userId_role_index" ON "memberships"("userId", "role");

CREATE TABLE "apps" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "uId" TEXT NOT NULL,
  "sId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "visibility" TEXT NOT NULL CHECK (visibility IN ('public', 'private', 'unlisted', 'deleted')),
  "savedSpecification" TEXT,
  "savedConfig" TEXT,
  "savedRun" TEXT,
  "dustAPIProjectId" TEXT NOT NULL,
  "workspaceId" INTEGER REFERENCES "workspace"("id")
);


CREATE UNIQUE INDEX "sId_index" ON "app"("sId");
CREATE INDEX "workspaceId_visibility_index" ON "app"("workspaceId", "visibility");
CREATE INDEX "workspaceId_sId_visibility_index" ON "app"("workspaceId", "sId", "visibility");

CREATE TABLE "providers" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "providerId" TEXT NOT NULL,
  "config" TEXT NOT NULL,
  "workspaceId" INTEGER REFERENCES "workspace"("id")
);

CREATE INDEX "workspaceId_index" ON "provider"("workspaceId");

CREATE TABLE "datasets" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "workspaceId" INTEGER REFERENCES "workspace"("id"),
  "appId" INTEGER REFERENCES "app"("id")
);

CREATE INDEX "workspaceId_appId_name_index" ON "dataset"("workspaceId", "appId", "name");

CREATE TABLE "clones" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fromId" INTEGER REFERENCES "app"("id"),
  "toId" INTEGER REFERENCES "app"("id")
);

CREATE TABLE "keys" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "secret" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "isSystem" BOOLEAN NOT NULL DEFAULT FALSE,
  "workspaceId" INTEGER REFERENCES "workspace"("id")
);

CREATE TABLE "data_sources" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "visibility" TEXT NOT NULL,
  "config" TEXT,
  "dustAPIProjectId" TEXT NOT NULL,
  "connectorId" TEXT,
  "connectorProvider" TEXT,
  "workspaceId" INTEGER REFERENCES "workspace"("id")
);

CREATE TABLE "runs" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dustRunId" TEXT NOT NULL,
  "runType" TEXT NOT NULL,
  "appId" INTEGER REFERENCES "app"("id"),
  "workspaceId" INTEGER REFERENCES "workspace"("id")
);

-- keys
CREATE UNIQUE INDEX "secret_index" ON "keys"("secret");
CREATE INDEX "workspaceId_index" ON "keys"("workspaceId");

-- data_source
CREATE INDEX "workspaceId_visibility_index" ON "data_sources"("workspaceId", "visibility");
CREATE INDEX "workspaceId_name_visibility_index" ON "data_source"("workspaceId", "name", "visibility");
CREATE UNIQUE INDEX "workspaceId_name_index" ON "data_sources"("workspaceId", "name");

-- run
CREATE INDEX "workspaceId_appId_runType_index" ON "runs"("workspaceId", "appId", "runType");
CREATE UNIQUE INDEX "dustRunId_index" ON "runs"("dustRunId");
