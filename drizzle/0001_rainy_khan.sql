PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_planned_transaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp),
	`date` text DEFAULT (current_timestamp),
	`category` text NOT NULL,
	`description` text NOT NULL,
	`amount` numeric NOT NULL,
	`is_recurring` integer NOT NULL,
	`frequency` text DEFAULT 'MONTHLY',
	`executed` integer NOT NULL,
	`last_execution_date` text
);
--> statement-breakpoint
INSERT INTO `__new_planned_transaction`("id", "created_at", "date", "category", "description", "amount", "is_recurring", "frequency", "executed", "last_execution_date") SELECT "id", "created_at", "date", "category", "description", "amount", "is_recurring", "frequency", "executed", "last_execution_date" FROM `planned_transaction`;--> statement-breakpoint
DROP TABLE `planned_transaction`;--> statement-breakpoint
ALTER TABLE `__new_planned_transaction` RENAME TO `planned_transaction`;--> statement-breakpoint
PRAGMA foreign_keys=ON;