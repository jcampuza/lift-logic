"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

export function UserPreferences() {
  const preferences = useQuery(api.exercises.getUserPreferences);
  const updatePreferences = useMutation(api.exercises.updateUserPreferences);
  const [status, setStatus] = useState<string | null>(null);

  if (!preferences) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-24 mb-2"></div>
          <div className="h-10 bg-slate-800 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const handleWeightUnitChange = async (weightUnit: "lbs" | "kg") => {
    try {
      await updatePreferences({ weightUnit });
      setStatus("Preferences saved");
      setTimeout(() => setStatus(null), 2000);
    } catch (error) {
      console.error("Failed to update preferences:", error);
      setStatus("Failed to save preferences");
      setTimeout(() => setStatus(null), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium opacity-90 block mb-2">
          Weight Unit
        </label>
        <div className="flex gap-2">
          <button
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              preferences.weightUnit === "lbs"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-foreground hover:bg-slate-700"
            }`}
            onClick={() => handleWeightUnitChange("lbs")}
          >
            Pounds (lbs)
          </button>
          <button
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              preferences.weightUnit === "kg"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-foreground hover:bg-slate-700"
            }`}
            onClick={() => handleWeightUnitChange("kg")}
          >
            Kilograms (kg)
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`text-xs ${
            status.includes("Failed") ? "text-red-400" : "opacity-70"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}

export default UserPreferences;
