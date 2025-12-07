import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import '../css/taskDetails.css';


function TaskDetails({ taskId }) {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);

  const [commentContent, setCommentContent] = useState('');

  const fetchComments = async () => {
    try {
      const commentsResponse = await apiClient.get(`/comments/?task=${taskId}`);
      setComments(commentsResponse.data.results);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskDetails = async () => {
      try {
        const response = await apiClient.get(`/tasks/${taskId}/`);
        setTask(response.data);

      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };
    fetchTaskDetails();
    fetchComments();
  }, [taskId]);

  const handleSendComment = async () => {
    try {
      await apiClient.post('/comments/', {
        task: taskId,
        content: commentContent,
      });
      setCommentContent('');
      fetchComments();
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };


  if (!task) return <div>Ładowanie...</div>;

return (
    <div className="task-details-container">
      
      <div className="task-info-section">
        <h2>{task.title}</h2>
        
        <div>
            <p><strong>Opis:</strong></p>
            <p>{task.description}</p>
        </div>

        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Deadline:</strong> {task.deadline || "Brak"}</p>
      </div>

      <div className="task-comments-section">
        <h3>Komentarze</h3>
        {comments.length === 0 ? (
          <p>Brak komentarzy</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="task-comment">
              <p><strong>{comment.author_name}</strong> ({new Date(comment.created_at).toLocaleString()}):</p>
              <p>{comment.content}</p>
            </div>
          ))
        )}

      <textarea 
          placeholder="Dodaj komentarz..." 
          className="task-comment-input"
          value ={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
      />

      <button className="task-comment-submit-btn" onClick = {handleSendComment}>
          Wyślij
      </button>
      </div>

    </div>
  );
}

export default TaskDetails;
