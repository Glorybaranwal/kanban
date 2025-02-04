import { useEffect, useState, useMemo, useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
    Container,
    Typography,
    Button,
    TextField,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
} from "@mui/material";
import KanbanColumn from "./Column";
import { Task } from '../types/todo';
import { useTasks } from "@components/context/task"; // Import the useTasks hook
import AddTodo from "./AddTodo";

const KanbanBoard = () => {
    const { tasks, addTask, editTask, deleteTask, updateTaskStatus } = useTasks(); // Use context to access tasks and functions
    const [pagination, setPagination] = useState<{ [key: string]: number }>({
        todo: 0,
        "in-progress": 0,
        done: 0,
    });

    const [pageSize, setPageSize] = useState<number>(5);

    // Delete a task
    const handleDeleteTask = useCallback((id: number) => {
        deleteTask(id);
    }, [deleteTask]);

    // Edit task content
    const handleEditTask = useCallback((task: Task, newContent: string) => {
        editTask(task.id, newContent);
    }, [editTask]);

    // Handle drag-and-drop
    const onDragEnd = useCallback((result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        updateTaskStatus(parseInt(result.draggableId), destination.droppableId as Task["status"]);
    }, [updateTaskStatus]);

    // Calculate total pages per column
    const totalPages = useMemo(
        () => ({
            todo: Math.ceil(tasks.filter((task) => task.status === "todo").length / pageSize),
            "in-progress": Math.ceil(tasks.filter((task) => task.status === "in-progress").length / pageSize),
            done: Math.ceil(tasks.filter((task) => task.status === "done").length / pageSize),
        }),
        [tasks, pageSize]
    );

    // Handle pagination
    const handlePageChange = useCallback(
        (status: "todo" | "in-progress" | "done", direction: "next" | "prev") => {
            setPagination((prev) => ({
                ...prev,
                [status]:
                    direction === "next"
                        ? Math.min(prev[status] + 1, totalPages[status] - 1)
                        : Math.max(prev[status] - 1, 0),
            }));
        },
        [totalPages]
    );

    // Paginate tasks
    const paginatedTasks = useMemo(() => {
        const filteredTasks = {
            todo: tasks.filter((task) => task.status === "todo"),
            "in-progress": tasks.filter((task) => task.status === "in-progress"),
            done: tasks.filter((task) => task.status === "done"),
        };

        return {
            todo: filteredTasks.todo.slice(pagination.todo * pageSize, (pagination.todo + 1) * pageSize),
            "in-progress": filteredTasks["in-progress"].slice(
                pagination["in-progress"] * pageSize,
                (pagination["in-progress"] + 1) * pageSize
            ),
            done: filteredTasks.done.slice(pagination.done * pageSize, (pagination.done + 1) * pageSize),
        };
    }, [tasks, pagination, pageSize]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Kanban Board
            </Typography>

            {/* Page Size Selection */}
            <FormControl sx={{ minWidth: 120, marginBottom: "10px" }}>
                <Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <MenuItem value="" disabled>Page Size</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                </Select>
            </FormControl>

            {/* Add Task Input */}
            <Box mb={7}>
                <AddTodo onAddTask={addTask} /> {/* Add task using context */}
            </Box>

            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container >
                    {Object.entries(paginatedTasks).map(([status, tasks]) => (
                        <KanbanColumn
                            key={status}
                            status={status as Task["status"]}
                            tasks={tasks}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                            onPageChange={handlePageChange}
                            page={pagination[status as Task["status"]]}
                            totalTasks={tasks.length}
                            totalPages={totalPages[status as Task["status"]]}
                        />
                    ))}
                </Grid>
            </DragDropContext>
        </Container>
    );
};

export default KanbanBoard;
