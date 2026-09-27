import { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../api";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please enter both title and description.");
      return;
    }

    try {
      setFormLoading(true);
      setError(null);

      if (editingId) {
        const updatedTask = await updateTask(editingId, {
          title,
          description,
          completed: tasks.find((task) => task._id === editingId)?.completed || false
        });

        setTasks(
          tasks.map((task) =>
            task._id === editingId ? updatedTask : task
          )
        );
      } else {
        const newTask = await createTask({
          title,
          description
        });

        setTasks([...tasks, newTask]);
      }

      setTitle("");
      setDescription("");
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(id);
      setError(null);

      await deleteTask(id);

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async (task) => {
    try {
      setActionLoading(task._id);
      setError(null);

      const updatedTask = await updateTask(task._id, {
        title: task.title,
        description: task.description,
        completed: !task.completed
      });

      setTasks(
        tasks.map((item) =>
          item._id === task._id ? updatedTask : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setError(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="task-section">
      <div className="task-header">
        <div>
          <p className="task-label">TASK MANAGER</p>
          <h2>Manage Your Tasks</h2>
          <p className="task-subtitle">
            Create, update and organize your tasks with MongoDB.
          </p>
        </div>
        <div className="task-count">
          <span>{tasks.length}</span>
          <small>Tasks</small>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <form className="task-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Update Task" : "Create New Task"}</h3>

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />

        <div className="form-actions">
          <button type="submit" disabled={formLoading}>
            {formLoading
              ? "Saving..."
              : editingId
              ? "Update Task"
              : "Add Task"}
          </button>

          {editingId && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <h3>No tasks yet</h3>
            <p>Create your first task using the form above.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              className={`task-card ${task.completed ? "completed" : ""}`}
              key={task._id}
            >
              <div className="task-card-content">
                <div className="task-status">
                  <span className={task.completed ? "status-done" : "status-pending"}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>

              <div className="task-actions">
                <button
                  onClick={() => handleToggle(task)}
                  disabled={actionLoading === task._id}
                >
                  {actionLoading === task._id
                    ? "..."
                    : task.completed
                    ? "Undo"
                    : "Complete"}
                </button>

                <button
                  onClick={() => handleEdit(task)}
                  disabled={actionLoading === task._id}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  disabled={actionLoading === task._id}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Projects;