-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "venue" TEXT NOT NULL,
    "details" TEXT,
    "images" TEXT,
    "institution" TEXT NOT NULL DEFAULT 'University',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Event" ("createdAt", "date", "details", "id", "images", "title", "venue") SELECT "createdAt", "date", "details", "id", "images", "title", "venue" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "images" TEXT,
    "author" TEXT,
    "institution" TEXT NOT NULL DEFAULT 'University',
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_News" ("author", "content", "id", "images", "publishedAt", "slug", "summary", "title") SELECT "author", "content", "id", "images", "publishedAt", "slug", "summary", "title" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
CREATE TABLE "new_Program" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "degreeType" TEXT NOT NULL,
    "duration" TEXT,
    "overview" TEXT,
    "requirements" TEXT,
    "schoolId" INTEGER NOT NULL,
    "institution" TEXT NOT NULL DEFAULT 'University',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Program_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Program" ("createdAt", "degreeType", "duration", "id", "overview", "requirements", "schoolId", "slug", "title") SELECT "createdAt", "degreeType", "duration", "id", "overview", "requirements", "schoolId", "slug", "title" FROM "Program";
DROP TABLE "Program";
ALTER TABLE "new_Program" RENAME TO "Program";
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");
CREATE TABLE "new_Vacancy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "deadline" DATETIME NOT NULL,
    "images" TEXT,
    "institution" TEXT NOT NULL DEFAULT 'University',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Vacancy" ("createdAt", "deadline", "department", "description", "id", "images", "location", "requirements", "slug", "title", "type", "updatedAt") SELECT "createdAt", "deadline", "department", "description", "id", "images", "location", "requirements", "slug", "title", "type", "updatedAt" FROM "Vacancy";
DROP TABLE "Vacancy";
ALTER TABLE "new_Vacancy" RENAME TO "Vacancy";
CREATE UNIQUE INDEX "Vacancy_slug_key" ON "Vacancy"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
