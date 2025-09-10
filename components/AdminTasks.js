// components/AdminTasks.js
import { useState, useEffect } from 'react';

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: ''
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.points) {
      alert('Name and points are required');
      return;
    }

    try {
      const url = editingTask ? '/api/tasks' : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      const body = editingTask 
        ? { ...formData, id: editingTask.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setFormData({ name: '', description: '', points: '' });
        setShowAddForm(false);
        setEditingTask(null);
        fetchTasks();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      description: task.description || '',
      points: task.points.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task? This will also remove all completion records.')) {
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId }),
      });

      if (res.ok) {
        fetchTasks();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', points: '' });
    setShowAddForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Manage Tasks</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Add New Task
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="text-lg font-medium mb-4">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Breathing Exercise"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional description"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points *
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 10"
                min="1"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
          >
            <div>
              <h4 className="font-medium text-gray-900">{task.name}</h4>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
              <span className="text-sm text-blue-600 font-medium">+{task.points} points</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks created yet. Add your first task above!
        </div>
      )}
    </div>
  );
}
