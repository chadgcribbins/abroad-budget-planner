'use client';

import React from 'react';
import { FamilyMember, ROLE_CONFIG, AGE_GROUP_CONFIG } from '@/src/types/profile';

interface MemberCardProps {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onDelete: (memberId: string) => void;
}

export function MemberCard({ member, onEdit, onDelete }: MemberCardProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove ${member.name} from your household?`)) {
      onDelete(member.id);
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-12">
                <span className="text-lg">{member.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <span>{ROLE_CONFIG[member.role].label}</span>
                {member.ageGroup && (
                  <>
                    <span>•</span>
                    <span>{AGE_GROUP_CONFIG[member.ageGroup].label}</span>
                  </>
                )}
                {member.isPrimary && (
                  <span className="badge badge-primary badge-sm">Primary Earner</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(member)}
              className="btn btn-ghost btn-sm"
              title="Edit member"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-ghost btn-sm text-error"
              title="Remove member"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}