export interface Todo {
    id: number;
    todo: string;
    completed: boolean;
    userId?: number;
    status?: "todo" | "in-progress" | "done";
  }
  
  export interface Task {
    id: number;
    todo: string;
    completed: boolean;
    status: "todo" | "in-progress" | "done";
}