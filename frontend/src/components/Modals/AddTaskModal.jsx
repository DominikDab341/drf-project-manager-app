import { useState } from "react";
import Modal from './Modal.jsx';
import "../../css/AddTaskModal.css"
import apiClient from "../../api/apiClient";

function AddTaskModal({ isOpen, onClose, projectId, members }){

    const [newTaskData, setNewTaskData] = useState({
        title: '',
        description: '',
        deadline: '',
        assigned_to: '' 
    });

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

            
            onClose();
            setNewTaskData({ title: '', description: '', deadline: '', assigned_to: '' });
            alert("Zadanie dodane pomyślnie!");
            
        } catch (error) {
            console.error("new task post error", error);
            alert("Wystąpił błąd. Sprawdź, czy wypełniłeś wymagane pola.");
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className='task-form-h2' >Dodaj zadanie</h2>
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
    )
}

export default AddTaskModal;