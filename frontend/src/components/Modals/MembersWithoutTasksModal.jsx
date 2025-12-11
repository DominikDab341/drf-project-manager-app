import apiClient from '../../api/apiClient.js'
import Modal from './Modal.jsx'
import '../../css/membersWithoutTasks.css'
import {useEffect, useState} from 'react'

function MembersWithoutTasksModal({isOpen, onClose, projectId}){
    const [membersWithoutTasks,setMembersWithoutTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect( () =>{
        if (isOpen){
            const  fetchMembersWithoutTasksResponse = async () => {
                setIsLoading(true);
                try {
                    const response = await apiClient.get(`/projects/${projectId}/without-tasks/`);

                    setMembersWithoutTasks(response.data);
                }catch (error) {
                    console.error("error during members without tasks fetch ", error);
                }finally {
                    setIsLoading(false);
                }
            }
            fetchMembersWithoutTasksResponse();
        }
    },[projectId, isOpen])

    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='members-container'>
                <h3>Osoby bez przypisanych zadań</h3>
                
                {isLoading ? (
                    <p>Ładowanie...</p>
                ) : membersWithoutTasks.length === 0 ? (
                    <p>Wszyscy członkowie mają już zadania.</p>
                ) : (
                    <div className="members-list">
                        {membersWithoutTasks.map((member) => (
                            <div key={member.id} className="member-item">
                                <strong>({member.first_name} {member.last_name})</strong>
                                <span> {member.username}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default MembersWithoutTasksModal;