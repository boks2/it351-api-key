CREATE TABLE "it351-api-keyapi_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"hashed_key" text NOT NULL,
	"last4" varchar(4) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DROP TABLE "it351-api-key_api_keys" CASCADE;