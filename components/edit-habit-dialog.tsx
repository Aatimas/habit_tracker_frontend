"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useHabits, type Habit } from "@/contexts/habits-context";

const categories = [
	"Health",
	"Learning",
	"Productivity",
	"Fitness",
	"Mindfulness",
	"Social",
	"Creative",
	"Finance",
	"Other",
];

interface EditHabitDialogProps {
	habit: Habit;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({
	habit,
	open,
	onOpenChange,
}: EditHabitDialogProps) {
	const [name, setName] = useState(habit.name);
	const [description, setDescription] = useState(habit.description || "");
	const [category, setCategory] = useState(habit.category);
	const [frequency, setFrequency] = useState<"daily" | "weekly">(
		habit.frequency
	);
	const [isLoading, setIsLoading] = useState(false);

	const { updateHabit } = useHabits();

	// 🔑 Reset form each time the dialog opens with fresh habit data
	useEffect(() => {
		if (open) {
			setName(habit.name);
			setDescription(habit.description || "");
			setCategory(habit.category);
			setFrequency(habit.frequency);
		}
	}, [open, habit]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		setIsLoading(true);
		try {
			await updateHabit(habit.id, {
				name: name.trim(),
				description: description.trim() || undefined,
				category,
				frequency,
			});
			// ✅ close immediately after update succeeds
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to update habit:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Habit</DialogTitle>
					<DialogDescription>
						Update your habit details. Changes will be saved immediately.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Habit Name *</Label>
							<Input
								id="name"
								placeholder="e.g., Exercise for 30 minutes"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Optional: Add more details about your habit"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								disabled={isLoading}
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="category">Category *</Label>
							<Select
								value={category}
								onValueChange={setCategory}
								disabled={isLoading}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((cat) => (
										<SelectItem key={cat} value={cat}>
											{cat}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="frequency">Frequency *</Label>
							<Select
								value={frequency}
								onValueChange={(value: "daily" | "weekly") =>
									setFrequency(value)
								}
								disabled={isLoading}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="daily">Daily</SelectItem>
									<SelectItem value="weekly">Weekly</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || !name.trim() || !category}
						>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
