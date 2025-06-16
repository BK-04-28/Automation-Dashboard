import React,{ useState } from 'react';
import TaskCard from './components/TaskCard';
import NewAutomationForm from './components/NewAutomationForm';
import tasksData from './data/tasks';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [tasks, setTasks] = useState(tasksData);
  const [showForm, setShowForm] = useState(false);

  const updateTaskStatus = (id, newStatus) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };
  const handleRunNow = (id) => {
    updateTaskStatus(id, 'Running');
    setTimeout(() => updateTaskStatus(id, 'Completed'), 2000);
  };
  const addNewTask = (newTask) => {
    setTasks(prev => [
      ...prev,
      {
        ...newTask,
        id: prev.length + 1,
        status: 'Scheduled',
        lastRunTime: 'Not run yet',
        triggeredBy: 'User'
      }
    ]);
    setShowForm(false);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-5 px-4">
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h1 className="h2 fw-bold text-dark">Internal Task Automation Dashboard</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary shadow">
          <i className="bi bi-plus-circle me-2"></i>New Automation
        </button>
      </div>

      <div className="row g-4">
        {tasks.map(task => (
          <div key={task.id} className="col-12 col-md-6 col-lg-4">
            <TaskCard task={task} onRunNow={handleRunNow} />
          </div>
        ))}
      </div>

      {showForm && (
        <NewAutomationForm onClose={() => setShowForm(false)} onAdd={addNewTask} />
      )}
    </div>
  );
}
export default App;