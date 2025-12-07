import Modal from '../components/Modal.jsx';

function AddTaskModal({ isOpen, onClose, newTaskData, setNewTaskData, handleCreateTask, members }){
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
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
    )
}

export default AddTaskModal;