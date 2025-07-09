'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileStore } from '@/src/store/slices/profileSlice';
import { familyMemberSchema } from '@/src/utils/profileValidation';
import { 
  FamilyMember, 
  MemberFormData, 
  ROLE_CONFIG, 
  AGE_GROUP_CONFIG 
} from '@/src/types/profile';
import { 
  getDefaultAgeGroup, 
  requiresAgeGroup, 
  getAgeGroupsForRole 
} from '@/src/utils/profileValidation';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember?: FamilyMember | null;
}

export function AddMemberModal({ isOpen, onClose, editingMember }: AddMemberModalProps) {
  const { addMember, updateMember, profile } = useProfileStore();
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<MemberFormData>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      name: '',
      role: 'Adult',
      ageGroup: undefined,
      isPrimary: false,
    },
    mode: 'onChange',
  });

  const selectedRole = watch('role');
  const selectedAgeGroup = watch('ageGroup');

  // Update default values when editing
  useEffect(() => {
    if (editingMember) {
      reset({
        name: editingMember.name,
        role: editingMember.role,
        ageGroup: editingMember.ageGroup,
        isPrimary: editingMember.isPrimary,
      });
    } else {
      reset({
        name: '',
        role: 'Adult',
        ageGroup: undefined,
        isPrimary: false,
      });
    }
  }, [editingMember, reset]);

  // Handle role change
  useEffect(() => {
    if (selectedRole) {
      const defaultAge = getDefaultAgeGroup(selectedRole);
      const needsAge = requiresAgeGroup(selectedRole);
      
      if (defaultAge && !needsAge) {
        setValue('ageGroup', defaultAge);
      } else if (!needsAge) {
        setValue('ageGroup', undefined);
      }
    }
  }, [selectedRole, setValue]);

  const onSubmit = (data: MemberFormData) => {
    if (editingMember) {
      updateMember(editingMember.id, data);
    } else {
      addMember(data);
    }
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  const needsAgeGroup = requiresAgeGroup(selectedRole);
  const ageGroups = getAgeGroupsForRole(selectedRole);
  const hasPrimaryMember = profile?.household.members.some(m => m.isPrimary && m.id !== editingMember?.id);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {editingMember ? 'Edit Family Member' : 'Add Family Member'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter member's name"
              className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
              {...register('name')}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>

          {/* Role */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              className={`select select-bordered ${errors.role ? 'select-error' : ''}`}
              {...register('role')}
            >
              {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                <option key={role} value={role}>
                  {config.label} - {config.description}
                </option>
              ))}
            </select>
          </div>

          {/* Age Group */}
          {needsAgeGroup && ageGroups && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Age Group</span>
                <span className="label-text-alt text-error">Required</span>
              </label>
              <select
                className={`select select-bordered ${errors.ageGroup ? 'select-error' : ''}`}
                {...register('ageGroup')}
              >
                <option value="">Select age group</option>
                {ageGroups.map((ageGroup) => (
                  <option key={ageGroup} value={ageGroup}>
                    {AGE_GROUP_CONFIG[ageGroup as keyof typeof AGE_GROUP_CONFIG].label}
                  </option>
                ))}
              </select>
              {errors.ageGroup && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.ageGroup.message}</span>
                </label>
              )}
            </div>
          )}

          {/* Primary Earner */}
          {selectedRole === 'Adult' && (
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Primary Income Earner</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  {...register('isPrimary')}
                  disabled={hasPrimaryMember}
                />
              </label>
              {hasPrimaryMember && (
                <label className="label">
                  <span className="label-text-alt text-base-content/50">
                    Another member is already marked as primary
                  </span>
                </label>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValid}
            >
              {editingMember ? 'Update' : 'Add'} Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}