import { useState } from 'react'; // 1. Import useState
import ProjectList from '../components/ProjectList.jsx';
import TaskList from '../components/TaskList.jsx';
import NotificationList from '../components/NotificationList.jsx';
import TaskDetailsModal from '../components/Modals/TaskDetailsModal.jsx'; 
import '../css/home.css';

function Home() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsDetailsOpen(true);
  };

  return (
    <div className="home-page">
      <div className="project-list-container">
        <ProjectList />
      </div>
      
      <div className="task-container">
        <TaskList onTaskClick={handleTaskClick} />
      </div>
      
      <div className="notification-container">
        <NotificationList />
      </div>

      <TaskDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        taskId={selectedTaskId}
        onBack={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}

export default Home;