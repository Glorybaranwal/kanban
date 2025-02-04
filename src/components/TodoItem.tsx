import { Checkbox, Card, CardContent, Typography, Button } from '@mui/material';
import { Todo } from '../types/todo';

interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{todo.todo}</Typography>
                <Checkbox checked={todo.completed} onChange={() => onToggleComplete(todo.id, !todo.completed)} />
                <Button color="secondary" onClick={() => onDelete(todo.id)}>Delete</Button>
            </CardContent>
        </Card>
    );
};

export default TodoItem;
