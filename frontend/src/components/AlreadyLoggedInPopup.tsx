'use client';

import { useRouter } from 'next/navigation';

interface AlreadyLoggedInPopupProps {
  onSignOut: () => void;
}

export function AlreadyLoggedInPopup({ onSignOut }: AlreadyLoggedInPopupProps) {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">You are already logged in</h2>
        <p className="mb-6">Do you want to sign out?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 