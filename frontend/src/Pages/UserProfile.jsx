import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userAPI } from '../utils/api';
import '../Style/UserProfile.css';

function UserProfile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        const response = await userAPI.getUserProfile();
        const user = response.user || response.data || response.data?.user;
        if (!user) {
          toast.error('No user data returned from server');
          navigate('/dashboard');
          return;
        }
        setUserInfo(user);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          instagram: user.instagram || '',
          facebook: user.facebook || '',
          twitter: user.twitter || '',
          linkedin: user.linkedin || '',
        });
      } catch (error) {
        toast.error('Failed to load profile');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await userAPI.updateUserProfile(formData);
      console.log('Profile update response:', response);
      
      // The response will have the updated user in response.user
      const updatedUser = response.user || response.data || response.data?.user;
      
      if (updatedUser) {
        // Update the component state with the new user data
        setUserInfo(updatedUser);
        
        // Update form data to reflect changes
        setFormData({
          name: updatedUser.name || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          instagram: updatedUser.instagram || '',
          facebook: updatedUser.facebook || '',
          twitter: updatedUser.twitter || '',
          linkedin: updatedUser.linkedin || '',
        });
        
        // Update localStorage with the new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error('No user data returned from server');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      await userAPI.deleteUserProfile();
      toast.success('Profile deleted successfully');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to delete profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        instagram: userInfo.instagram || '',
        facebook: userInfo.facebook || '',
        twitter: userInfo.twitter || '',
        linkedin: userInfo.linkedin || '',
      });
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="user-profile-container">
      <div 
        className="profile-overlay" 
        onClick={() => navigate('/dashboard')}
      />
      
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>My Profile</h2>
          <p className="profile-role">{userInfo.role === 'admin' ? 'Administrator' : 'Patient'}</p>
        </div>

        {!isEditing ? (
          <div className="profile-view-mode">
            <div className="profile-info-grid">
              <div className="profile-field">
                <label>Name</label>
                <p className="profile-value">{userInfo.name || 'Not provided'}</p>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <p className="profile-value">{userInfo.email || 'Not provided'}</p>
              </div>

              <div className="profile-field">
                <label>Phone</label>
                <p className="profile-value">{userInfo.phone || 'Not provided'}</p>
              </div>

              <div className="profile-field">
                <label>Instagram</label>
                <p className="profile-value">
                  {userInfo.instagram ? (
                    <a href={`https://instagram.com/${userInfo.instagram}`} target="_blank" rel="noopener noreferrer">
                      @{userInfo.instagram}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>

              <div className="profile-field">
                <label>Facebook</label>
                <p className="profile-value">
                  {userInfo.facebook ? (
                    <a href={`https://facebook.com/${userInfo.facebook}`} target="_blank" rel="noopener noreferrer">
                      {userInfo.facebook}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>

              <div className="profile-field">
                <label>Twitter</label>
                <p className="profile-value">
                  {userInfo.twitter ? (
                    <a href={`https://twitter.com/${userInfo.twitter}`} target="_blank" rel="noopener noreferrer">
                      @{userInfo.twitter}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>

              <div className="profile-field">
                <label>LinkedIn</label>
                <p className="profile-value">
                  {userInfo.linkedin ? (
                    <a href={`https://linkedin.com/in/${userInfo.linkedin}`} target="_blank" rel="noopener noreferrer">
                      {userInfo.linkedin}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className="btn-edit" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button 
                className="btn-delete" 
                onClick={handleDeleteProfile}
              >
                Delete Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="profile-edit-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="instagram">Instagram</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="Instagram username (without @)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="facebook">Facebook</label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="Facebook profile ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="twitter">Twitter</label>
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="Twitter username (without @)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="LinkedIn profile ID"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-save"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
