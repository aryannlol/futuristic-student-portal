import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, BookOpen, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  seats: number;
  totalSeats: number;
  status: 'open' | 'full' | 'closed';
  prerequisites?: string[];
  prerequisitesCompleted?: boolean;
  professor: string;
  schedule: string;
}

const allCourses: Course[] = [
  // Computer Science Courses
  {
    id: 'cs402',
    code: 'CS402',
    name: 'Neural Networks & Deep Learning',
    department: 'Computer Science',
    credits: 4,
    seats: 8,
    totalSeats: 50,
    status: 'open',
    prerequisites: ['CS201'],
    prerequisitesCompleted: true,
    professor: 'Dr. Priya Sharma',
    schedule: 'Mon, Wed 16:00-17:30'
  },
  {
    id: 'cs301',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    department: 'Computer Science',
    credits: 4,
    seats: 15,
    totalSeats: 60,
    status: 'open',
    prerequisites: [],
    prerequisitesCompleted: true,
    professor: 'Prof. Rajesh Kumar',
    schedule: 'Tue, Thu 09:00-10:30'
  },
  {
    id: 'cs501',
    code: 'CS501',
    name: 'Machine Learning',
    department: 'Computer Science',
    credits: 4,
    seats: 5,
    totalSeats: 45,
    status: 'open',
    prerequisites: ['CS301', 'MA401'],
    prerequisitesCompleted: true,
    professor: 'Dr. Ananya Iyer',
    schedule: 'Mon, Wed 14:00-15:30'
  },
  {
    id: 'cs601',
    code: 'CS601',
    name: 'Artificial Intelligence',
    department: 'Computer Science',
    credits: 4,
    seats: 0,
    totalSeats: 40,
    status: 'full',
    prerequisites: ['CS501'],
    prerequisitesCompleted: true,
    professor: 'Prof. David Chen',
    schedule: 'Tue, Thu 11:00-12:30'
  },
  {
    id: 'cs403',
    code: 'CS403',
    name: 'Computer Networks',
    department: 'Computer Science',
    credits: 3,
    seats: 22,
    totalSeats: 55,
    status: 'open',
    professor: 'Dr. Kenji Tanaka',
    schedule: 'Mon, Wed 10:00-11:30'
  },
  {
    id: 'cs504',
    code: 'CS504',
    name: 'Cloud Computing',
    department: 'Computer Science',
    credits: 4,
    seats: 18,
    totalSeats: 50,
    status: 'open',
    prerequisites: ['CS403'],
    prerequisitesCompleted: false,
    professor: 'Prof. Sarah Mitchell',
    schedule: 'Tue, Thu 14:00-15:30'
  },
  {
    id: 'cs603',
    code: 'CS603',
    name: 'Cybersecurity',
    department: 'Computer Science',
    credits: 3,
    seats: 12,
    totalSeats: 40,
    status: 'open',
    prerequisites: ['CS403'],
    prerequisitesCompleted: true,
    professor: 'Dr. Ahmed Al-Rashid',
    schedule: 'Wed, Fri 09:00-10:30'
  },
  {
    id: 'cs502',
    code: 'CS502',
    name: 'Software Engineering',
    department: 'Computer Science',
    credits: 4,
    seats: 28,
    totalSeats: 70,
    status: 'open',
    professor: 'Prof. Lisa Wang',
    schedule: 'Mon, Wed, Fri 11:00-12:00'
  },
  {
    id: 'cs604',
    code: 'CS604',
    name: 'Blockchain Technology',
    department: 'Computer Science',
    credits: 3,
    seats: 10,
    totalSeats: 35,
    status: 'open',
    prerequisites: ['CS302'],
    prerequisitesCompleted: true,
    professor: 'Dr. Marcus Johnson',
    schedule: 'Tue, Thu 16:00-17:30'
  },
  {
    id: 'cs503',
    code: 'CS503',
    name: 'Web Technologies',
    department: 'Computer Science',
    credits: 3,
    seats: 25,
    totalSeats: 60,
    status: 'open',
    professor: 'Prof. Emily Rodriguez',
    schedule: 'Mon, Wed 13:00-14:30'
  },
  
  // Mathematics Courses
  {
    id: 'ma201',
    code: 'MA201',
    name: 'Linear Algebra',
    department: 'Mathematics',
    credits: 3,
    seats: 0,
    totalSeats: 45,
    status: 'full',
    professor: 'Dr. Chen Wei',
    schedule: 'Mon, Wed, Fri 11:00-12:00'
  },
  {
    id: 'ma401',
    code: 'MA401',
    name: 'Probability & Statistics',
    department: 'Mathematics',
    credits: 4,
    seats: 16,
    totalSeats: 50,
    status: 'open',
    prerequisites: ['MA101'],
    prerequisitesCompleted: true,
    professor: 'Prof. Sophie Laurent',
    schedule: 'Tue, Thu 10:00-11:30'
  },
  {
    id: 'ma301',
    code: 'MA301',
    name: 'Discrete Mathematics',
    department: 'Mathematics',
    credits: 3,
    seats: 20,
    totalSeats: 55,
    status: 'open',
    professor: 'Dr. Robert Singh',
    schedule: 'Mon, Wed 15:00-16:30'
  },
  {
    id: 'ma501',
    code: 'MA501',
    name: 'Numerical Methods',
    department: 'Mathematics',
    credits: 3,
    seats: 14,
    totalSeats: 40,
    status: 'open',
    prerequisites: ['MA201'],
    prerequisitesCompleted: false,
    professor: 'Prof. Isabella Rossi',
    schedule: 'Tue, Thu 13:00-14:30'
  },
  
  // Bio-Technology Courses
  {
    id: 'bt305',
    code: 'BT305',
    name: 'Genetic Engineering',
    department: 'Bio-Technology',
    credits: 4,
    seats: 20,
    totalSeats: 40,
    status: 'open',
    prerequisites: ['BT201', 'BT202'],
    prerequisitesCompleted: false,
    professor: 'Dr. Ananya Iyer',
    schedule: 'Tue, Thu 14:00-15:30'
  },
  {
    id: 'bt401',
    code: 'BT401',
    name: 'Molecular Biology',
    department: 'Bio-Technology',
    credits: 4,
    seats: 18,
    totalSeats: 45,
    status: 'open',
    prerequisites: ['BT201'],
    prerequisitesCompleted: true,
    professor: 'Prof. James Peterson',
    schedule: 'Mon, Wed 09:00-10:30'
  },
  {
    id: 'bt502',
    code: 'BT502',
    name: 'Bioinformatics',
    department: 'Bio-Technology',
    credits: 3,
    seats: 22,
    totalSeats: 35,
    status: 'open',
    prerequisites: ['BT401', 'CS201'],
    prerequisitesCompleted: true,
    professor: 'Dr. Maria Garcia',
    schedule: 'Wed, Fri 14:00-15:30'
  },
  {
    id: 'bt601',
    code: 'BT601',
    name: 'Bioprocess Engineering',
    department: 'Bio-Technology',
    credits: 4,
    seats: 12,
    totalSeats: 30,
    status: 'open',
    professor: 'Prof. Hiroshi Yamamoto',
    schedule: 'Tue, Thu 11:00-12:30'
  },
  
  // Law Courses
  {
    id: 'law201',
    code: 'LAW201',
    name: 'Constitutional Law',
    department: 'Law',
    credits: 4,
    seats: 12,
    totalSeats: 35,
    status: 'open',
    professor: 'Adv. Arjun Malhotra',
    schedule: 'Mon, Wed 10:00-11:30'
  },
  {
    id: 'law301',
    code: 'LAW301',
    name: 'Corporate Law',
    department: 'Law',
    credits: 4,
    seats: 8,
    totalSeats: 40,
    status: 'open',
    prerequisites: ['LAW201'],
    prerequisitesCompleted: true,
    professor: 'Prof. Nadia Ahmed',
    schedule: 'Tue, Thu 09:00-10:30'
  },
  {
    id: 'law401',
    code: 'LAW401',
    name: 'International Law',
    department: 'Law',
    credits: 3,
    seats: 15,
    totalSeats: 35,
    status: 'open',
    professor: 'Dr. William Brooks',
    schedule: 'Mon, Wed 14:00-15:30'
  },
  {
    id: 'law501',
    code: 'LAW501',
    name: 'Intellectual Property Rights',
    department: 'Law',
    credits: 3,
    seats: 10,
    totalSeats: 30,
    status: 'open',
    prerequisites: ['LAW301'],
    prerequisitesCompleted: true,
    professor: 'Adv. Priya Kapoor',
    schedule: 'Wed, Fri 11:00-12:30'
  },
  {
    id: 'law601',
    code: 'LAW601',
    name: 'Environmental Law',
    department: 'Law',
    credits: 3,
    seats: 0,
    totalSeats: 25,
    status: 'full',
    professor: 'Prof. Andreas Schmidt',
    schedule: 'Tue, Thu 15:00-16:30'
  },
  
  // Humanities Courses
  {
    id: 'hu105',
    code: 'HU105',
    name: 'Professional Ethics & Communication',
    department: 'Humanities',
    credits: 2,
    seats: 25,
    totalSeats: 80,
    status: 'open',
    professor: 'Prof. Fatima Hassan',
    schedule: 'Wed 14:00-16:00'
  },
  {
    id: 'hu301',
    code: 'HU301',
    name: 'Ethics in Technology',
    department: 'Humanities',
    credits: 2,
    seats: 30,
    totalSeats: 60,
    status: 'open',
    professor: 'Dr. Thomas Anderson',
    schedule: 'Fri 10:00-12:00'
  },
  {
    id: 'hu401',
    code: 'HU401',
    name: 'Business Communication',
    department: 'Humanities',
    credits: 2,
    seats: 18,
    totalSeats: 50,
    status: 'open',
    professor: 'Prof. Rachel Green',
    schedule: 'Thu 13:00-15:00'
  },
  {
    id: 'hu501',
    code: 'HU501',
    name: 'Leadership & Management',
    department: 'Humanities',
    credits: 3,
    seats: 22,
    totalSeats: 45,
    status: 'open',
    professor: 'Dr. Michael Thompson',
    schedule: 'Mon, Wed 16:00-17:30'
  },
  
  // Engineering Courses
  {
    id: 'eng301',
    code: 'ENG301',
    name: 'Digital Signal Processing',
    department: 'Engineering',
    credits: 4,
    seats: 14,
    totalSeats: 45,
    status: 'open',
    prerequisites: ['MA201'],
    prerequisitesCompleted: true,
    professor: 'Prof. Vikram Patel',
    schedule: 'Mon, Wed 11:00-12:30'
  },
  {
    id: 'eng401',
    code: 'ENG401',
    name: 'Control Systems',
    department: 'Engineering',
    credits: 4,
    seats: 10,
    totalSeats: 40,
    status: 'open',
    prerequisites: ['ENG301'],
    prerequisitesCompleted: false,
    professor: 'Dr. Olivia Martinez',
    schedule: 'Tue, Thu 10:00-11:30'
  },
  {
    id: 'eng501',
    code: 'ENG501',
    name: 'Robotics',
    department: 'Engineering',
    credits: 4,
    seats: 6,
    totalSeats: 30,
    status: 'open',
    prerequisites: ['ENG401'],
    prerequisitesCompleted: true,
    professor: 'Prof. Daniel Kim',
    schedule: 'Mon, Wed 13:00-14:30'
  },
  {
    id: 'eng601',
    code: 'ENG601',
    name: 'Internet of Things',
    department: 'Engineering',
    credits: 3,
    seats: 20,
    totalSeats: 50,
    status: 'open',
    professor: 'Dr. Samantha Lee',
    schedule: 'Wed, Fri 15:00-16:30'
  },
  
  // Business Courses
  {
    id: 'bus301',
    code: 'BUS301',
    name: 'Financial Accounting',
    department: 'Business',
    credits: 3,
    seats: 25,
    totalSeats: 60,
    status: 'open',
    professor: 'Prof. Jonathan Davis',
    schedule: 'Tue, Thu 09:00-10:30'
  },
  {
    id: 'bus401',
    code: 'BUS401',
    name: 'Marketing Management',
    department: 'Business',
    credits: 3,
    seats: 15,
    totalSeats: 55,
    status: 'open',
    prerequisites: ['BUS301'],
    prerequisitesCompleted: true,
    professor: 'Dr. Sophia Williams',
    schedule: 'Mon, Wed 10:00-11:30'
  },
  {
    id: 'bus501',
    code: 'BUS501',
    name: 'Strategic Management',
    department: 'Business',
    credits: 4,
    seats: 12,
    totalSeats: 45,
    status: 'open',
    prerequisites: ['BUS401'],
    prerequisitesCompleted: true,
    professor: 'Prof. Ryan Collins',
    schedule: 'Tue, Thu 13:00-14:30'
  },
  {
    id: 'bus601',
    code: 'BUS601',
    name: 'Entrepreneurship',
    department: 'Business',
    credits: 3,
    seats: 0,
    totalSeats: 40,
    status: 'full',
    professor: 'Dr. Nina Patel',
    schedule: 'Wed, Fri 11:00-12:30'
  },
];

