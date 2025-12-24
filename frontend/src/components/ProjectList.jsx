import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import '../css/pagination.css';
import { useNavigate } from 'react-router-dom';
import '../css/ProjectList.css';

function ProjectList() {
  const [projectList, setProjectList] = useState([]);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get(`projects/?page=${page}`);

        setProjectList(response.data.results);

        const totalPages = Math.ceil(response.data.count / 3);
        setTotalPages(totalPages);

        setError('');
      } catch (err) {
        console.error('Błąd pobierania projektów');
        setError(err.message || 'Wystąpił błąd serwera');
      }
    };
    fetchProjects();
  }, [page]);

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

  const handleProjectClick = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="project-list-box">
      <h1>Lista projektów</h1>
      {projectList.length == 0
        ? 'Brak projektów'
        : projectList.map((project) => (
            <div className="project-list-box-item" key={project.id}>
              <h3 onClick={() => handleProjectClick(project.id)} className="project-title">
                {project.title}
              </h3>
              <p className="project-description">{project.description}</p>
            </div>
          ))}
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

export default ProjectList;
