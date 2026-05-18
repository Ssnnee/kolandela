// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';

const m0000 = `CREATE TABLE \`categories\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`name\` text NOT NULL,
	\`color\` text NOT NULL,
	\`icon\` text,
	\`type\` text NOT NULL,
	\`is_default\` integer DEFAULT false NOT NULL,
	\`is_deleted\` integer DEFAULT false NOT NULL,
	\`deleted_at\` integer,
	\`created_at\` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`categories_name_type_unique\` ON \`categories\` (\`name\`,\`type\`);--> statement-breakpoint
CREATE TABLE \`planned_transaction_executions\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`planned_transaction_id\` text NOT NULL,
	\`transaction_id\` text NOT NULL,
	\`scheduled_date\` integer NOT NULL,
	\`executed_at\` integer,
	\`status\` text DEFAULT 'EXECUTED' NOT NULL,
	\`grace_period_days\` integer DEFAULT 3 NOT NULL,
	\`notes\` text,
	FOREIGN KEY (\`planned_transaction_id\`) REFERENCES \`planned_transactions\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`transaction_id\`) REFERENCES \`transactions\`(\`id\`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX \`execution_planned_idx\` ON \`planned_transaction_executions\` (\`planned_transaction_id\`);--> statement-breakpoint
CREATE INDEX \`execution_transaction_idx\` ON \`planned_transaction_executions\` (\`transaction_id\`);--> statement-breakpoint
CREATE INDEX \`execution_date_idx\` ON \`planned_transaction_executions\` (\`executed_at\`);--> statement-breakpoint
CREATE INDEX \`execution_status_idx\` ON \`planned_transaction_executions\` (\`status\`);--> statement-breakpoint
CREATE TABLE \`planned_transactions\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`category_id\` text NOT NULL,
	\`description\` text NOT NULL,
	\`amount\` integer NOT NULL,
	\`type\` text NOT NULL,
	\`recurring\` integer DEFAULT false NOT NULL,
	\`frequency\` text NOT NULL,
	\`start_date\` integer NOT NULL,
	\`end_date\` integer,
	\`next_execution_date\` integer,
	\`is_active\` integer DEFAULT true NOT NULL,
	\`is_deleted\` integer DEFAULT false NOT NULL,
	\`deleted_at\` integer,
	\`created_at\` integer,
	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX \`planned_category_idx\` ON \`planned_transactions\` (\`category_id\`);--> statement-breakpoint
CREATE INDEX \`planned_next_execution_idx\` ON \`planned_transactions\` (\`next_execution_date\`);--> statement-breakpoint
CREATE INDEX \`planned_active_idx\` ON \`planned_transactions\` (\`is_active\`);--> statement-breakpoint
CREATE INDEX \`planned_deleted_idx\` ON \`planned_transactions\` (\`is_deleted\`);--> statement-breakpoint
CREATE TABLE \`transactions\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`planned_transaction_id\` text,
	\`category_id\` text NOT NULL,
	\`description\` text NOT NULL,
	\`amount\` integer NOT NULL,
	\`type\` text NOT NULL,
	\`payment_method\` text NOT NULL,
	\`payment_details\` text,
	\`transaction_date\` integer NOT NULL,
	\`is_deleted\` integer DEFAULT false NOT NULL,
	\`deleted_at\` integer,
	\`created_at\` integer,
	FOREIGN KEY (\`planned_transaction_id\`) REFERENCES \`transactions\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX \`transaction_category_idx\` ON \`transactions\` (\`category_id\`);--> statement-breakpoint
CREATE INDEX \`transaction_date_idx\` ON \`transactions\` (\`transaction_date\`);--> statement-breakpoint
CREATE INDEX \`transaction_type_idx\` ON \`transactions\` (\`type\`);--> statement-breakpoint
CREATE INDEX \`transaction_planned_idx\` ON \`transactions\` (\`planned_transaction_id\`);--> statement-breakpoint
CREATE INDEX \`transaction_deleted_idx\` ON \`transactions\` (\`is_deleted\`);`;

export default {
  journal,
  migrations: {
    m0000,
  },
};
