// /client/src/components/dashboard/GradeDisputeTracker.tsx

import React from 'react';
import { type Timestamp } from 'firebase/firestore';

export interface Dispute {
  id: string;
  courseId: string;
  semester: string;
  currentGrade: string;
  expectedGrade: string;
  status: 'Submitted' | 'In Review' | 'Resolved' | 'Rejected';
  submittedAt: Timestamp;
}

interface GradeDisputeTrackerProps {
  disputes: Dispute[];
}

const getStatusColor = (status: Dispute['status']) => {
  switch (status) {
    case 'Submitted':
      return 'bg-blue-500/20 text-blue-300';
    case 'In Review':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'Resolved':
      return 'bg-lime-500/20 text-lime-300';
    case 'Rejected':
        return 'bg-pink-500/20 text-pink-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
};

const GradeDisputeTracker: React.FC<GradeDisputeTrackerProps> = ({ disputes }) => {
  return (
    <div className="bg-dark-secondary shadow-xl rounded-lg p-6 border border-dark-tertiary mt-8">
      <h3 className="text-lg font-semibold text-light-primary mb-4">My Grade Disputes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b-2 border-dark-tertiary">
            <tr>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase">Course</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase">Semester</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase text-center">Submitted On</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase text-center">Grade</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase text-center">Expected</th>
              <th className="px-4 py-3 font-medium text-light-tertiary uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-tertiary">
            {disputes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-light-tertiary">
                  You have no pending or past grade disputes.
                </td>
              </tr>
            ) : (
              disputes.map(dispute => (
                <tr key={dispute.id} className="hover:bg-dark-tertiary/30">
                  <td className="px-4 py-3 font-semibold text-light-primary">{dispute.courseId}</td>
                  <td className="px-4 py-3 text-light-secondary">{dispute.semester}</td>
                  <td className="px-4 py-3 text-light-secondary text-center">
                    {new Date(dispute.submittedAt.seconds * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-light-secondary text-center">{dispute.currentGrade}</td>
                  <td className="px-4 py-3 text-brand-cyan text-center font-bold">{dispute.expectedGrade}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeDisputeTracker;