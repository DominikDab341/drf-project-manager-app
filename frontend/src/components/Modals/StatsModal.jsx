import Modal from './Modal.jsx';
import {useEffect, useState} from "react";
import apiClient from "../../api/apiClient";

function StatsModal({ isOpen, onClose, projectId }){ {
        const [statistics, setStatistics] = useState(null);

        useEffect(() => {
            {
            const fetchStats = async () => { 
                try {
                    const response = await apiClient.get(`/projects/${projectId}/tasks-status`)
                    setStatistics(response.data)
                } catch(error) { 
                    console.error("Error fetching project statistics", error) }
            };
            fetchStats();
            }
        }, [projectId]);


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
}

export default StatsModal;