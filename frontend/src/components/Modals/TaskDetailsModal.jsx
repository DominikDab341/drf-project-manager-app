import Modal from './Modal.jsx';
import TaskDetails from '../TaskDetails.jsx';

const TaskDetailsModal = ({ isOpen, onClose, taskId, onBack }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {taskId && <TaskDetails taskId={taskId} />}

            <button onClick={onBack} className="task-comment-submit-btn" >
                Wróć
            </button>
        </Modal>
    );
};

export default TaskDetailsModal;