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
import { deleteTodo, fetchTodos, updateTodo } from "@components/utils/api";
import AddTodo from "./AddTodo";
import { Task } from '../types/todo';

const getStoredTasks = (): Task[] => {
    const storedTasks = localStorage.getItem("inProgressTasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
};

const KanbanBoard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pagination, setPagination] = useState<{ [key: string]: number }>({
        todo: 0,
        "in-progress": 0,
        done: 0,
    });

    const [pageSize, setPageSize] = useState<number>(5);

    // Fetch tasks dynamically
    const loadTasks = useCallback(async () => {
        try {
            const fetchedTasks = await fetchTodos();
            const inProgressTasks = getStoredTasks();

            // Merge API tasks with stored in-progress tasks
            const mergedTasks: any = fetchedTasks.map((task) => {
                const storedTask = inProgressTasks.find((t) => t.id === task.id);
                return storedTask ? storedTask : { ...task, status: task.completed ? "done" : "todo" };
            });

            setTasks(mergedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);


    // Delete a task
    const handleDeleteTask = useCallback((id: number) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        deleteTodo(id)
    }, []);

    // Load in-progress tasks from local storage when component mounts
    useEffect(() => {
        const inProgressTasks = getStoredTasks();
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((task) =>
                task.status === "in-progress"
                    ? inProgressTasks.find((t) => t.id === task.id) || task
                    : task
            );
            return updatedTasks;
        });
    }, []);

    // Save tasks to localStorage
    const saveTasksToLocalStorage = (updatedTasks: any) => {
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };


    // Update localStorage whenever tasks change
    useEffect(() => {
        saveTasksToLocalStorage(tasks);
    }, [tasks]);


    // Edit task content
    const handleEditTask = useCallback((task: Task, newContent: string) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, todo: newContent } : t))
        );
        updateTodo(task.id, task.completed, newContent);
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

        // Call updateTodo separately to avoid side effects inside map
        const updatedTask = tasks.find((task) => task.id.toString() === result.draggableId);
        if (updatedTask && destination.droppableId === "done") {
            updateTodo(updatedTask.id, true, updatedTask.todo);
        }
    }, [tasks]);

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
                <AddTodo onAddTask={saveTasksToLocalStorage} />
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
