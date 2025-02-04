import { useState } from "react";
import { Button, TextField } from "@mui/material";
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
        <div>
            <TextField
                label="New Task"
                variant="outlined"
                value={todoContent}
                onChange={(e) => setTodoContent(e.target.value)}
            />
            <Button onClick={handleAdd} variant="contained">Add</Button>
        </div>
    );
};

export default AddTodo;
