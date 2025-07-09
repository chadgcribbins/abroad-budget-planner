'use client';

import React, { useState } from 'react';
import { useProfileStore } from '@/src/store/slices/profileSlice';
import { MemberCard } from './MemberCard';
import { AddMemberModal } from './AddMemberModal';
import { FamilyMember } from '@/src/types/profile';

interface MembersStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function MembersStep({ onNext, onBack }: MembersStepProps) {
  const { profile, removeMember, updateMember, hasAdultMember } = useProfileStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  if (!profile) return null;

  const members = profile.household.members;
  const canProceed = members.length > 0 && hasAdultMember();

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setIsAddModalOpen(true);
  };

  const handleDelete = (memberId: string) => {
    removeMember(memberId);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Family Members</h2>
        <p className="text-base-content/70">
          Add all members of your household who will be relocating with you.
        </p>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-lg">
            <p className="text-lg text-base-content/70 mb-4">
              No family members added yet
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
            >
              Add Your First Member
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-outline btn-sm w-full"
            >
              + Add Another Member
            </button>
          </>
        )}
      </div>

      {/* Validation Messages */}
      {members.length > 0 && !hasAdultMember() && (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>At least one adult member is required in your household.</span>
        </div>
      )}

      {/* Summary Stats */}
      {members.length > 0 && (
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Total Members</div>
            <div className="stat-value">{members.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Adults</div>
            <div className="stat-value">{members.filter(m => m.role === 'Adult').length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Children</div>
            <div className="stat-value">{members.filter(m => m.role === 'Child').length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Seniors</div>
            <div className="stat-value">
              {members.filter(m => ['Parent', 'Grandparent'].includes(m.role)).length}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-ghost"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="btn btn-primary"
        >
          Next Step
        </button>
      </div>

      {/* Add/Edit Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        editingMember={editingMember}
      />
    </div>
  );
}