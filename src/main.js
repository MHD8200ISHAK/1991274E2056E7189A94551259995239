import './style.css'
import { TaskManager } from './taskManager.js'
import { UIController } from './uiController.js'

// Initialize the application
class App {
  constructor() {
    this.taskManager = new TaskManager()
    this.uiController = new UIController(this.taskManager)
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.uiController.renderTasks()
    this.uiController.updateStats()
  }

  setupEventListeners() {
    // Task form submission
    const taskForm = document.getElementById('taskForm')
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleAddTask()
    })

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn')
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterChange(e.target.dataset.filter)
      })
    })

    // Task list event delegation
    const tasksList = document.getElementById('tasksList')
    tasksList.addEventListener('click', (e) => {
      const taskItem = e.target.closest('.task-item')
      if (!taskItem) return

      const taskId = parseInt(taskItem.dataset.taskId)

      if (e.target.classList.contains('task-checkbox')) {
        this.handleToggleTask(taskId)
      } else if (e.target.classList.contains('delete-btn')) {
        this.handleDeleteTask(taskId)
      }
    })
  }

  handleAddTask() {
    const taskInput = document.getElementById('taskInput')
    const prioritySelect = document.getElementById('prioritySelect')
    
    const text = taskInput.value.trim()
    const priority = prioritySelect.value

    if (text) {
      this.taskManager.addTask(text, priority)
      this.uiController.renderTasks()
      this.uiController.updateStats()
      
      // Reset form
      taskInput.value = ''
      prioritySelect.value = 'medium'
      
      // Add success animation
      this.showSuccessMessage('Task added successfully!')
    }
  }

  handleToggleTask(taskId) {
    this.taskManager.toggleTask(taskId)
    this.uiController.renderTasks()
    this.uiController.updateStats()
  }

  handleDeleteTask(taskId) {
    this.taskManager.deleteTask(taskId)
    this.uiController.renderTasks()
    this.uiController.updateStats()
    this.showSuccessMessage('Task deleted!')
  }

  handleFilterChange(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active')
    
    // Apply filter
    this.uiController.setFilter(filter)
    this.uiController.renderTasks()
  }

  showSuccessMessage(message) {
    // Create and show a temporary success message
    const successMsg = document.createElement('div')
    successMsg.className = 'success-message'
    successMsg.textContent = message
    document.body.appendChild(successMsg)

    // Animate in
    setTimeout(() => successMsg.classList.add('show'), 100)
    
    // Remove after 2 seconds
    setTimeout(() => {
      successMsg.classList.remove('show')
      setTimeout(() => successMsg.remove(), 300)
    }, 2000)
  }
}

// Start the application
new App()