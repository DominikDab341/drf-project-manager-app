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
    const [members, setMembers] = useState([]);
    const [statistics, setStatistics] = useState(null);

    const [activeModal, setActiveModal] = useState(null); // 'tasks', 'stats', 'taskDetails'
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [newTaskData, setNewTaskData] = useState({
        title: '',
        description: '',
        deadline: '',
        assigned_to: '' 
    });

    const {user} = useUser();

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectResponse = await apiClient.get(`/projects/${projectId}/`);
                const membersResponse = await apiClient.get(`/projects/${projectId}/members`)

                setProject(projectResponse.data);
                setMembers(membersResponse.data)
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

    const handleCreateTask = async (e) => {
        e.preventDefault(); 
        
        try {
            await apiClient.post('/tasks/', {
                title: newTaskData.title,
                description: newTaskData.description,
                deadline: newTaskData.deadline || null,
                assigned_to: newTaskData.assigned_to,
                project: projectId,
            });

            
            setActiveModal(null);
            setNewTaskData({ title: '', description: '', deadline: '', assigned_to: '' });
            alert("Zadanie dodane pomyślnie!");
            
        } catch (error) {
            console.error("new task post error", error);
            alert("Wystąpił błąd. Sprawdź, czy wypełniłeś wymagane pola.");
        }
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
                <p className="project-details-option" onClick = { () => setActiveModal('addTask')} >Dodaj zadanie</p>
                {/* <p className="project-details-option" onClick = { () => handleAddMember()} >Dodaj członka</p>
                <p className="project-details-option">Znajdź osobę bez projektów</p>
                <p className="project-details-option">Usuń projekt</p> */}
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

    {/* Add task */}
    <Modal isOpen={activeModal === 'addTask'} onClose={() => setActiveModal(null)}>
            <h2>Dodaj zadanie</h2>
            
            <form onSubmit={handleCreateTask} className="add-task-form">
                
                <div className="form-group">
                    <label>Tytuł</label>
                    <input 
                        type="text" 
                        required
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Przypisz do</label>
                    <select 
                        required
                        value={newTaskData.assigned_to}
                        onChange={(e) => setNewTaskData({...newTaskData, assigned_to: e.target.value})}
                    >                        
                    <option value="">Wybierz pracownika</option>
                    
                    {members && members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.first_name} {member.last_name} ({member.username})
                        </option>
                    ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Deadline (opcjonalne)</label>
                    <input 
                        type="date" 
                        value={newTaskData.deadline}
                        onChange={(e) => setNewTaskData({...newTaskData, deadline: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Opis</label>
                    <textarea 
                        required
                        rows="4"
                        value={newTaskData.description}
                        onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Utwórz Zadanie
                </button>
            </form>
        </Modal>
    </div>
)
};

export default ProjectDetails;