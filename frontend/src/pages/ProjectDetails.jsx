import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import apiClient from "../api/apiClient";
import '../css/ProjectDetails.css'
import Modal from '../components/Modal.jsx'
import TaskList from "../components/TaskList.jsx";
import TaskDetails from "../components/TaskDetails.jsx";
import { useUser } from "../context/UserContext.jsx";

function ProjectDetails() {
    const {projectId} = useParams();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState(null);
    const [statistics, setStatistics] = useState(null);

    const [activeModal, setActiveModal] = useState(null); // 'tasks', 'stats', 'taskDetails'
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const {user} = useUser();

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const ProjectResponse = await apiClient.get(`/projects/${projectId}/`);
                const MembersResponse = await apiClient.get(`/projects/${projectId}/members`)

                setProject(ProjectResponse.data);
                setMembers(MembersResponse.data)
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
        }
        fetchProjectDetails();
    },[projectId])


    useEffect(() => {
        if (activeModal === 'stats'){
            const fetchStats = async () => { 
                try {
                    const response = await apiClient.get(`/projects/${projectId}/tasks-status`)
                    setStatistics(response.data)
                } catch(error) { 
                    console.error("Error fetching project statistics", error) }
            };
            fetchStats();
        }
    }, [activeModal, projectId]);

    const handleTaskSelect = (taskId) => {
        setSelectedTaskId(taskId);
        setActiveModal('taskDetails'); 
    }

    if (!project) {
        return <div>Ten projekt nie istnieje</div>;
    }


    return (
    <div className='project-details-container'>
        <div className="project-details-options-container">
            <p className="project-details-option" onClick = { () => setActiveModal('tasks')} >Moje zadania</p>
            <p className="project-details-option" onClick = { () => setActiveModal('stats')} >Statystyki</p>
            {user.is_manager && (
                <>
                <p className="project-details-option" onClick = { () => handleAddTask()} >Dodaj zadanie</p>
                <p className="project-details-option" onClick = { () => handleAddMember()} >Dodaj członka</p>
                </>
                ) } 
        </div>
        <div className='project-details-box'>
            <h1 className='project-detail-title'>{project.title}</h1>
            <div className='project-details-content'>
                <div>
                    <div className='project-details-members'>
                        <h3>Członkowie</h3>
                        {members.length === 0 ? ("Brak członków"): 
                            (
                                members.map((member) => (
                                    <div key={member.id} className="member-list">
                                        <p className='member-list-name'>{member.first_name} {member.last_name}</p>
                                    </div>
                                )
                                )
                            )
                        }
                    </div>  

                </div>
                <div className='project-details-description'> 
                    <h3>Opis projektu</h3>
                    {project.description}
                </div>
            
                <div className='project-details-chat'>
                    <h3>Chat</h3>
                </div>  

            </div>
        </div>

    {/* Tasks */}
    <Modal isOpen ={activeModal === 'tasks'} onClose={() => setActiveModal(null)}>
        <TaskList projectId={projectId} onTaskClick={handleTaskSelect}/>
    </Modal>

    {/* Task Details */}
    <Modal isOpen ={activeModal === 'taskDetails'} onClose={() => setActiveModal(null)}>
        <TaskDetails taskId={selectedTaskId} />
        <button onClick={() => setActiveModal('tasks')}>Wróć do listy</button>
    </Modal>

    {/* Statistics */}
    <Modal isOpen ={activeModal === 'stats'} onClose={() => setActiveModal(null)}>
        <h2>Statystyki Projektu</h2>
            {statistics ? (
                <div>
                    <p><strong>Do zrobienia:</strong> {statistics.tasks_todo}</p>
                    <p><strong>W trakcie:</strong> {statistics.tasks_in_progress || 0}</p>
                    <p><strong>Zakończone:</strong> {statistics.done_tasks}</p>
                    <p><strong>Razem:</strong> {statistics.total_number_of_tasks}</p>
                </div>
            ) : (
                <p>Ładowanie statystyk...</p>
            )}
    </Modal>
    </div>
)
};

export default ProjectDetails;