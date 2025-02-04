import { useEffect, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
    Card, CardContent, Typography, IconButton, Button, Box, Divider,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Task {
    id: number;
    todo: string;
    completed: boolean;
    status: "todo" | "in-progress" | "done";
}

interface KanbanColumnProps {
    status: "todo" | "in-progress" | "done";
    tasks: Task[];
    onDelete: (id: number) => void;
    onEdit: (task: Task, newContent: string) => void;
    onPageChange: (status: "todo" | "in-progress" | "done", direction: "next" | "prev") => void;
    page: number;
    totalTasks: number;
    totalPages: number;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ totalPages, status, tasks, onDelete, onEdit, onPageChange, page }) => {
    const [taskList, setTaskList] = useState<Task[]>(tasks);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editedText, setEditedText] = useState("");

    useEffect(() => {
        setTaskList(tasks);
    }, [tasks]);

    // Open Dialog and Set Current Task
    const handleEditClick = (task: Task) => {
        setSelectedTask(task);
        setEditedText(task.todo);
        setOpenDialog(true);
    };

    // Close Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
    };

    // Save Changes
    const handleSaveEdit = () => {
        if (selectedTask) {
            onEdit(selectedTask, editedText);
        }
        handleCloseDialog();
    };

    return (
        <Box sx={{ width: "320px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", marginRight: "20px" }}>
            <Typography variant="h6" align="center" sx={{ textTransform: "capitalize", fontWeight: "bold" }}>
                {status.replace("-", " ")}
            </Typography>
            <Divider sx={{ margin: "10px 0" }} />

            <Droppable droppableId={status}>
                {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: "250px" }}>
                        {taskList.map((task, index) => (
                            <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                                {(provided) => (
                                    <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ marginBottom: "12px", padding: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Typography variant="body1" sx={{ flex: 1, marginRight: "10px" }}>{task.todo}</Typography>
                                        <Box sx={{ display: "flex", gap: "5px" }}>
                                            <IconButton size="small" onClick={() => handleEditClick(task)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => onDelete(task.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Card>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>

            {/* Pagination Controls */}
            {tasks.length > 1 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                    <Button onClick={() => onPageChange(status, "prev")} disabled={page === 0} size="small" variant="outlined">
                        Prev
                    </Button>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Page {page + 1} of {totalPages}
                    </Typography>
                    <Button onClick={() => onPageChange(status, "next")} disabled={page + 1 >= totalPages} size="small" variant="outlined">
                        Next
                    </Button>
                </Box>
            )}

            {/* Edit Task Dialog */}
            {/* Responsive Edit Task Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        width: { xs: "90%", sm: "80%", md: "60%" }, // Responsive width
                        padding: "20px",
                        borderRadius: "10px"
                    }
                }}
            >
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Task Name"
                        fullWidth
                        variant="outlined"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        sx={{ fontSize: "16px" }}
                    />
                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "space-between", padding: "10px 24px" }}>
                    <Button onClick={handleCloseDialog} color="secondary" variant="outlined">Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default KanbanColumn;
