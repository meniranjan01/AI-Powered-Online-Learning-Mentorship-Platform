import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { learningGoalsAPI } from '../services/api';

const LearningGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: ''
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalData, setEditGoalData] = useState({
    title: '',
    description: '',
    targetDate: ''
  });

  // Fetch learning goals on mount and when user changes
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await learningGoalsAPI.getAllGoals();
        setGoals(response.data);
      } catch (err) {
        setError('Failed to load learning goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditGoalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    try {
      const response = await learningGoalsAPI.createGoal(newGoal);
      setGoals(prev => [response.data.goal, ...prev]);
      setNewGoal({ title: '', description: '', targetDate: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create learning goal');
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    if (!editGoalData.title.trim()) return;

    try {
      const response = await learningGoalsAPI.updateGoal(editingGoalId, editGoalData);
      setGoals(prev => prev.map(goal =>
        goal.id === editingGoalId ? response.data.goal : goal
      ));
      setEditingGoalId(null);
      setEditGoalData({ title: '', description: '', targetDate: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update learning goal');
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await learningGoalsAPI.deleteGoal(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete learning goal');
    }
  };

  const handleProgressUpdate = async (id, progress) => {
    try {
      const response = await learningGoalsAPI.updateProgress(id, progress);
      setGoals(prev => prev.map(goal =>
        goal.id === id ? response.data.goal : goal
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update progress');
    }
  };

  const startEditing = (goal) => {
    setEditingGoalId(goal.id);
    setEditGoalData({
      title: goal.title,
      description: goal.description || '',
      targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : ''
    });
  };

  const cancelEditing = () => {
    setEditingGoalId(null);
    setEditGoalData({ title: '', description: '', targetDate: '' });
  };

  if (loading) {
    return <div className="text-center py-10">Loading learning goals...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">Please log in to view your learning goals</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Learning Goals</h2>
        <button
          onClick={() => setEditingGoalId(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel Edit
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Add New Goal Form */}
      <form onSubmit={handleAddGoal} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Learning Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newGoal.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Target Date</label>
            <input
              type="date"
              name="targetDate"
              value={newGoal.targetDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={newGoal.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Learning Goal
        </button>
      </form>

      {/* Edit Goal Form (if editing) */}
      {editingGoalId !== null && (
        <form onSubmit={handleUpdateGoal} className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Edit Learning Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={editGoalData.title}
                onChange={handleEditInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Target Date</label>
              <input
                type="date"
                name="targetDate"
                value={editGoalData.targetDate}
                onChange={handleEditInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={editGoalData.description}
              onChange={handleEditInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={cancelEditing}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Goal
            </button>
          </div>
        </form>
      )}

      {/* Learning Goals List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Learning Goals ({goals.length})</h3>
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No learning goals yet. Add your first goal above!</p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-lg font-semibold">{goal.title}</h4>
                    {goal.description && (
                      <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                    )}
                  </div>
                  {!editingGoalId || editingGoalId !== goal.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => startEditing(goal)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-2">Target Date:</span>
                    <span className="text-gray-600">
                      {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-2">Status:</span>
                    <span className={`${goal.completed ? 'text-green-600' : 'text-blue-600'} font-medium`}>
                      {goal.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium mr-2">Progress:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`bg-blue-600 h-2.5 rounded-full`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium">{goal.progress}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => handleProgressUpdate(goal.id, parseInt(e.target.value))}
                        className="block w-full"
                      />
                    </label>
                    <span className="ml-3 font-medium">{goal.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningGoals;