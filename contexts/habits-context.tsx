// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import { api, ApiError } from "@/lib/api"
// import { useAuth } from "./auth-context"

// export interface Habit {
//   id: string
//   name: string
//   description?: string
//   category: string
//   frequency: "daily" | "weekly"
//   targetDays?: number[] // For weekly habits: 0=Sunday, 1=Monday, etc.
//   streak: number
//   longestStreak: number
//   completedToday: boolean
//   completedDates: string[] // ISO date strings
//   createdAt: string
//   updatedAt: string
// }

// interface HabitsContextType {
//   habits: Habit[]
//   isLoading: boolean
//   error: string | null
//   addHabit: (
//     habit: Omit<
//       Habit,
//       "id" | "streak" | "longestStreak" | "completedToday" | "completedDates" | "createdAt" | "updatedAt"
//     >,
//   ) => Promise<void>
//   updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
//   deleteHabit: (id: string) => Promise<void>
//   toggleHabitCompletion: (id: string, date?: string) => Promise<void>
//   getHabitRecords: (id: string, from?: string, to?: string) => Promise<any[]>
//   getHabitProgress: (id: string) => number
//   getTodaysCompletedCount: () => number
//   getLongestStreak: () => number
//   refreshHabits: () => Promise<void>
// }

// const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

// export function HabitsProvider({ children }: { children: ReactNode }) {
//   const [habits, setHabits] = useState<Habit[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const { isAuthenticated } = useAuth()

//   useEffect(() => {
//     if (isAuthenticated) {
//       refreshHabits()
//     } else {
//       setHabits([])
//       setIsLoading(false)
//     }
//   }, [isAuthenticated])

//   const refreshHabits = async () => {
//     if (!isAuthenticated) return

//     setIsLoading(true)
//     setError(null)
//     try {
//       const habitsData = await api.habits.list()
//       // Transform API data to match frontend interface if needed
//       setHabits(habitsData)
//     } catch (error) {
//       if (error instanceof ApiError) {
//         setError(error.message)
//       } else {
//         setError("Failed to load habits")
//       }
//       console.error("Failed to load habits:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const addHabit = async (
//     habitData: Omit<
//       Habit,
//       "id" | "streak" | "longestStreak" | "completedToday" | "completedDates" | "createdAt" | "updatedAt"
//     >,
//   ) => {
//     setError(null)
//     try {
//       const newHabit = await api.habits.create(habitData)
//       setHabits((prev) => [...prev, newHabit])
//     } catch (error) {
//       if (error instanceof ApiError) {
//         setError(error.message)
//       } else {
//         setError("Failed to create habit")
//       }
//       throw error
//     }
//   }

//   const updateHabit = async (id: string, updates: Partial<Habit>) => {
//     setError(null)
//     try {
//       const updatedHabit = await api.habits.update(id, updates)
//       setHabits((prev) => prev.map((habit) => (habit.id === id ? updatedHabit : habit)))
//     } catch (error) {
//       if (error instanceof ApiError) {
//         setError(error.message)
//       } else {
//         setError("Failed to update habit")
//       }
//       throw error
//     }
//   }

//   const deleteHabit = async (id: string) => {
//     setError(null)
//     try {
//       await api.habits.delete(id)
//       setHabits((prev) => prev.filter((habit) => habit.id !== id))
//     } catch (error) {
//       if (error instanceof ApiError) {
//         setError(error.message)
//       } else {
//         setError("Failed to delete habit")
//       }
//       throw error
//     }
//   }

//   const toggleHabitCompletion = async (id: string, date?: string) => {
//     setError(null)
//     try {
//       await api.habits.checkin(id, date)
//       // Refresh habits to get updated data from server
//       await refreshHabits()
//     } catch (error) {
//       if (error instanceof ApiError) {
//         setError(error.message)
//       } else {
//         setError("Failed to update habit completion")
//       }
//       throw error
//     }
//   }

//   const getHabitRecords = async (id: string, from?: string, to?: string) => {
//     setError(null)
//     try {
//       return await api.habits.records(id, from, to)
//     } catch (error) {
//       if (error instanceof ApiError) {
//         setError(error.message)
//       } else {
//         setError("Failed to load habit records")
//       }
//       throw error
//     }
//   }

//   const getHabitProgress = (id: string): number => {
//     const habit = habits.find((h) => h.id === id)
//     if (!habit) return 0

//     const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
//     const completedThisMonth = habit.completedDates.filter((date) => {
//       const completedDate = new Date(date)
//       const now = new Date()
//       return completedDate.getMonth() === now.getMonth() && completedDate.getFullYear() === now.getFullYear()
//     }).length

//     return Math.round((completedThisMonth / daysInMonth) * 100)
//   }

//   const getTodaysCompletedCount = (): number => {
//     return habits.filter((habit) => habit.completedToday).length
//   }

//   const getLongestStreak = (): number => {
//     return Math.max(...habits.map((habit) => habit.longestStreak), 0)
//   }

//   const value: HabitsContextType = {
//     habits,
//     isLoading,
//     error,
//     addHabit,
//     updateHabit,
//     deleteHabit,
//     toggleHabitCompletion,
//     getHabitRecords,
//     getHabitProgress,
//     getTodaysCompletedCount,
//     getLongestStreak,
//     refreshHabits,
//   }

//   return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
// }

// export function useHabits() {
//   const context = useContext(HabitsContext)
//   if (context === undefined) {
//     throw new Error("useHabits must be used within a HabitsProvider")
//   }
//   return context
// }


"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "./auth-context";

