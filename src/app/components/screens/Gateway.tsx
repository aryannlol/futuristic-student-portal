import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export function Gateway() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [persistSession, setPersistSession] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: '',
  });

  const handleGoogleSignIn = () => {
    // Simulate Google Sign In - show first-time setup modal
    setShowModal(true);
  };

  // Calculate current semester from roll number
  const calculateSemester = (rollNumber: string): string => {
    // Extract year from roll number (e.g., "22BCS104" -> "22")
    const yearMatch = rollNumber.match(/^(\d{2})/);
    if (!yearMatch) return '1';
    
    const admissionYear = parseInt(`20${yearMatch[1]}`);
    const currentYear = 2026; // Current year
    const currentMonth = 2; // February
    
    // Calculate years since admission
    const yearsSinceAdmission = currentYear - admissionYear;
    
    // Calculate semester (2 semesters per year)
    // If current month is Jan-June, we're in even semester
    // If current month is Jul-Dec, we're in odd semester
    const baseSemester = yearsSinceAdmission * 2;
    const semester = currentMonth >= 7 ? baseSemester + 1 : baseSemester;
    
    // Cap at semester 8
    return Math.min(Math.max(semester, 1), 8).toString();
  };

  const handleComplete = () => {
    // Validate all fields are filled
    if (!formData.name || !formData.rollNumber || !formData.department) {
      return;
    }

    // Calculate current semester from roll number
    const semester = calculateSemester(formData.rollNumber);

    // Store user data in context and localStorage
    setUser({
      ...formData,
      semester,
      email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Main Glass Card */}
        <div className="glass-surface rounded-3xl p-12 text-center">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center"
          >
            <div className="text-white text-3xl font-semibold">U</div>
          </motion.div>

          <h1 className="text-3xl font-semibold mb-3 tracking-tight text-gray-900">
            University Portal
          </h1>
          <p className="text-gray-600 mb-8">
            Your gateway to academic excellence
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="glass-button w-full py-4 px-6 rounded-full flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Sign in with Google</span>
          </button>

          {/* Persistent Session Toggle */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPersistSession(!persistSession)}
              className={`
                w-12 h-6 rounded-full transition-all duration-300 relative
                ${persistSession ? 'bg-[#4F46E5]' : 'bg-gray-300'}
              `}
            >
              <motion.div
                animate={{ x: persistSession ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
            <span className="text-sm text-gray-600">Remember me</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Trusted by 50,000+ students worldwide
        </p>
      </motion.div>

      {/* First-Time User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-surface rounded-3xl p-8 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold mb-6 tracking-tight">
                Complete Your Profile
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Arjun Mehta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 221040104"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Bio-Technology">Bio-Technology</option>
                    <option value="Law">Law</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={!formData.name || !formData.rollNumber || !formData.department}
                className="w-full mt-6 py-4 px-6 rounded-full bg-[#4F46E5] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#4F46E5]/30 transition-all duration-300 active:scale-95"
              >
                Continue to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}