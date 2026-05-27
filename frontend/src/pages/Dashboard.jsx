import { useState } from 'react'
import HabitCard from '../components/HabitCard'
import AddHabitForm from '../components/AddHabitForm'

function Dashboard() {
  const [habits, setHabits] = useState([
    {
      id: 1,
      title: 'Morning Workout',
      streak: 12,
      status: 'Completed',
    },
    {
      id: 2,
      title: 'Reading Books',
      streak: 8,
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Meditation',
      streak: 20,
      status: 'Completed',
    },
  ])

  const addHabit = (newHabit) => {
  const habit = {
    id: Date.now(),
    title: newHabit,
    streak: 0,
    status: 'In Progress',
  }

  setHabits([...habits, habit])
}

const deleteHabit = (id) => {
  const updatedHabits = habits.filter(
    (habit) => habit.id !== id
  )

  setHabits(updatedHabits)
}

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-white text-7xl font-bold mb-6">
          Track Your Daily Habits
        </h1>

        <p className="text-gray-400 text-2xl mb-10">
          Build consistency, improve productivity, and achieve your goals.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold mb-12">
          Get Started
        </button>

        <AddHabitForm addHabit={addHabit} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {habits.map((habit) => (
  <HabitCard
    id={habit.id}
    title={habit.title}
    streak={habit.streak}
    status={habit.status}
    deleteHabit={deleteHabit}
  />
))}
      </div>
    </div>
  )
}

export default Dashboard