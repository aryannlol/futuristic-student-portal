import { Outlet, useLocation, useNavigate } from 'react-router';
import { LayoutGrid, Compass, BookOpen, Upload, User } from 'lucide-react';
import { motion } from 'motion/react';

const dockItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
  { id: 'discover', label: 'Discover', icon: Compass, path: '/discover' },
  { id: 'modules', label: 'My Modules', icon: BookOpen, path: '/discover' },
  { id: 'submissions', label: 'Submissions', icon: Upload, path: '/submissions' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('discover') || path.includes('course')) return 'discover';
    if (path.includes('submissions')) return 'submissions';
    if (path.includes('profile')) return 'profile';
    return 'dashboard';
  };

  const activeItem = getActiveItem();

  return (
    <div className="relative min-h-screen pb-32">
      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <Outlet />
      </motion.div>

      {/* Floating Dock */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="glass-surface rounded-full px-3 py-3 flex items-center gap-2">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="relative group"
                aria-label={item.label}
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className={`
                    p-3 rounded-full transition-all duration-300
                    ${isActive 
                      ? 'bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/30' 
                      : 'bg-white/40 text-gray-700 hover:bg-white/60'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
