import { useEffect, useState } from 'react'

const storageKey = 'task-board.tasks'
const initialTasks = [
  { id: 1, text: '週次ミーティングの準備', completed: true },
  { id: 2, text: 'デザインレビューのフィードバックを整理', completed: false },
  { id: 3, text: '今月のレポートを作成する', completed: false },
]

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(storageKey)
      if (!savedTasks) return initialTasks

      const parsedTasks = JSON.parse(savedTasks)
      return Array.isArray(parsedTasks) ? parsedTasks : initialTasks
    } catch {
      return initialTasks
    }
  })
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks))
  }, [tasks])

  const completedCount = tasks.filter((task) => task.completed).length
  const remainingCount = tasks.length - completedCount

  function addTask(event) {
    event.preventDefault()
    const text = newTask.trim()

    if (!text) return

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now(), text, completed: false },
    ])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  return (
    <main className="app-shell">
      <div className="background-grid" aria-hidden="true" />
      <section className="board" aria-labelledby="page-title">
        <header className="board-header">
          <div>
            <p className="eyebrow">PERSONAL WORKSPACE / 2026</p>
            <h1 id="page-title">今日のタスク</h1>
            <p className="subtitle">やるべきことを、ひとつずつ。</p>
          </div>
          <div className="date-stamp" aria-label="今日の日付">
            <span className="date-number">10</span>
            <span className="date-copy">SEP<br />THU</span>
          </div>
        </header>

        <div className="progress-panel">
          <div className="progress-copy">
            <span className="progress-label">今日の進捗</span>
            <strong>{completedCount} / {tasks.length || 0}</strong>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={completedCount} aria-valuemin="0" aria-valuemax={tasks.length || 1}>
            <span style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }} />
          </div>
          <span className="remaining-copy">残り {remainingCount} 件</span>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">新しいタスク</label>
          <input
            id="new-task"
            type="text"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="新しいタスクを入力..."
            autoComplete="off"
          />
          <button type="submit">追加 <span aria-hidden="true">↗</span></button>
        </form>

        <div className="list-heading">
          <h2>タスクリスト</h2>
          <span>{tasks.length} ITEMS</span>
        </div>

        <ul className="task-list">
          {tasks.length === 0 ? (
            <li className="empty-state">
              <span className="empty-mark">○</span>
              <p>タスクはありません。<br />まずはひとつ追加してみましょう。</p>
            </li>
          ) : (
            tasks.map((task, index) => (
              <li className={`task-item ${task.completed ? 'is-complete' : ''}`} key={task.id}>
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="custom-checkbox" aria-hidden="true">✓</span>
                  <span className="task-index">0{index + 1}</span>
                  <span className="task-text">{task.text}</span>
                </label>
                <button className="delete-button" type="button" onClick={() => deleteTask(task.id)} aria-label={`${task.text}を削除`}>
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="board-footer">
          <span>FOCUS ON WHAT MATTERS</span>
          <span className="footer-dot" aria-hidden="true">•</span>
          <span>KEEP MOVING</span>
        </footer>
      </section>
    </main>
  )
}

export default App