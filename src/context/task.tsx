import { createContext, useContext, useState, useEffect } from "react";
import { fetchTodos, updateTodo, deleteTodo } from "@components/utils/api";
import { Task } from "../types/todo";

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Task) => void;
    editTask: (id: number, newContent: string) => void;
    deleteTask: (id: number) => void;
    updateTaskStatus: (id: number, status: Task["status"]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error("useTasks must be used within TaskProvider");
    return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const fetchedTasks: any = await fetchTodos();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        loadTasks();
    }, []);

    // Add a new task to the correct column
    const addTask = (task: Task) => {
        setTasks((prev) => [...prev, task]);
    };

    // Edit task
    const editTask = (id: number, newContent: string) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, todo: newContent } : task))
        );
        updateTodo(id, false, newContent);
    };

    // Delete task
    const deleteTask = (id: number) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        deleteTodo(id);
    };

    // Update task status on drag
    const updateTaskStatus = (id: number, status: Task["status"]) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, status } : task))
        );
        updateTodo(id, status === "done", "");
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, editTask, deleteTask, updateTaskStatus }}>
            {children}
        </TaskContext.Provider>
    );
};
