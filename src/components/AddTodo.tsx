import { useState } from "react";
import { Button, Grid, TextField, Tooltip } from "@mui/material";
import { useTasks } from "@components/context/task"; // Import useTasks hook
import { Task } from "@components/types/todo";

interface AddTodoProps {
    onAddTask: (task: Task) => void;  // Define the prop type explicitly
}

const AddTodo: React.FC<AddTodoProps> = ({ onAddTask }) => { // Use the interface for props
    const [todoContent, setTodoContent] = useState("");
    const { addTask } = useTasks(); // Use context to access addTask

    const handleAdd = () => {
        if (todoContent.trim()) {
            const newTask: any = { id: Date.now(), todo: todoContent, completed: false };
            addTask(newTask); // Add task using context
            setTodoContent("");
        }
    };

    return (


        <Grid container spacing={2} alignItems="center">
            <Grid item xs={9.4}>
                <TextField
                    label="New Task"
                    value={todoContent}
                    onChange={(e) => setTodoContent(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={1.5}>
                <Tooltip title={todoContent ? "Add Task" : "Add Task Name to Add Task"}>
                    <span>
                        <Button disabled={!todoContent} onClick={handleAdd} variant="outlined" sx={{ padding: '0.8rem' }} fullWidth>
                            Add Task
                        </Button>
                    </span>
                </Tooltip>
            </Grid>
        </Grid>
    );
};

export default AddTodo;
