'use client';

// import { useRouter } from 'next/router';

interface AlreadyLoggedInPopupProps {
  onSignOut: () => void;
  onCancel: () => void;
}

export function AlreadyLoggedInPopup({ onSignOut, onCancel }: AlreadyLoggedInPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          You are already logged in
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          Do you want to sign out and continue?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Stay signed in
          </button>
          <button
            onClick={onSignOut}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 