import { useState, useEffect } from 'react';
import { verifyAdminLogin, verifyAdminRegistration } from '../services/authService';

/**
 * Custom hook to handle admin authentication and verification.
 * Decouples verification, validation, and submission logic from the modal view.
 *
 * @param {Object} options
 * @param {'login' | 'register'} [options.initialMode='login'] - Initial tab mode
 * @param {Function} [options.onSuccess] - Callback when authentication succeeds
 * @param {Function} [options.onNotify] - Toast notification function
 * @param {Function} [options.onClose] - Modal close callback
 */
export function useAdminAuth({
  initialMode = 'login',
  onSuccess,
  onNotify,
  onClose,
} = {}) {
  const [mode, setMode] = useState(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize with external changes to initialMode
  useEffect(() => {
    setMode(initialMode || 'login');
    setError(null);
  }, [initialMode]);

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        const result = await verifyAdminRegistration({
          email,
          password,
          confirmPassword,
          displayName,
        });

        if (result.success) {
          onNotify?.(
            `Welcome to the team, ${result.user.displayName || displayName}!`,
            'success'
          );
          onSuccess?.(result.user);
          onClose?.();
        } else {
          setError(result.error || 'Failed to create admin account. Please verify credentials.');
        }
      } else {
        const result = await verifyAdminLogin({
          email,
          password,
          remember,
        });

        if (result.success) {
          onNotify?.(
            `Welcome back, ${result.user.displayName || 'Administrator'}!`,
            'success'
          );
          onSuccess?.(result.user);
          onClose?.();
        } else {
          setError(result.error || 'Authentication failed. Please verify credentials.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication encountered an unexpected error.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mode,
    displayName,
    email,
    password,
    confirmPassword,
    remember,
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    setDisplayName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setRemember,
    setShowPassword,
    setShowConfirmPassword,
    handleSwitchMode,
    handleSubmit,
    setError,
  };
}

export default useAdminAuth;

