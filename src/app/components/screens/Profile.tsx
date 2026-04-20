import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, BookOpen, Award, Calendar, TrendingUp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';

interface CourseGrade {
  code: string;
  name: string;
  credits: number;
  grade: string;
  gpa: number;
  semester: number;
}

// All courses across all semesters
const allCourses: CourseGrade[] = [
  // Semester 1
  { semester: 1, code: 'CS101', name: 'Programming Fundamentals', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 1, code: 'MA101', name: 'Calculus I', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 1, code: 'PH101', name: 'Physics I', credits: 3, grade: 'B+', gpa: 8.5 },
  { semester: 1, code: 'EN101', name: 'English Communication', credits: 3, grade: 'A', gpa: 9.0 },
  { semester: 1, code: 'HU101', name: 'Introduction to Philosophy', credits: 2, grade: 'A+', gpa: 10.0 },
  
  // Semester 2
  { semester: 2, code: 'CS201', name: 'Object-Oriented Programming', credits: 4, grade: 'A+', gpa: 10.0 },
  { semester: 2, code: 'MA201', name: 'Calculus II', credits: 3, grade: 'A+', gpa: 10.0 },
  { semester: 2, code: 'CS202', name: 'Digital Logic Design', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 2, code: 'PH201', name: 'Electromagnetism', credits: 3, grade: 'A', gpa: 9.0 },
  { semester: 2, code: 'EN201', name: 'Technical Writing', credits: 2, grade: 'A+', gpa: 10.0 },
  
  // Semester 3
  { semester: 3, code: 'CS301', name: 'Data Structures', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 3, code: 'CS302', name: 'Database Management Systems', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 3, code: 'MA301', name: 'Discrete Mathematics', credits: 3, grade: 'B+', gpa: 8.5 },
  { semester: 3, code: 'CS303', name: 'Computer Architecture', credits: 4, grade: 'A+', gpa: 10.0 },
  { semester: 3, code: 'HU301', name: 'Ethics in Technology', credits: 2, grade: 'A', gpa: 9.0 },
  
  // Semester 4
  { semester: 4, code: 'CS401', name: 'Algorithms', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 4, code: 'CS402', name: 'Operating Systems', credits: 4, grade: 'A+', gpa: 10.0 },
  { semester: 4, code: 'MA401', name: 'Probability & Statistics', credits: 3, grade: 'A', gpa: 9.0 },
  { semester: 4, code: 'CS403', name: 'Computer Networks', credits: 4, grade: 'A+', gpa: 10.0 },
  { semester: 4, code: 'HU401', name: 'Professional Communication', credits: 2, grade: 'A', gpa: 9.0 },
  
  // Semester 5
  { semester: 5, code: 'CS501', name: 'Machine Learning', credits: 4, grade: 'A+', gpa: 10.0 },
  { semester: 5, code: 'CS502', name: 'Software Engineering', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 5, code: 'CS503', name: 'Web Technologies', credits: 3, grade: 'A', gpa: 9.0 },
  { semester: 5, code: 'CS504', name: 'Cloud Computing', credits: 4, grade: 'A+', gpa: 10.0 },
  { semester: 5, code: 'HU501', name: 'Business Communication', credits: 2, grade: 'A', gpa: 9.0 },
  
  // Semester 6
  { semester: 6, code: 'CS601', name: 'Artificial Intelligence', credits: 4, grade: 'A+', gpa: 10.0 },
  { semester: 6, code: 'CS602', name: 'Distributed Systems', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 6, code: 'CS603', name: 'Cybersecurity', credits: 3, grade: 'A+', gpa: 10.0 },
  { semester: 6, code: 'CS604', name: 'Blockchain Technology', credits: 4, grade: 'A', gpa: 9.0 },
  { semester: 6, code: 'CS605', name: 'Capstone Project I', credits: 3, grade: 'A+', gpa: 10.0 },
];

