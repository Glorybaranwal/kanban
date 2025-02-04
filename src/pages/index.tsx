import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '@components/utils/api';
import TodoList from '../components/TodoList';
import AddTodo from '../components/AddTodo';
import { Todo } from '../types/todo';
import KanbanBoard from '@components/components/KanbanBoard';

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  const handleAddTodo = async (todo: string) => {
    const newTodo = await addTodo(todo);
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    await updateTodo(id, completed);
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Container>
      {/* <Typography variant="h4" align="center" gutterBottom>
        Kanban Board
      </Typography>
      <AddTodo onAdd={handleAddTodo} />
      <TodoList todos={todos} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTodo} /> */}
      <KanbanBoard />
    </Container>
  );
};

export default Home;
