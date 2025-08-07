import { getTodos } from "./actions";
import AddTodoButton from "./add-todo-button";
import TodoList from "./todo-list";

export default async function Home() {
  const todos = await getTodos();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Todo List App</h1>
      <AddTodoButton />
      <TodoList todos={todos} />
    </div>
  );
}