CREATE TABLE `planned_transaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp),
	`date` integer,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`amount` numeric NOT NULL,
	`is_recurring` integer NOT NULL,
	`frequency` text DEFAULT 'MONTHLY',
	`executed` integer NOT NULL,
	`last_execution_date` text
);
--> statement-breakpoint
CREATE TABLE `transaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`amount` numeric NOT NULL,
	`type` text DEFAULT 'EXPENSE',
	`payment_method` text DEFAULT 'CASH'
);
