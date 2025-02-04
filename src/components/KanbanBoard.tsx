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
import { addTodo, fetchTodos } from "@components/utils/api";

interface Task {
    id: number;
    todo: string;
    completed: boolean;
    status: "todo" | "in-progress" | "done";
}

const KanbanBoard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const [pagination, setPagination] = useState<{ [key: string]: number }>({
        todo: 0,
        "in-progress": 0,
        done: 0,
    });

    const [pageSize, setPageSize] = useState<number>(5);
    const [loading, setLoading] = useState(false);

    // Fetch tasks dynamically
    const loadTasks = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedTasks = await fetchTodos();
            setTasks(
                fetchedTasks.map((task) => ({
                    ...task,
                    status: task.completed ? "done" : "todo",
                }))
            );
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    // Add new task
    const handleAddTask = useCallback(() => {
        if (!newTask.trim()) return;

        const newTaskObj: Task = {
            id: Date.now(),
            todo: newTask,
            completed: false,
            status: "todo",
        };

        setTasks((prev) => [...prev, newTaskObj]);
        addTodo(newTask);

        setNewTask("");
    }, [newTask]);

    // Delete a task
    const handleDeleteTask = useCallback((id: number) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }, []);

    // Edit task content
    const handleEditTask = useCallback((id: number, newContent: string) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, todo: newContent } : task))
        );
    }, []);

    // Handle drag-and-drop
    const onDragEnd = useCallback((result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        setTasks((prev) =>
            prev.map((task) =>
                task.id.toString() === result.draggableId
                    ? { ...task, status: destination.droppableId as Task["status"], completed: destination.droppableId === "done" }
                    : task
            )
        );
    }, []);

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
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                        <TextField
                            label="New Task"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1.5}>
                        <Button onClick={handleAddTask} variant="contained" fullWidth>
                            Add Task
                        </Button>
                    </Grid>
                </Grid>
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
