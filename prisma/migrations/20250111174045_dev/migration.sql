-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false
);


-- CreateTable
CREATE TABLE "ApiSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripePublishKey" TEXT NOT NULL DEFAULT '',
    "stripeSecretKey" TEXT NOT NULL DEFAULT '',
    "mayaApiKey" TEXT NOT NULL DEFAULT '',
    "mayaSecretKey" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- INSERT INTO ApiSettings (stripePublishKey, stripeSecretKey, mayaApiKey, mayaSecretKey, createdAt, updatedAt)
-- VALUES (
--     '123',
--     '123',
--     '123',
--     '123',
--     CURRENT_TIMESTAMP,
--     CURRENT_TIMESTAMP
-- );
