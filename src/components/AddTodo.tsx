import { useState } from 'react';
import { TextField, Button } from '@mui/material';

interface AddTodoProps {
    onAdd: (todo: string) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
    const [newTodo, setNewTodo] = useState('');

    const handleAdd = () => {
        if (newTodo.trim()) {
            onAdd(newTodo);
            setNewTodo('');
        }
    };

    return (
        <>
            <TextField
                label="New Todo"
                variant="outlined"
                fullWidth
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAdd}>
                Add Todo
            </Button>
        </>
    );
};

export default AddTodo;
