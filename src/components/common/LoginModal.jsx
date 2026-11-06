import React, { useEffect } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { LOGO_URL } from '../../constants/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';

/**
 * Admin Authentication Modal (Sign In Only)
 * Pure UI layer. Verification, validation, and auth handling are delegated to `useAdminAuth`.
 */
export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  onNotify,
}) {
  const {
    email,
    password,
    remember,
    showPassword,
    isLoading,
    error,
    setEmail,
    setPassword,
    setRemember,
    setShowPassword,
    handleSubmit,
  } = useAdminAuth({
    initialMode: 'login',
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
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src={LOGO_URL} alt="Look & Like" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-base font-bold text-deep-espresso">
                Look &amp; Like
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-deep-espresso tracking-tight">
              Staff Sign In
            </h2>
            <p className="text-xs text-[#7A6B70] mt-1">
              Authenticate via Firebase to access the parlour management suite.
            </p>
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
                  placeholder="••••••••"
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

            {/* Remember Me */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D6204E] via-[#C41844] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] text-white text-xs sm:text-sm font-semibold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying via Firebase...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure Admin Notice */}
          <div className="mt-6 pt-4 border-t border-border-warm/60 flex items-center justify-center gap-1.5 text-center text-xs text-[#7A6B70]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D6204E]" />
            <span>Authorized staff only. Registration is restricted.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LoginModal as AdminLoginModal };
export default LoginModal;
