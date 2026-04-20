import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, CheckCircle2, Clock, AlertCircle, X, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  assignmentNumber: number;
  title: string;
  deadline: Date;
  status: 'pending' | 'submitted' | 'late';
  submittedAt?: Date;
  txnId?: string;
  fileName?: string;
}

const assignmentsData: Assignment[] = [
  {
    id: 'cs402-a4',
    courseCode: 'CS402',
    courseName: 'Neural Networks',
    assignmentNumber: 4,
    title: 'Implementing a CNN for Image Classification',
    deadline: new Date('2026-02-28T23:59:00'),
    status: 'pending'
  },
  {
    id: 'ds102-a3',
    courseCode: 'DS102',
    courseName: 'Data Structures',
    assignmentNumber: 3,
    title: 'Binary Search Tree Implementation',
    deadline: new Date('2026-02-25T23:59:00'),
    status: 'pending'
  },
  {
    id: 'ma201-a2',
    courseCode: 'MA201',
    courseName: 'Linear Algebra',
    assignmentNumber: 2,
    title: 'Eigenvalue Problem Sets',
    deadline: new Date('2026-02-20T23:59:00'),
    status: 'submitted',
    submittedAt: new Date('2026-02-19T14:30:00'),
    txnId: 'NX99812',
    fileName: 'ma201_assignment2.pdf'
  },
  {
    id: 'hu105-a1',
    courseCode: 'HU105',
    courseName: 'Professional Ethics',
    assignmentNumber: 1,
    title: 'Ethics in Technology Essay',
    deadline: new Date('2026-02-15T23:59:00'),
    status: 'late',
    submittedAt: new Date('2026-02-16T10:15:00'),
    txnId: 'NX99756',
    fileName: 'ethics_essay.docx'
  }
];

