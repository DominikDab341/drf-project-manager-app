import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import apiClient from "../api/apiClient";
import '../css/ProjectDetails.css';
import Modal from '../components/Modal.jsx';
import TaskList from "../components/TaskList.jsx";
import TaskDetails from "../components/TaskDetails.jsx";
import { useUser } from "../context/UserContext.jsx";
import StatsModal from "../components/StatsModal.jsx";
import AddTaskModal from '../components/AddTaskModal.jsx'

const MODALS = {
    TASKS: 'tasks',
    STATS: 'stats',
    TASK_DETAILS: 'taskDetails',
    ADD_TASK: 'addTask'
};

function ProjectDetails() {
    const {projectId} = useParams();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [statistics, setStatistics] = useState(null);

    const [activeModal, setActiveModal] = useState(null);
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
            <p className="project-details-option" onClick = { () => setActiveModal(MODALS.TASKS)} >Moje zadania</p>
            <p className="project-details-option" onClick = { () => setActiveModal(MODALS.STATS)} >Statystyki</p>
            {user.is_manager && (
                <>
                <p className="project-details-option" onClick = { () => setActiveModal(MODALS.ADD_TASK)} >Dodaj zadanie</p>
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
    <Modal isOpen ={activeModal === MODALS.TASKS} onClose={() => setActiveModal(null)}>
        <TaskList projectId={projectId} onTaskClick={handleTaskSelect}/>
    </Modal>

    {/* Task Details */}
    <Modal isOpen ={activeModal === MODALS.TASK_DETAILS} onClose={() => setActiveModal(null)}>
        <TaskDetails taskId={selectedTaskId} />
        <button onClick={() => setActiveModal(MODALS.TASKS)}>Wróć do listy</button>
    </Modal>

    {/* Statistics */}
    <StatsModal 
        isOpen={activeModal === MODALS.STATS} onClose={() => setActiveModal(null)} statistics={statistics}
    />

    {/* Add task */}
    <AddTaskModal  isOpen={activeModal === MODALS.ADD_TASK} onClose={() => setActiveModal(null)}
        newTaskData={newTaskData}
        setNewTaskData={setNewTaskData}
        handleCreateTask={handleCreateTask}
        members={members}
    />
    </div>
)
};

export default ProjectDetails;