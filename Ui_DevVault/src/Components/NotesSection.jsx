"use client"

export default function NotesSection({ notes, onNotesChange }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Notes</h2>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add your notes here..."
        className="w-full h-32 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
      />
    </div>
  )
}
