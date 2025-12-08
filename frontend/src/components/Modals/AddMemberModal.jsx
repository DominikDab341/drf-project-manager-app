import apiClient from '../../api/apiClient.js';
import Modal from './Modal.jsx';
import { useEffect, useState } from 'react';
import '../../css/addMemberModal.css'

function AddMemberModal({ isOpen, onClose, projectId, onMemberAdded }) {
    const [candidates, setCandidates] = useState([])

    const [selectedUserId, setSelectedUserId] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() =>{
        if (isOpen) {
            const fetchCandidates = async () =>{
                setIsLoading(true);
                try{
                    const candidatesResponse = await apiClient.get(`/projects/${projectId}/candidates/`);
                    
                    setCandidates(candidatesResponse.data);
                }catch (error){
                    console.error("Error during candidates fetch", error);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchCandidates();
        }
    },[projectId, isOpen]);

    const handleSubmit = async ( ) => {
        if (!selectedUserId) return; 

        try {
            await apiClient.post(`/projects/${projectId}/add_member/`, {user_id: selectedUserId});

            if (onMemberAdded) {
                onMemberAdded();
            }
            onClose();
        }catch(error){
            console.error("add member has failed ", error);
            alert("Nie udało się dodać użytkownika");
        }

    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Dodaj członka zespołu</h2>
            
            {isLoading ? (
                <p>Ładowanie...</p>
            ) : (
                <div className="add-member-container">
                

                    <div className="candidates-list">
                        {candidates.length === 0 ? (
                            <p className="no-candidates">Brak dostępnych kandydatów.</p>
                        ) : (
                            candidates.map((candidate) => (
                                <div 
                                    key={candidate.id}
                                    onClick={() => setSelectedUserId(candidate.id)}
                                    className={`candidate-item ${selectedUserId === candidate.id ? 'selected' : ''}`}
                                >
                                    <span className="candidate-name">
                                        {candidate.first_name} {candidate.last_name}
                                    </span>
                                    <span className="candidate-username"> (@{candidate.username})</span>
                                </div>
                            ))
                        )}
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        className="submit-btn" 
                        disabled={!selectedUserId}
                    >
                        Dodaj do projektu
                    </button>
                </div>
            )}
        </Modal>
    );
}

export default AddMemberModal;