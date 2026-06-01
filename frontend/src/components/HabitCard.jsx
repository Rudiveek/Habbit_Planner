import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HabitCard({
  id,
  title,
  streak,
  status,
  deleteHabit,
  editHabit,
  toggleStatus,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const navigate = useNavigate();

  const saveEdit = () => {
    editHabit(id, editedTitle);
    setIsEditing(false);
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-blue-500 hover:-translate-y-1 transition duration-300 shadow-lg">

      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="bg-zinc-800 text-white px-3 py-2 rounded-lg w-full"
        />
      ) : (
        <h2
          onClick={() => navigate(`/habit/${id}`)}
          className="text-2xl font-semibold text-white cursor-pointer hover:text-blue-400 transition"
        >
          {editedTitle}
        </h2>
      )}

      <p className="text-zinc-400 mt-3">
        Current Streak:
        <span className="text-white font-medium">
          {" "} {streak} days
        </span>
      </p>

      <button
        onClick={() => toggleStatus(id)}
        className={`mt-5 px-4 py-2 rounded-lg text-sm font-medium ${
          status === "Completed"
            ? "bg-green-600"
            : "bg-yellow-500 text-black"
        }`}
      >
        {status}
      </button>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => {
            if (isEditing) {
              saveEdit();
            } else {
              setIsEditing(true);
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {isEditing ? "Save" : "Edit"}
        </button>

        <button
          onClick={() => deleteHabit(id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>
      </div>

    </div>
  );
}

export default HabitCard;