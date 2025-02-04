import { Paper, Typography, Box } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';

interface TaskCardProps {
    task: any;
    index: number;
}

const TaskCard = ({ task, index }: TaskCardProps) => {
    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided) => (
                <Paper
                    elevation={2}
                    sx={{
                        marginBottom: 2,
                        padding: 2,
                        backgroundColor: task.completed ? 'green' : 'yellow',
                    }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Box>
                        <Typography variant="body1">{task.todo}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {task.completed ? 'Completed' : 'Pending'}
                        </Typography>
                    </Box>
                </Paper>
            )}
        </Draggable>
    );
};

export default TaskCard;
