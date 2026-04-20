import { motion, AnimatePresence } from 'motion/react';
import { Clock, BookOpen, CheckCircle2, Calendar, ArrowRight, X, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';

interface TimetableSlot {
  code: string;
  name: string;
  time: string;
  room: string;
  status: 'current' | 'upcoming' | 'completed';
}

interface WeeklySlot {
  day: string;
  time: string;
  code: string;
  name: string;
  room: string;
}

const todaySchedule: TimetableSlot[] = [
  { code: 'DS102', name: 'Data Structures', time: '09:00', room: 'A-201', status: 'completed' },
  { code: 'MA201', name: 'Linear Algebra', time: '11:00', room: 'B-105', status: 'current' },
  { code: 'HU105', name: 'Professional Ethics', time: '14:00', room: 'C-301', status: 'upcoming' },
  { code: 'CS402', name: 'Neural Networks', time: '16:00', room: 'A-405', status: 'upcoming' },
];

const weeklySchedule: WeeklySlot[] = [
  // Monday
  { day: 'Mon', time: '09:00', code: 'DS102', name: 'Data Structures', room: 'A-201' },
  { day: 'Mon', time: '11:00', code: 'MA201', name: 'Linear Algebra', room: 'B-105' },
  { day: 'Mon', time: '16:00', code: 'CS402', name: 'Neural Networks', room: 'A-405' },
  // Tuesday
  { day: 'Tue', time: '09:00', code: 'DS102', name: 'Data Structures', room: 'A-201' },
  { day: 'Tue', time: '14:00', code: 'BT305', name: 'Genetic Engineering', room: 'C-102' },
  // Wednesday
  { day: 'Wed', time: '11:00', code: 'MA201', name: 'Linear Algebra', room: 'B-105' },
  { day: 'Wed', time: '14:00', code: 'HU105', name: 'Professional Ethics', room: 'C-301' },
  { day: 'Wed', time: '16:00', code: 'CS402', name: 'Neural Networks', room: 'A-405' },
  // Thursday
  { day: 'Thu', time: '09:00', code: 'DS102', name: 'Data Structures', room: 'A-201' },
  { day: 'Thu', time: '14:00', code: 'BT305', name: 'Genetic Engineering', room: 'C-102' },
  // Friday
  { day: 'Fri', time: '11:00', code: 'MA201', name: 'Linear Algebra', room: 'B-105' },
  { day: 'Fri', time: '14:00', code: 'HU105', name: 'Professional Ethics', room: 'C-301' },
];

const timeSlots = ['09:00', '11:00', '14:00', '16:00'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [countdown, setCountdown] = useState({ minutes: 14, seconds: 2 });
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const firstName = user?.name.split(' ')[0] || 'Student';

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    return { hour: currentHour, minute: currentMinute, totalMinutes: currentTime };
  };

  const isCurrentSlot = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const slotStart = hour * 60 + minute;
    const slotEnd = slotStart + 90; // Assuming 90-minute classes
    const current = getCurrentTimeSlot().totalMinutes;
    
    return current >= slotStart && current < slotEnd;
  };

  const getScheduleForDay = (day: string) => {
    return weeklySchedule.filter(slot => slot.day === day);
  };

  return (
    <div className="min-h-screen px-6 py-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-2">
            Namaste, {firstName} 🙏
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slot A - Hero (Next Class Countdown) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="md:col-span-2 glass-surface rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4F46E5]/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#4F46E5]" />
                <span className="text-sm font-medium text-gray-600">Next Class</span>
              </div>

              <h2 className="text-2xl font-semibold mb-2 tracking-tight">
                MA201 - Linear Algebra
              </h2>
              <p className="text-gray-600 mb-6">Room B-105</p>

              <div className="inline-flex items-center gap-4 px-6 py-4 bg-white/60 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl font-semibold tabular-nums text-[#4F46E5]">
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">minutes</div>
                </div>
                <div className="text-2xl text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-4xl font-semibold tabular-nums text-[#4F46E5]">
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">seconds</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Slot C - Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="space-y-6"
          >
            {/* Credits */}
            <div className="glass-surface rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold tabular-nums">18/24</div>
                  <div className="text-sm text-gray-600">Credits</div>
                </div>
              </div>
              <div className="w-full bg-white/60 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-2 rounded-full transition-all duration-500"
                  style={{ width: '75%' }}
                />
              </div>
            </div>

            {/* Pending Assignments */}
            <div className="glass-surface rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center pulse-subtle">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold tabular-nums">2</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/submissions')}
                className="w-full mt-4 text-sm text-[#4F46E5] hover:text-[#4338CA] font-medium flex items-center justify-center gap-1 group"
              >
                View Submissions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Slot B - Today's Timetable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="md:col-span-3 glass-surface rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold tracking-tight">Today's Schedule</h3>
              <button 
                onClick={() => setShowFullSchedule(true)}
                className="text-sm text-[#4F46E5] hover:text-[#4338CA] font-medium flex items-center gap-2 group"
              >
                Expand to Full Schedule
                <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {todaySchedule.map((slot, index) => (
                <motion.div
                  key={slot.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  className={`
                    flex-shrink-0 w-72 px-6 py-5 rounded-2xl border transition-all duration-300
                    ${slot.status === 'current' 
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-lg shadow-[#4F46E5]/30' 
                      : slot.status === 'completed'
                      ? 'bg-white/40 border-white/30 text-gray-500'
                      : 'bg-white/60 border-white/30 hover:bg-white/80'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className={`text-sm font-medium mb-1 tabular-nums ${
                        slot.status === 'current' ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {slot.time}
                      </div>
                      <div className={`font-semibold tabular-nums ${
                        slot.status === 'current' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {slot.code}
                      </div>
                    </div>
                    {slot.status === 'completed' && (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    )}
                    {slot.status === 'current' && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className={`text-sm mb-2 ${
                    slot.status === 'current' ? 'text-white/90' : 'text-gray-700'
                  }`}>
                    {slot.name}
                  </div>
                  <div className={`text-xs ${
                    slot.status === 'current' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {slot.room}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <button
              onClick={() => navigate('/discover')}
              className="glass-surface rounded-2xl p-6 hover:bg-white/70 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-6 h-6 text-[#4F46E5]" />
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold mb-1">Discover Courses</h4>
              <p className="text-sm text-gray-600">Browse and enroll in new modules</p>
            </button>

            <button
              onClick={() => navigate('/submissions')}
              className="glass-surface rounded-2xl p-6 hover:bg-white/70 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-6 h-6 text-[#F59E0B]" />
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold mb-1">Assignments</h4>
              <p className="text-sm text-gray-600">Submit and track your work</p>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="glass-surface rounded-2xl p-6 hover:bg-white/70 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-semibold mb-1">View Profile</h4>
              <p className="text-sm text-gray-600">Check your academic progress</p>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Full Weekly Schedule Modal */}
      <AnimatePresence>
        {showFullSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4"
            onClick={() => setShowFullSchedule(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-surface rounded-3xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto relative"
              style={{ backdropFilter: 'blur(40px)' }}
            >
              <button
                onClick={() => setShowFullSchedule(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold mb-6 tracking-tight">
                Weekly Timetable
              </h2>

              {/* Timetable Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="grid grid-cols-6 gap-3 mb-3">
                    <div className="text-sm font-medium text-gray-600">Time</div>
                    {days.map(day => (
                      <div key={day} className="text-sm font-medium text-gray-600 text-center">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Time Slots */}
                  {timeSlots.map(time => (
                    <div key={time} className="grid grid-cols-6 gap-3 mb-3">
                      <div className="flex items-center text-sm font-medium text-gray-700 tabular-nums">
                        {time}
                      </div>
                      {days.map(day => {
                        const slot = weeklySchedule.find(s => s.day === day && s.time === time);
                        const isCurrent = slot && isCurrentSlot(time) && day === ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][new Date().getDay() - 1];
                        
                        return (
                          <div key={`${day}-${time}`} className="relative">
                            {slot ? (
                              <div className={`
                                p-3 rounded-xl text-center transition-all duration-300
                                ${isCurrent 
                                  ? 'bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/30' 
                                  : 'bg-white/60 hover:bg-white/80'
                                }
                              `}>
                                {isCurrent && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
                                )}
                                <div className={`text-xs font-semibold mb-1 tabular-nums ${
                                  isCurrent ? 'text-white' : 'text-[#4F46E5]'
                                }`}>
                                  {slot.code}
                                </div>
                                <div className={`text-xs ${
                                  isCurrent ? 'text-white/90' : 'text-gray-600'
                                }`}>
                                  {slot.room}
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 rounded-xl bg-white/20 border border-white/30" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-white/30 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#4F46E5]" />
                  <span className="text-gray-600">Current Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/60" />
                  <span className="text-gray-600">Scheduled</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
