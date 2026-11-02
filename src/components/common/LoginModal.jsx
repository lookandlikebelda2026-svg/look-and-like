import React, { useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  X,
  ArrowRight,
  UserPlus,
  LogIn
} from 'lucide-react';
import { LOGO_URL } from '../../constants/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';

/**
 * Unified Admin Authentication Modal
 * Pure UI layer. Verification, validation, and auth handling are delegated to `useAdminAuth`.
 */
export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  onNotify,
  initialMode = 'login',
}) {
  const {
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
  } = useAdminAuth({
    initialMode,
    onSuccess,
    onNotify,
    onClose,
  });

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-[#F0CDD7] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 overflow-y-auto relative bg-white">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-[#7A6B70] hover:text-deep-espresso hover:bg-[#FFF3F6] transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header branding */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center p-1.5">
                <img src={LOGO_URL} alt="Look & Like" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-base font-bold text-deep-espresso">
                Look &amp; Like
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-deep-espresso tracking-tight">
              {mode === 'login' ? 'Staff Sign In' : 'Register Admin'}
            </h2>
            <p className="text-xs text-[#7A6B70] mt-1">
              {mode === 'login'
                ? 'Authenticate via Firebase to access the salon management suite.'
                : 'Create a new staff or manager profile in Firebase Authentication.'}
            </p>
          </div>

          {/* Tab Switcher (Sign In vs Register) */}
          <div className="flex bg-[#FFF3F6] p-1 rounded-2xl mb-5 border border-[#F0CDD7]/70">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-deep-espresso shadow-sm'
                  : 'text-[#7A6B70] hover:text-deep-espresso'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-deep-espresso shadow-sm'
                  : 'text-[#7A6B70] hover:text-deep-espresso'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field only in Register mode */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-deep-espresso mb-1.5">
                  Full Name / Title
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A66B78]" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Master Stylist Elena"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#F0CDD7] focus:outline-none focus:border-[#D6204E] focus:ring-2 focus:ring-[#D6204E]/20 bg-[#FFFDFE] transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-deep-espresso mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A66B78]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lookandlike.com"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#F0CDD7] focus:outline-none focus:border-[#D6204E] focus:ring-2 focus:ring-[#D6204E]/20 bg-[#FFFDFE] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-deep-espresso mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A66B78]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Minimum 6 characters' : '••••••••'}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-2xl border border-[#F0CDD7] focus:outline-none focus:border-[#D6204E] focus:ring-2 focus:ring-[#D6204E]/20 bg-[#FFFDFE] transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6B70] hover:text-[#D6204E] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field only in Register mode */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-deep-espresso mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A66B78]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-2xl border border-[#F0CDD7] focus:outline-none focus:border-[#D6204E] focus:ring-2 focus:ring-[#D6204E]/20 bg-[#FFFDFE] transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6B70] hover:text-[#D6204E] transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me (Only in login mode) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#7A6B70]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D6204E] focus:ring-[#D6204E] accent-[#D6204E]"
                  />
                  <span>Remember this device</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D6204E] via-[#C41844] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] text-white text-xs sm:text-sm font-semibold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'register' ? 'Registering with Firebase...' : 'Verifying via Firebase...'}
                  </span>
                </>
              ) : (
                <>
                  <span>{mode === 'register' ? 'Create Admin Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Footer Switch */}
          <div className="mt-6 pt-4 border-t border-border-warm/60 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-[#7A6B70]">
                Need to add a new admin account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="font-bold text-[#D6204E] hover:underline cursor-pointer"
                >
                  Register Here
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#7A6B70]">
                Already have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="font-bold text-[#D6204E] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { LoginModal as AdminLoginModal };
export default LoginModal;
