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
	DialogTrigger,
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
import { Plus } from "lucide-react";
import { useHabits } from "@/contexts/habits-context";

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

export function AddHabitDialog() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
	const [isLoading, setIsLoading] = useState(false);

	const { addHabit } = useHabits();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !category) return;

		setIsLoading(true);
		try {
			await addHabit({
				name: name.trim(),
				description: description.trim() || undefined,
				category,
				frequency,
			});

			// reset form + close dialog
			setName("");
			setDescription("");
			setCategory("");
			setFrequency("daily");
			setOpen(false);
		} catch (error) {
			console.error("Failed to add habit:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Add Habit
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Habit</DialogTitle>
					<DialogDescription>
						Create a new habit to track. Choose a clear, specific goal you can
						measure daily.
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
								placeholder="e.g., Exercise for 30 minutes"
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
								placeholder="Optional: Add more details"
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
							onClick={() => setOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || !name.trim() || !category}
						>
							{isLoading ? "Creating..." : "Create Habit"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
