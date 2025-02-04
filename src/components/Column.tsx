import { useEffect, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, Typography, IconButton, Button, Box, Divider } from "@mui/material";
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
    onEdit: (id: number, newContent: string) => void;
    onPageChange: (status: "todo" | "in-progress" | "done", direction: "next" | "prev") => void;
    page: number;
    totalTasks: number;
    totalPages: number
}

const PAGE_SIZE = 5;

const KanbanColumn: React.FC<KanbanColumnProps> = ({ totalPages, status, tasks, onDelete, onEdit, onPageChange, page, totalTasks }) => {
    const [taskList, setTaskList] = useState<Task[]>(tasks);

    useEffect(() => {
        setTaskList(tasks);
    }, [tasks]);

    return (
        // <Box sx={{ width: "300px", padding: "10px", backgroundColor: "#f4f4f4", borderRadius: "5px" }}>
        //     <Typography variant="h6" align="center" sx={{ textTransform: "capitalize" }}>
        //         {status.replace("-", " ")}
        //     </Typography>

        //     <Droppable droppableId={status}>
        //         {(provided) => (
        //             <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: "200px" }}>
        //                 {taskList.map((task, index) => (
        //                     <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
        //                         {(provided) => (
        //                             <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ marginBottom: "10px" }}>
        //                                 <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        //                                     <Typography variant="body1">{task.todo}</Typography>
        //                                     <Box>
        //                                         <IconButton onClick={() => onEdit(task.id, prompt("Edit Task:", task.todo) || task.todo)}>
        //                                             <EditIcon />
        //                                         </IconButton>
        //                                         <IconButton onClick={() => onDelete(task.id)}>
        //                                             <DeleteIcon />
        //                                         </IconButton>
        //                                     </Box>
        //                                 </CardContent>
        //                             </Card>
        //                         )}
        //                     </Draggable>
        //                 ))}
        //                 {provided.placeholder}
        //             </Box>
        //         )}
        //     </Droppable>

        //     {/* Pagination Controls - Appears Only If More Tasks Exist */}
        //     <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        //         <Button onClick={() => onPageChange(status, "prev")} disabled={page === 0}>
        //             Prev
        //         </Button>
        //         <Typography>
        //             Page {page + 1} of {totalPages}
        //         </Typography>
        //         <Button onClick={() => onPageChange(status, "next")} disabled={page + 1 >= totalPages}>
        //             Next
        //         </Button>
        //     </Box>
        // </Box>
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
                                            <IconButton size="small" onClick={() => onEdit(task.id, prompt("Edit Task:", task.todo) || task.todo)}>
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
        </Box>
    );
};

export default KanbanColumn;