import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Clock, Users, Calendar, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CourseDetail {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  seats: number;
  totalSeats: number;
  professor: string;
  schedule: string;
  description: string;
  prerequisites?: string[];
  prerequisitesCompleted?: boolean;
  syllabus: string[];
  learningOutcomes: string[];
  currentCredits?: number;
  maxCredits?: number;
  hasScheduleConflict?: boolean;
  conflictingCourse?: string;
}

const courseData: { [key: string]: CourseDetail } = {
  'cs402': {
    id: 'cs402',
    code: 'CS402',
    name: 'Neural Networks & Deep Learning',
    department: 'Computer Science',
    credits: 4,
    seats: 8,
    totalSeats: 50,
    professor: 'Dr. Priya Sharma',
    schedule: 'Mon, Wed 16:00-17:30',
    description: 'An advanced course covering the fundamentals of neural networks, deep learning architectures, and modern AI applications. Students will learn to design, train, and deploy neural network models.',
    prerequisites: ['CS201'],
    prerequisitesCompleted: true,
    currentCredits: 18,
    maxCredits: 24,
    hasScheduleConflict: false,
    syllabus: [
      'Introduction to Neural Networks',
      'Backpropagation and Optimization',
      'Convolutional Neural Networks',
      'Recurrent Neural Networks',
      'Transformers and Attention Mechanisms',
      'Generative Models',
      'Ethics in AI'
    ],
    learningOutcomes: [
      'Design and implement neural network architectures',
      'Apply deep learning to real-world problems',
      'Understand modern AI frameworks and tools',
      'Evaluate model performance and optimization techniques'
    ]
  },
  'ma201': {
    id: 'ma201',
    code: 'MA201',
    name: 'Linear Algebra',
    department: 'Mathematics',
    credits: 3,
    seats: 0,
    totalSeats: 45,
    professor: 'Dr. Chen Wei',
    schedule: 'Mon, Wed, Fri 11:00-12:00',
    description: 'A comprehensive study of linear algebra including vector spaces, matrices, eigenvalues, and linear transformations.',
    currentCredits: 18,
    maxCredits: 24,
    hasScheduleConflict: true,
    conflictingCourse: 'MA201',
    syllabus: [
      'Vector Spaces',
      'Linear Transformations',
      'Matrix Theory',
      'Eigenvalues and Eigenvectors',
      'Orthogonality',
      'Applications in Data Science'
    ],
    learningOutcomes: [
      'Master fundamental concepts of linear algebra',
      'Solve systems of linear equations',
      'Apply linear algebra to practical problems'
    ]
  }
};

