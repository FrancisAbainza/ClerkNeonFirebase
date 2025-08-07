"use client"

import { InferSelectModel } from "drizzle-orm";
import { todos } from "@/db/schema";

type Todo = InferSelectModel<typeof todos>;

export default function TodoCheckbox({ todo, handleToggle }: { todo: Todo, handleToggle: (id: number, isCompleted: boolean) => void }) {
  return (
    <input
      type="checkbox"
      name="completed"
      checked={!!todo.isCompleted}
      onChange={() => handleToggle(todo.id, !todo.isCompleted)}
      className="w-8 h-8"
    />
  );
}