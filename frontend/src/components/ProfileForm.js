import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const ProfileForm = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    skills: [],
    interests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        setProfile({
          name: response.data.name || '',
          bio: response.data.bio || '',
          skills: Array.isArray(response.data.skills) ? response.data.skills : [],
          interests: Array.isArray(response.data.interests) ? response.data.interests : []
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillsChange = (e) => {
    const skill = e.target.value.trim();
    if (skill) {
      setProfile(prev => ({
        ...prev,
        skills: [...new Set([...prev.skills, skill])] // Avoid duplicates
      }));
      e.target.value = ''; // Clear input
    }
  };

  const handleInterestsChange = (e) => {
    const interest = e.target.value.trim();
    if (interest) {
      setProfile(prev => ({
        ...prev,
        interests: [...new Set([...prev.interests, interest])] // Avoid duplicates
      }));
      e.target.value = ''; // Clear input
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const removeInterest = (interestToRemove) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await userAPI.updateProfile(profile);
      setSuccess('Profile updated successfully!');
      // Update profile state with response
      setProfile({
        name: response.data.name || '',
        bio: response.data.bio || '',
        skills: Array.isArray(response.data.skills) ? response.data.skills : [],
        interests: Array.isArray(response.data.interests) ? response.data.interests : []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">Please log in to view your profile</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Skills</label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add a skill (e.g., JavaScript, Public Speaking)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSkillsChange(e);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              </input>
              <button
                onClick={(e) => handleSkillsChange(e)}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Skill
              </button>
            </div>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-xs hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No skills added yet</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Interests</label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add an interest (e.g., AI, Photography, Cooking)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleInterestsChange(e);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              </input>
              <button
                onClick={(e) => handleInterestsChange(e)}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Interest
              </button>
            </div>
            {profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-2 text-xs hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No interests added yet</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;