export function Submissions() {
  const [assignments, setAssignments] = useState<Assignment[]>(assignmentsData);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<{
    txnId: string;
    timestamp: Date;
    fileName: string;
    isLate: boolean;
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!selectedAssignment) return;

    const now = new Date();
    const isLate = now > selectedAssignment.deadline;

    setUploading(true);

    setTimeout(() => {
      const txnId = 'NX' + Math.floor(10000 + Math.random() * 90000);
      
      setUploading(false);
      
      toast.success('Upload Successful! 🎉', {
        description: (
          <div className="space-y-1">
            <div>Transaction ID: <span className="font-mono">#{txnId}</span></div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleString('en-IN', { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
              })}
            </div>
            {isLate && (
              <div className="text-xs text-orange-600">
                ⚠️ Late Submission - 10% Penalty Applied
              </div>
            )}
          </div>
        ),
        duration: 5000
      });

      // Update assignment status
      selectedAssignment.status = isLate ? 'late' : 'submitted';
      selectedAssignment.submittedAt = now;
      selectedAssignment.txnId = txnId;
      selectedAssignment.fileName = file.name;
      
      setSelectedAssignment(null);
      setJustSubmitted(true);
      setSubmissionData({
        txnId,
        timestamp: now,
        fileName: file.name,
        isLate
      });
    }, 2000);
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted' || a.status === 'late');

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
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
            Submissions
          </h1>
          <p className="text-gray-600">
            Manage and submit your assignments
          </p>
        </motion.div>

        {/* Pending Assignments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 tracking-tight">
            Pending Assignments ({pendingAssignments.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAssignments.map((assignment, index) => {
              const timeRemaining = getTimeRemaining(assignment.deadline);
              const isUrgent = assignment.deadline.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

              return (
                <motion.button
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => setSelectedAssignment(assignment)}
                  className="glass-surface rounded-2xl p-6 text-left hover:bg-white/70 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium text-[#4F46E5] mb-1 tabular-nums">
                        {assignment.courseCode}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Assignment {assignment.assignmentNumber}
                      </h3>
                      <p className="text-sm text-gray-600">{assignment.title}</p>
                    </div>
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#4F46E5] transition-colors" />
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      ${isUrgent ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}
                    `}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium tabular-nums">{timeRemaining}</span>
                    </div>
                    <span className="text-gray-500">
                      Due {assignment.deadline.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Submitted Assignments */}
        <div>
          <h2 className="text-xl font-semibold mb-4 tracking-tight">
            Submitted ({submittedAssignments.length})
          </h2>
          
          <div className="space-y-4">
            {submittedAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="glass-surface rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-sm font-medium text-[#4F46E5] tabular-nums">
                        {assignment.courseCode}
                      </div>
                      <div className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${assignment.status === 'late' 
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B]' 
                          : 'bg-[#10B981]/10 text-[#10B981]'
                        }
                      `}>
                        {assignment.status === 'late' ? 'Late Submission' : 'Submitted'}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {assignment.courseName} / Assignment {assignment.assignmentNumber}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{assignment.title}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        <span>{assignment.fileName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {assignment.submittedAt?.toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Transaction ID</div>
                    <div className="font-mono text-sm font-medium tabular-nums">#{assignment.txnId}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {selectedAssignment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedAssignment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-surface rounded-3xl p-8 w-full max-w-2xl relative"
          >
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Course Header */}
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">
                {selectedAssignment.courseCode} / {selectedAssignment.courseName}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">
                Assignment {selectedAssignment.assignmentNumber}
              </h2>
              <p className="text-gray-700">{selectedAssignment.title}</p>
            </div>

            {/* Deadline Warning */}
            <div className={`
              flex items-start gap-2 p-4 rounded-xl mb-6
              ${new Date() > selectedAssignment.deadline 
                ? 'bg-[#EF4444]/10' 
                : 'bg-[#F59E0B]/10'
              }
            `}>
              {new Date() > selectedAssignment.deadline ? (
                <>
                  <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-[#EF4444] mb-1">Deadline Passed</div>
                    <div className="text-gray-700">
                      This submission will be marked as late. A 10% penalty will be applied.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-[#F59E0B] mb-1">
                      {getTimeRemaining(selectedAssignment.deadline)} remaining
                    </div>
                    <div className="text-gray-700">
                      Due: {selectedAssignment.deadline.toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300
                ${dragActive 
                  ? 'border-[#4F46E5] bg-[#4F46E5]/5' 
                  : 'border-gray-300 hover:border-[#4F46E5]'
                }
                ${uploading ? 'pointer-events-none opacity-60' : ''}
              `}
            >
              <input
                type="file"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />

              {uploading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#4F46E5]/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-[#4F46E5] animate-bounce" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold mb-1">Uploading...</div>
                    <div className="text-sm text-gray-600">Please wait while we process your submission</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">Upload Your Assignment</h3>
                  <p className="text-gray-600 mb-6">
                    Drag and drop your file here, or click to browse
                  </p>

                  <label
                    htmlFor="file-upload"
                    className={`
                      inline-block px-8 py-4 rounded-full font-medium cursor-pointer transition-all duration-300
                      ${new Date() > selectedAssignment.deadline
                        ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        : 'bg-[#4F46E5] text-white hover:shadow-lg hover:shadow-[#4F46E5]/30'
                      }
                    `}
                  >
                    {new Date() > selectedAssignment.deadline ? 'Submit Late' : 'Choose File'}
                  </label>

                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: PDF, DOC, DOCX, ZIP (Max 10MB)
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Submission Confirmation Modal */}
      {justSubmitted && submissionData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setJustSubmitted(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-surface rounded-3xl p-8 w-full max-w-2xl relative"
          >
            <button
              onClick={() => setJustSubmitted(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Course Header */}
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">
                {selectedAssignment?.courseCode} / {selectedAssignment?.courseName}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">
                Assignment {selectedAssignment?.assignmentNumber}
              </h2>
              <p className="text-gray-700">{selectedAssignment?.title}</p>
            </div>

            {/* Submission Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{submissionData.fileName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {submissionData.timestamp.toLocaleDateString('en-IN', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-1">Transaction ID</div>
              <div className="font-mono text-sm font-medium tabular-nums">#{submissionData.txnId}</div>
            </div>

            {/* Download and View Buttons */}
            <div className="mt-6 flex items-center gap-4">
              <button
                className="flex items-center px-8 py-4 rounded-full font-medium cursor-pointer transition-all duration-300 bg-[#4F46E5] text-white hover:shadow-lg hover:shadow-[#4F46E5]/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                className="flex items-center px-8 py-4 rounded-full font-medium cursor-pointer transition-all duration-300 bg-white/60 hover:bg-white/80 text-gray-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>

            {/* Status */}
            <div className="mt-6 p-4 rounded-xl bg-[#F59E0B]/10">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[#F59E0B] font-medium">Awaiting Faculty Review</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}