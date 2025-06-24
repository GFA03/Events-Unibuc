'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ProfilePersonalInfoForm from '@/components/users/ProfilePersonalInfoForm';
import ProfilePasswordChangeForm from '@/components/users/ProfilePasswordChangeForm';
import ProfileDeleteAccountSection from '@/components/users/ProfileDeleteAccountSection';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-3 text-cyan-600" />
            Profile Settings
          </h1>
          <ProfilePersonalInfoForm />
          <ProfilePasswordChangeForm />
          <ProfileDeleteAccountSection />
        </div>
      </div>
    </div>
  );
}
