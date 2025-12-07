import Modal from './Modal.jsx';
import TaskList from '../TaskList.jsx'; 

function TasksListModal({ isOpen, onClose, projectId, onTaskClick }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <TaskList 
                projectId={projectId} 
                onTaskClick={onTaskClick} 
            />
        </Modal>
    );
}

export default TasksListModal;