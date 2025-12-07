import Modal from './Modal.jsx';

function StatsModal({ isOpen, onClose, statistics }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Statystyki Projektu</h2>
            {statistics ? (
                <div>
                    <p><strong>Do zrobienia:</strong> {statistics.tasks_todo}</p>
                    <p><strong>W trakcie:</strong> {statistics.tasks_in_progress}</p>
                    <p><strong>Zakończone:</strong> {statistics.done_tasks}</p>
                    <p><strong>Razem:</strong> {statistics.total_number_of_tasks}</p>
                </div>
            ) : (
                <p>Ładowanie statystyk...</p>
            )}
        </Modal>
    );
}

export default StatsModal;