const departments = ['All', 'Computer Science', 'Bio-Technology', 'Law', 'Mathematics', 'Humanities', 'Engineering', 'Business'];
const creditFilters = ['All', '2', '3', '4'];
const statusFilters = ['All', 'Open', 'Full'];

export function Discover() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCredits, setSelectedCredits] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || course.department === selectedDept;
    const matchesCredits = selectedCredits === 'All' || course.credits === parseInt(selectedCredits);
    const matchesStatus = selectedStatus === 'All' || course.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDept && matchesCredits && matchesStatus;
  });

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
            Discover Modules
          </h1>
          <p className="text-gray-600">
            Browse and enroll in courses for this semester
          </p>
        </motion.div>

        {/* Command Bar Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-6"
        >
          <div className="glass-surface rounded-2xl p-4 flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by name or code... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${showFilters ? 'bg-[#4F46E5] text-white' : 'hover:bg-white/60'}
              `}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 glass-surface rounded-2xl p-6"
          >
            <div className="space-y-4">
              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${selectedDept === dept 
                          ? 'bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/30' 
                          : 'bg-white/60 hover:bg-white/80'
                        }
                      `}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Credits Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                <div className="flex flex-wrap gap-2">
                  {creditFilters.map(credit => (
                    <button
                      key={credit}
                      onClick={() => setSelectedCredits(credit)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 tabular-nums
                        ${selectedCredits === credit 
                          ? 'bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/30' 
                          : 'bg-white/60 hover:bg-white/80'
                        }
                      `}
                    >
                      {credit === 'All' ? 'All Credits' : `${credit} Credits`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${selectedStatus === status 
                          ? 'bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/30' 
                          : 'bg-white/60 hover:bg-white/80'
                        }
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/course/${course.id}`)}
              className="glass-surface rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {course.status === 'full' ? (
                  <span className="px-3 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs font-medium rounded-full">
                    Full
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-xs font-medium rounded-full">
                    Open
                  </span>
                )}
              </div>

              {/* Course Code */}
              <div className="text-2xl font-semibold mb-2 tracking-tight tabular-nums group-hover:text-[#4F46E5] transition-colors">
                {course.code}
              </div>

              {/* Course Name */}
              <h3 className="font-medium mb-4 text-gray-900 line-clamp-2">
                {course.name}
              </h3>

              {/* Course Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="tabular-nums">{course.credits} Credits</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="tabular-nums">{course.professor}</span>
                </div>
              </div>

              {/* Seats Available */}
              {course.status === 'open' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Seats Available</span>
                    <span className={`font-medium tabular-nums ${course.seats < 10 ? 'text-[#EF4444] pulse-subtle' : 'text-gray-900'}`}>
                      {course.seats}/{course.totalSeats}
                    </span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        course.seats < 10 ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                      }`}
                      style={{ width: `${(course.seats / course.totalSeats) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  {course.prerequisitesCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">
                        Prerequisites: <span className="font-medium tabular-nums">{course.prerequisites.join(', ')}</span> ✅
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">
                        Requires: <span className="font-medium tabular-nums">{course.prerequisites.join(', ')}</span>
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/0 to-transparent group-hover:from-[#4F46E5]/5 transition-all duration-300 pointer-events-none rounded-2xl" />
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}