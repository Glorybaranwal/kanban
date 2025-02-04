import { Draggable } from "react-beautiful-dnd";
import { Box, Typography, Button } from "@mui/material";
import { Task } from "../types/todo";

interface KanbanCardProps {
    key: number
    task: Task;
    index: number;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ key, task, index }) => {
    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                        marginBottom: 2,
                        padding: 2,
                        backgroundColor: "#fff",
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body1">{task.todo}</Typography>
                    <Button onClick={() => console.log(`Edit Task ${task.id}`)}>Edit</Button>
                </Box>
            )}
        </Draggable>
    );
};

export default KanbanCard;
