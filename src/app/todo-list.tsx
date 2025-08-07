import { toggleTodoCompleted } from "./actions";
import { InferSelectModel } from "drizzle-orm";
import { todos } from "@/db/schema";
import EditTodoButton from "./edit-todo-button";
import TodoCheckbox from "../components/todo-checkbox";
import DeleteTodoButton from "./delete-todo-button";
import Image from "next/image";

type Todo = InferSelectModel<typeof todos>;

export default function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 m-3">
      {todos.map((todo: Todo) => (
        <div key={todo.id} className="flex justify-between items-center border p-4 rounded-md">
          <div>
            {todo.images?.[0] && (
              <div className="relative w-full h-[200px]">

                <Image
                  src={todo.images[0]}
                  alt="todo image"
                  fill
                  sizes="100%"
                  priority
                  className="object-cover"
                />
              </div>
            )}
            <h2>{todo.title}</h2>
            <p>{todo.updatedAt.toLocaleDateString()}</p>
            <p>{todo.description}</p>
            <div className="flex gap-3">
              <EditTodoButton
                defaultValues={{
                  title: todo.title,
                  description: todo.description,
                  images: todo.images
                }}
                id={todo.id}
              />
              <DeleteTodoButton id={todo.id} />
            </div>
          </div>
          <TodoCheckbox todo={todo} handleToggle={toggleTodoCompleted} />
        </div>
      ))}
    </div>
  )
}