export function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [selectedSemester, setSelectedSemester] = useState(
    user ? parseInt(user.semester) : 4
  );

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  // Get courses for selected semester
  const getCoursesForSemester = (sem: number) => {
    return allCourses.filter(c => c.semester === sem);
  };

  // Calculate CGPA up to selected semester
  const calculateCGPA = (upToSemester: number) => {
    const relevantCourses = allCourses.filter(c => c.semester <= upToSemester);
    const totalCredits = relevantCourses.reduce((acc, c) => acc + c.credits, 0);
    const totalPoints = relevantCourses.reduce((acc, c) => acc + (c.gpa * c.credits), 0);
    return totalPoints / totalCredits;
  };

  // Calculate semester GPA
  const calculateSemesterGPA = (sem: number) => {
    const courses = getCoursesForSemester(sem);
    const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
    const totalPoints = courses.reduce((acc, c) => acc + (c.gpa * c.credits), 0);
    return totalPoints / totalCredits;
  };

  const selectedCourses = getCoursesForSemester(selectedSemester);
  const semesterGPA = calculateSemesterGPA(selectedSemester);
  const cgpa = calculateCGPA(selectedSemester);
  const totalCredits = allCourses.filter(c => c.semester <= selectedSemester).reduce((acc, c) => acc + c.credits, 0);

  const availableSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const completedSemesters = [...new Set(allCourses.map(c => c.semester))];

  if (!user) return null;

  return (
    <div className="min-h-screen px-6 py-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-2">
            Profile
          </h1>
          <p className="text-gray-600">
            Your academic information and progress
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Card */}
            <div className="glass-surface rounded-3xl p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                <span className="text-white text-3xl font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>

              <h2 className="text-2xl font-semibold mb-1 tracking-tight">{user.name}</h2>
              <p className="text-gray-600 mb-6 tabular-nums">{user.rollNumber}</p>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{user.department}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 tabular-nums">Semester {user.semester}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-6 py-3 px-4 rounded-full bg-white/60 hover:bg-white/80 transition-all duration-300 flex items-center justify-center gap-2 text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* GPA Stats */}
            <div className="glass-surface rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="font-semibold">Academic Performance</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Semester {selectedSemester} GPA</span>
                    <span className="text-2xl font-semibold text-[#4F46E5] tabular-nums">
                      {semesterGPA.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(semesterGPA / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CGPA (Sem 1-{selectedSemester})</span>
                    <span className="text-xl font-semibold tabular-nums">
                      {cgpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Credits</span>
                    <span className="text-xl font-semibold tabular-nums">
                      {totalCredits}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - CGPA Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Semester Selector */}
            <div className="glass-surface rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="text-xl font-semibold tracking-tight">CGPA Analytics Engine</h3>
              </div>

              {/* Pill Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                {availableSemesters.map(sem => {
                  const isCompleted = completedSemesters.includes(sem);
                  const isSelected = selectedSemester === sem;
                  
                  return (
                    <button
                      key={sem}
                      onClick={() => isCompleted && setSelectedSemester(sem)}
                      disabled={!isCompleted}
                      className={`
                        px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 tabular-nums
                        ${isSelected 
                          ? 'bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/30 scale-105' 
                          : isCompleted
                          ? 'bg-white/60 hover:bg-white/80 text-gray-900'
                          : 'bg-white/20 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      Sem {sem}
                    </button>
                  );
                })}
              </div>

              {/* CGPA Display */}
              <div className="bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-2xl p-8 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Cumulative GPA (Semester 1 to {selectedSemester})</div>
                  <div className="text-6xl font-semibold text-[#4F46E5] mb-4 tabular-nums">
                    {cgpa.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 mb-4 tabular-nums">
                    Based on {totalCredits} credits across {selectedSemester} semester{selectedSemester > 1 ? 's' : ''}
                  </div>
                  
                  {/* CGPA Formula */}
                  <div className="inline-block px-6 py-3 bg-white/60 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Calculation Formula</div>
                    <div className="font-mono text-sm text-gray-700">
                      CGPA = Σ(C<sub>i</sub> × G<sub>i</sub>) / ΣC<sub>i</sub>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course List for Selected Semester */}
              <div>
                <h4 className="font-semibold mb-4">Semester {selectedSemester} Courses</h4>
                <div className="space-y-3">
                  {selectedCourses.map((course, index) => (
                    <motion.div
                      key={course.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white/40 rounded-xl hover:bg-white/60 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                          <span className="text-white font-semibold text-sm tabular-nums">
                            {course.code.match(/\d+/)?.[0].slice(0, 2) || course.code.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 tabular-nums">{course.code}</div>
                          <div className="text-sm text-gray-600">{course.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-600 tabular-nums">{course.credits} Credits</div>
                          <div className="text-xs text-gray-500 tabular-nums">GPA: {course.gpa.toFixed(1)}</div>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">{course.grade}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Semester Summary */}
                <div className="mt-6 pt-6 border-t border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">
                      <span className="font-medium tabular-nums">
                        {selectedCourses.reduce((acc, c) => acc + c.credits, 0)}
                      </span> Credits Completed
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Semester GPA</div>
                      <div className="text-2xl font-semibold text-[#4F46E5] tabular-nums">
                        {semesterGPA.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-surface rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-xl font-semibold tracking-tight">Achievements</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/40 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Dean's List</div>
                    <div className="text-sm text-gray-600">Semester 2</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/40 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Top Performer</div>
                    <div className="text-sm text-gray-600">DS102</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}