export class TaskManager {
  constructor() {
    this.tasks = this.loadTasks()
    this.nextId = this.getNextId()
  }

  addTask(text, priority = 'medium') {
    const task = {
      id: this.nextId++,
      text: text.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    
    this.tasks.push(task)
    this.saveTasks()
    return task
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      task.completedAt = task.completed ? new Date().toISOString() : null
      this.saveTasks()
    }
    return task
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id)
    if (index > -1) {
      const deletedTask = this.tasks.splice(index, 1)[0]
      this.saveTasks()
      return deletedTask
    }
    return null
  }

  getTasks(filter = 'all') {
    switch (filter) {
      case 'completed':
        return this.tasks.filter(task => task.completed)
      case 'pending':
        return this.tasks.filter(task => !task.completed)
      case 'high':
        return this.tasks.filter(task => task.priority === 'high')
      case 'medium':
        return this.tasks.filter(task => task.priority === 'medium')
      case 'low':
        return this.tasks.filter(task => task.priority === 'low')
      default:
        return this.tasks
    }
  }

  getStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter(task => task.completed).length
    const pending = total - completed
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  loadTasks() {
    try {
      const saved = localStorage.getItem('taskflow-tasks')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading tasks:', error)
      return []
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks))
    } catch (error) {
      console.error('Error saving tasks:', error)
    }
  }

  getNextId() {
    return this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1
  }

  clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed)
    this.saveTasks()
  }

  clearAll() {
    this.tasks = []
    this.saveTasks()
  }
}