export function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const course = courseData[id || ''] || courseData['cs402'];

  const handleEnroll = async () => {
    // Check validations
    if (!course.prerequisitesCompleted && course.prerequisites) {
      toast.error('Prerequisites Not Met', {
        description: `You must complete ${course.prerequisites.join(', ')} before enrolling.`
      });
      return;
    }

    if (course.hasScheduleConflict) {
      toast.error('Schedule Conflict', {
        description: `Time overlaps with ${course.conflictingCourse}`
      });
      return;
    }

    if (course.currentCredits! + course.credits > course.maxCredits!) {
      toast.error('Credit Limit Exceeded', {
        description: 'Max Credit Limit Reached (24 credits)'
      });
      return;
    }

    if (course.seats === 0) {
      toast.error('Course Full', {
        description: 'No seats available for this course'
      });
      return;
    }

    // Simulate enrollment
    setEnrolling(true);
    
    setTimeout(() => {
      setEnrolling(false);
      setEnrolled(true);
      toast.success('Enrollment Successful! 🎉', {
        description: `You're now enrolled in ${course.code} - ${course.name}`
      });
    }, 2000);
  };

  const canEnroll = course.seats > 0 && 
                   !course.hasScheduleConflict && 
                   course.prerequisitesCompleted !== false &&
                   (course.currentCredits || 0) + course.credits <= (course.maxCredits || 24);

  return (
    <div className="min-h-screen px-6 py-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/discover')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Discover
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Course Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Header */}
            <div className="glass-surface rounded-3xl p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm font-medium text-[#4F46E5] mb-2">{course.department}</div>
                  <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-2 tabular-nums">
                    {course.code}
                  </h1>
                  <h2 className="text-xl text-gray-700">{course.name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="tabular-nums">{course.credits} Credits</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{course.schedule.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="tabular-nums">{course.professor.split(' ')[1]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{course.schedule.split(' ').slice(1).join(' ')}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass-surface rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">Course Description</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            {/* Syllabus */}
            <div className="glass-surface rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">Syllabus</h3>
              <div className="space-y-3">
                {course.syllabus.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-[#4F46E5] tabular-nums">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{topic}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="glass-surface rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">Learning Outcomes</h3>
              <div className="space-y-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Enrollment Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 glass-surface rounded-3xl p-6 space-y-6">
              {/* Instructor */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Instructor</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {course.professor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{course.professor}</div>
                    <div className="text-sm text-gray-600">{course.department}</div>
                  </div>
                </div>
              </div>

              {/* Seats */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Seats Available</span>
                  <span className={`font-semibold tabular-nums ${course.seats < 10 ? 'text-[#EF4444]' : 'text-gray-900'}`}>
                    {course.seats}/{course.totalSeats}
                  </span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      course.seats < 10 ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                    }`}
                    style={{ width: `${(course.seats / course.totalSeats) * 100}%` }}
                  />
                </div>
              </div>

              {/* Validations */}
              <div className="space-y-3">
                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className={`
                    flex items-start gap-2 p-3 rounded-xl
                    ${course.prerequisitesCompleted 
                      ? 'bg-[#10B981]/10' 
                      : 'bg-[#F59E0B]/10'
                    }
                  `}>
                    {course.prerequisitesCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm">
                      <div className="font-medium mb-1">Prerequisites</div>
                      <div className="text-gray-600 tabular-nums">
                        {course.prerequisites.join(', ')}
                        {course.prerequisitesCompleted && ' ✅'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Conflict */}
                {course.hasScheduleConflict && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-[#EF4444]/10">
                    <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium mb-1">Schedule Clash</div>
                      <div className="text-gray-600">
                        Time overlaps with {course.conflictingCourse}
                      </div>
                    </div>
                  </div>
                )}

                {/* Credits */}
                <div className={`
                  flex items-start gap-2 p-3 rounded-xl
                  ${(course.currentCredits || 0) + course.credits <= (course.maxCredits || 24)
                    ? 'bg-[#10B981]/10' 
                    : 'bg-[#EF4444]/10'
                  }
                `}>
                  <CheckCircle2 className={`
                    w-4 h-4 flex-shrink-0 mt-0.5
                    ${(course.currentCredits || 0) + course.credits <= (course.maxCredits || 24)
                      ? 'text-[#10B981]' 
                      : 'text-[#EF4444]'
                    }
                  `} />
                  <div className="text-sm">
                    <div className="font-medium mb-1">Credits</div>
                    <div className="text-gray-600 tabular-nums">
                      {course.currentCredits} + {course.credits} / {course.maxCredits}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enroll Button */}
              <button
                onClick={handleEnroll}
                disabled={!canEnroll || enrolling || enrolled}
                className={`
                  w-full py-4 px-6 rounded-full font-medium transition-all duration-300
                  ${enrolled
                    ? 'bg-[#10B981] text-white'
                    : canEnroll
                    ? 'bg-[#4F46E5] text-white hover:shadow-lg hover:shadow-[#4F46E5]/30 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {enrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enrolling...
                  </span>
                ) : enrolled ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Enrolled
                  </span>
                ) : (
                  'Enroll Now'
                )}
              </button>

              {!canEnroll && !enrolled && (
                <p className="text-xs text-center text-gray-500">
                  {course.seats === 0 && 'Course is full'}
                  {course.hasScheduleConflict && 'Resolve schedule conflict'}
                  {!course.prerequisitesCompleted && 'Complete prerequisites first'}
                  {(course.currentCredits || 0) + course.credits > (course.maxCredits || 24) && 'Max credit limit reached'}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
