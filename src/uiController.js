export class UIController {
  constructor(taskManager) {
    this.taskManager = taskManager
    this.currentFilter = 'all'
  }

  setFilter(filter) {
    this.currentFilter = filter
  }

  renderTasks() {
    const tasksList = document.getElementById('tasksList')
    const emptyState = document.getElementById('emptyState')
    const tasks = this.taskManager.getTasks(this.currentFilter)

    if (tasks.length === 0) {
      tasksList.innerHTML = ''
      emptyState.style.display = 'block'
      return
    }

    emptyState.style.display = 'none'
    
    // Sort tasks: incomplete first, then by priority, then by creation date
    const sortedTasks = tasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed - b.completed
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    tasksList.innerHTML = sortedTasks.map(task => this.createTaskHTML(task)).join('')
    
    // Add stagger animation to tasks
    const taskItems = tasksList.querySelectorAll('.task-item')
    taskItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 50}ms`
    })
  }

  createTaskHTML(task) {
    const priorityColors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    }

    const timeAgo = this.getTimeAgo(new Date(task.createdAt))
    
    return `
      <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        <div class="task-content">
          <label class="task-checkbox-container">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="checkmark"></span>
          </label>
          
          <div class="task-details">
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <div class="task-meta">
              <span class="task-priority" style="color: ${priorityColors[task.priority]}">
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
              <span class="task-time">${timeAgo}</span>
            </div>
          </div>
        </div>
        
        <button class="delete-btn" title="Delete task">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    `
  }

  updateStats() {
    const stats = this.taskManager.getStats()
    
    document.getElementById('totalTasks').textContent = stats.total
    document.getElementById('completedTasks').textContent = stats.completed
    
    // Update document title with task count
    document.title = `TaskFlow (${stats.pending} pending)`
  }

  getTimeAgo(date) {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return date.toLocaleDateString()
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}