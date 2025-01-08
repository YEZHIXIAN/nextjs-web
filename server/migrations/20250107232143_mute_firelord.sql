REATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"title" text NOT NULL,
	"created" timestamp NOT NULL,
	"price" real NOT NULL
);
