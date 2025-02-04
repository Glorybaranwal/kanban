import { Grid } from '@mui/material';

import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    onToggleComplete: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onDelete }) => {
    return (
        <Grid container spacing={2}>
            {todos.map((todo) => (
                <Grid item xs={12} md={4} key={todo.id}>
                    <TodoItem todo={todo} onToggleComplete={onToggleComplete} onDelete={onDelete} />
                </Grid>
            ))}
        </Grid>
    );
};

export default TodoList;