export interface Habit {
	id: string;
	name: string;
	description?: string;
	category: string;
	frequency: "daily" | "weekly";
	targetDays?: number[]; // For weekly habits: 0=Sunday, 1=Monday, etc.
	streak: number;
	longestStreak: number;
	completedToday: boolean;
	completedDates: string[]; // ISO date strings
	createdAt: string;
	updatedAt: string;
}

interface HabitsContextType {
	habits: Habit[];
	isLoading: boolean;
	error: string | null;
	addHabit: (
		habit: Omit<
			Habit,
			| "id"
			| "streak"
			| "longestStreak"
			| "completedToday"
			| "completedDates"
			| "createdAt"
			| "updatedAt"
		>
	) => Promise<void>;
	updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
	deleteHabit: (id: string) => Promise<void>;
	toggleHabitCompletion: (id: string, date?: string) => Promise<void>;
	getHabitRecords: (id: string, from?: string, to?: string) => Promise<any[]>;
	getHabitProgress: (id: string) => number;
	getTodaysCompletedCount: () => number;
	getLongestStreak: () => number;
	refreshHabits: () => Promise<void>;
}

function transformHabit(apiHabit: any): Habit {
	return {
		id: String(apiHabit.id),
		name: apiHabit.name,
		description: apiHabit.description ?? "",
		category: apiHabit.category ?? "general",
		frequency: apiHabit.frequency ?? "daily",
		targetDays: apiHabit.targetDays ?? [],
		streak: apiHabit.streak ?? 0,
		longestStreak: apiHabit.longestStreak ?? 0,
		completedToday: apiHabit.completedToday ?? false,
		completedDates: apiHabit.completedDates ?? [],
		createdAt: apiHabit.createdAt,
		updatedAt: apiHabit.updatedAt,
	};
}


const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: ReactNode }) {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			refreshHabits();
		} else {
			setHabits([]);
			setIsLoading(false);
		}
	}, [isAuthenticated]);

	const refreshHabits = async () => {
		if (!isAuthenticated) return;

		setIsLoading(true);
		setError(null);
		try {
			const habitsData = await api.habits.list();
			// Transform API data to match frontend interface if needed
			setHabits(habitsData.map(transformHabit));
		} catch (error) {
			if (error instanceof ApiError) {
				setError(error.message);
			} else {
				setError("Failed to load habits");
			}
			console.error("Failed to load habits:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const addHabit = async (
		habitData: Omit<
			Habit,
			| "id"
			| "streak"
			| "longestStreak"
			| "completedToday"
			| "completedDates"
			| "createdAt"
			| "updatedAt"
		>
	) => {
		setError(null);
		try {
			const newHabit = await api.habits.create(habitData);
      setHabits((prev) => [...prev, transformHabit(newHabit)]);
      await refreshHabits();
		} catch (error) {
			if (error instanceof ApiError) {
				setError(error.message);
			} else {
				setError("Failed to create habit");
			}
			throw error;
		}
	};

	const updateHabit = async (id: string, updates: Partial<Habit>) => {
		setError(null);
		try {
			const updatedHabit = await api.habits.update(id, updates);
			setHabits((prev) =>
				prev.map((habit) =>
					habit.id === id ? transformHabit(updatedHabit) : habit
				)
			);
		} catch (error) {
			if (error instanceof ApiError) {
				setError(error.message);
			} else {
				setError("Failed to update habit");
			}
			throw error;
		}
	};

	const deleteHabit = async (id: string) => {
		setError(null);
		try {
			await api.habits.delete(id);
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
		} catch (error) {
			if (error instanceof ApiError) {
				setError(error.message);
			} else {
				setError("Failed to delete habit");
			}
			throw error;
		}
	};

	const toggleHabitCompletion = async (id: string, date?: string) => {
		setError(null);
		try {
			await api.habits.checkin(id, date);
			// Refresh habits to get updated data from server
			await refreshHabits();
		} catch (error) {
			if (error instanceof ApiError) {
				setError(error.message);
			} else {
				setError("Failed to update habit completion");
			}
			throw error;
		}
	};

	const getHabitRecords = async (id: string, from?: string, to?: string) => {
		setError(null);
		try {
			return await api.habits.records(id, from, to);
		} catch (error) {
			if (error instanceof ApiError) {
				setError(error.message);
			} else {
				setError("Failed to load habit records");
			}
			throw error;
		}
	};

	const getHabitProgress = (id: string): number => {
		const habit = habits.find((h) => h.id === id);
		if (!habit) return 0;

		const daysInMonth = new Date(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			0
		).getDate();
		const completedThisMonth = habit.completedDates.filter((date) => {
			const completedDate = new Date(date);
			const now = new Date();
			return (
				completedDate.getMonth() === now.getMonth() &&
				completedDate.getFullYear() === now.getFullYear()
			);
		}).length;

		return Math.round((completedThisMonth / daysInMonth) * 100);
	};

	const getTodaysCompletedCount = (): number => {
		return habits.filter((habit) => habit.completedToday).length;
	};

	const getLongestStreak = (): number => {
		return Math.max(...habits.map((habit) => habit.longestStreak), 0);
	};

	const value: HabitsContextType = {
		habits,
		isLoading,
		error,
		addHabit,
		updateHabit,
		deleteHabit,
		toggleHabitCompletion,
		getHabitRecords,
		getHabitProgress,
		getTodaysCompletedCount,
		getLongestStreak,
		refreshHabits,
	};

	return (
		<HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
	);
}

export function useHabits() {
	const context = useContext(HabitsContext);
	if (context === undefined) {
		throw new Error("useHabits must be used within a HabitsProvider");
	}
	return context;
}
