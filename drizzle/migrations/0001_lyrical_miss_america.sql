CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text(255) NOT NULL,
	`answer` text(255) NOT NULL,
	`userId` integer NOT NULL,
	`processingTime` integer NOT NULL,
	`modelUsed` text(255) NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
