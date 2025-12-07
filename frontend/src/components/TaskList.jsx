import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

function TaskList({ projectId = null, onTaskClick }) {
  const [taskList, setTaskList] = useState([]);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let url = `tasks/?page=${page}`;

        if (projectId) {
          url += `&project=${projectId}`;
        }

        const response = await apiClient.get(url);
        setTaskList(response.data.results);

        if (response.data.count) {
          const totalPages = Math.ceil(response.data.count / 3);
          setTotalPages(totalPages);
        }

        setError('');
      } catch (err) {
        console.error('Error fetching tasks');
        setError(err.message || 'Server error occurred');
      }
    };
    fetchTasks();
  }, [page, projectId]);

  const handleChangeToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleChangeToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  return (
    <div className="task-list-box">
      <h1>{projectId ? 'Zadania w projekcie' : 'Twoje zadania'}</h1>

      <div>
        {taskList.length === 0
          ? 'Brak zadań'
          : taskList.map((task) => (
              <div key={task.id} className="task-list-item">
                {task.status === 'TO_DO' ? (
                  <div className="task-todo">Do zrobienia</div>
                ) : task.status === 'IN_PROGRESS' ? (
                  <div className="task-inprogress">W trakcie</div>
                ) : (
                  <div className="task-done">Zakończone</div>
                )}
                <h3 onClick={() => onTaskClick(task.id)} className="task-title">
                  {task.title}
                </h3>
                <p className="task-description">{task.description}</p>
                {task.deadline === null ? (
                  <div className="task-deadline"> Brak deadlinu </div>
                ) : (
                  <p className="task-deadline"> Deadline: {task.deadline}</p>
                )}
              </div>
            ))}
      </div>
      {totalPages > 1 ? (
        <div className="pagination-buttons">
          <button onClick={handleChangeToPreviousPage} disabled={page === 1}>
            Poprzednia
          </button>

          <span>
            {' '}
            Strona {page} z {totalPages}{' '}
          </span>

          <button onClick={handleChangeToNextPage} disabled={page === totalPages}>
            Następna
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default TaskList;
