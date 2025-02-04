import { Todo } from '../types/todo';

const API_BASE = 'https://dummyjson.com/todos';

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(API_BASE);
  const data = await res.json();
  return data.todos;
};

export const addTodo = async (todo: string): Promise<Todo> => {
  const res = await fetch(`${API_BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo, completed: false, userId: 1 }),
  });
  return res.json();
};

export const updateTodo = async (id: number, completed: boolean): Promise<Todo> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  return res.json();
};

export const deleteTodo = async (id: number): Promise<Todo> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
