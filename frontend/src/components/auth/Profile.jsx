import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Save } from 'lucide-react';

const profileSchema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'New password must be at least 6 characters').required('New password is required'),
  confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileUpdate = async (data) => {
    setIsUpdating(true);
    await updateProfile(data);
    setIsUpdating(false);
  };

  const onPasswordChange = async (data) => {
    setIsChangingPassword(true);
    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    setIsChangingPassword(false);
    if (result.success) {
      setShowPasswordForm(false);
      resetPassword();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <div className="card animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  {...registerProfile('name')}
                  className="input-field pl-10"
                />
              </div>
              {profileErrors.name && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  {...registerProfile('email')}
                  className="input-field pl-10"
                />
              </div>
              {profileErrors.email && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="btn-primary flex items-center justify-center"
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="card animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
          
          {!showPasswordForm ? (
            <div>
              <p className="text-gray-600 mb-4">Change your password to keep your account secure.</p>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn-secondary flex items-center justify-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  {...registerPassword('currentPassword')}
                  className="input-field"
                  placeholder="Enter current password"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  {...registerPassword('newPassword')}
                  className="input-field"
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...registerPassword('confirmNewPassword')}
                  className="input-field"
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirmNewPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmNewPassword.message}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="btn-primary flex-1"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    resetPassword();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="mt-6 card animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Account Created</p>
            <p className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Status</p>
            <p className="font-medium">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium capitalize">{user?.role || 'User'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Login</p>
            <p className="font-medium">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;