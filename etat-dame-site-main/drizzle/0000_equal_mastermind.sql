CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`menu_item_id` text,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`garniture` text,
	`status` text DEFAULT 'en_attente' NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`status` text DEFAULT 'recue' NOT NULL,
	`type` text NOT NULL,
	`table_number` text,
	`pickup_label` text,
	`notes` text,
	`problem_flag` integer DEFAULT false NOT NULL,
	`problem_note` text,
	`total_cents` integer NOT NULL,
	`received_at` text DEFAULT (current_timestamp) NOT NULL,
	`started_at` text,
	`ready_at` text,
	`completed_at` text,
	`cancelled_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_reference_unique` ON `orders` (`reference`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`email` text,
	`password_hash` text,
	`pin_hash` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);