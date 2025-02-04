import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "@components/utils/api";

interface Task {
    id: number;
    todo: string;
    completed: boolean;
    status: "todo" | "in-progress" | "done";
}

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Task) => void;
    editTask: (id: number, newContent: string) => void;
    deleteTask: (id: number) => void;
    updateTaskStatus: (id: number, status: Task["status"]) => void;
}

// Create Context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Context Provider Component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    // Fetch tasks from API on mount
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const fetchedTasks = await fetchTodos();
                setTasks(fetchedTasks.map((task) => ({
                    ...task,
                    status: task.completed ? "done" : "todo",
                })));
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        loadTasks();
    }, []);

    // Add a task
    const addTask = (newTask: Task) => {
        setTasks((prev) => [...prev, newTask]);
        addTodo(newTask); // API call
    };

    // Edit a task
    const editTask = (id: number, newContent: string) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, todo: newContent } : task))
        );
        updateTodo(id, false, newContent);
    };

    // Delete a task
    const deleteTask = (id: number) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        deleteTodo(id);
    };

    // Update task status (for drag & drop)
    const updateTaskStatus = (id: number, status: Task["status"]) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, status, completed: status === "done" } : task
            )
        );
        updateTodo(id, status === "done", tasks.find((task) => task.id === id)?.todo || "");
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, editTask, deleteTask, updateTaskStatus }}>
            {children}
        </TaskContext.Provider>
    );
};

// Custom Hook for using TaskContext
export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
};
