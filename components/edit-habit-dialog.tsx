"use client";

import { useState } from "react";
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
			onOpenChange(false); // ✅ close AFTER update
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
						{/* Name */}
						<div className="space-y-2">
							<Label htmlFor="name">Habit Name *</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								disabled={isLoading}
							/>
						</div>

						{/* Category */}
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

						{/* Frequency */}
						<div className="space-y-2">
							<Label htmlFor="frequency">Frequency *</Label>
							<Select
								value={frequency}
								onValueChange={(val: "daily" | "weekly") => setFrequency(val)}
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
