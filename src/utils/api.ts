import { Todo , Task} from '../types/todo';

const API_BASE = 'https://dummyjson.com/todos';

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(API_BASE);
  const data = await res.json();
  return data.todos;
};

export const addTodo = async (task: Task): Promise<Todo> => {
  console.log("task", task)
  const res = await fetch(`${API_BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, userId: 1 }),
  });
  return res.json();
};

export const updateTodo = async (id: number, completed: boolean, todo: string): Promise<Todo> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({todo, completed }),
  });
  return res.json();
};

export const deleteTodo = async (id: number): Promise<Todo> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
