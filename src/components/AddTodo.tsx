import { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import { addTodo } from "@components/utils/api";

interface Task {
    id: number;
    todo: string;
    completed: boolean;
    status: "todo" | "in-progress" | "done";
}

interface AddTodoProps {
    onAddTask: (task: Task) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAddTask }) => {
    const [newTodo, setNewTodo] = useState("");

    const handleAdd = () => {
        if (newTodo.trim()) {
            const newTaskObj: Task = {
                id: Date.now(),
                todo: newTodo,
                completed: false,
                status: "todo",
            };
            addTodo(newTaskObj);
            onAddTask(newTaskObj);
            setNewTodo("");
        }
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
                <TextField
                    label="New Task"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={2}>
                <Button onClick={handleAdd} variant="contained" fullWidth>
                    Add Task
                </Button>
            </Grid>
        </Grid>
    );
};

export default AddTodo;
