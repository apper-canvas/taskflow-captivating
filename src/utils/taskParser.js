export const parseTaskInput = (input) => {
  const result = {
    title: input,
    projectId: '1', // Default to Inbox
    priority: 4,
    dueDate: null
  }

  // Extract project (using #project or @project)
  const projectMatch = input.match(/[#@](\w+)/i)
  if (projectMatch) {
    const projectName = projectMatch[1].toLowerCase()
    result.title = input.replace(projectMatch[0], '').trim()
    
    // Map common project names to IDs (in real app, would search projects)
    const projectMap = {
      'work': '3',
      'personal': '2',
      'health': '4',
      'fitness': '4',
      'learning': '5',
      'shopping': '6'
    }
    
    if (projectMap[projectName]) {
      result.projectId = projectMap[projectName]
    }
  }

  // Extract priority (p1, p2, p3, p4)
  const priorityMatch = input.match(/p([1-4])/i)
  if (priorityMatch) {
    result.priority = parseInt(priorityMatch[1], 10)
    result.title = result.title.replace(priorityMatch[0], '').trim()
  }

  // Extract dates (today, tomorrow, specific dates)
  const datePatterns = [
    { pattern: /\btoday\b/i, offset: 0 },
    { pattern: /\btomorrow\b/i, offset: 1 },
    { pattern: /\bnext week\b/i, offset: 7 },
  ]

  datePatterns.forEach(({ pattern, offset }) => {
    if (pattern.test(input)) {
      const date = new Date()
      date.setDate(date.getDate() + offset)
      result.dueDate = date
      result.title = result.title.replace(pattern, '').trim()
    }
  })

  // Extract time (e.g., "at 2pm", "at 14:00")
  const timeMatch = input.match(/\bat\s+(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i)
  if (timeMatch && result.dueDate) {
    let hours = parseInt(timeMatch[1], 10)
    const minutes = parseInt(timeMatch[2] || '0', 10)
    const period = timeMatch[3]?.toLowerCase()

    if (period === 'pm' && hours !== 12) {
      hours += 12
    } else if (period === 'am' && hours === 12) {
      hours = 0
    }

    result.dueDate.setHours(hours, minutes, 0, 0)
    result.title = result.title.replace(timeMatch[0], '').trim()
  }

  // Clean up title
  result.title = result.title.replace(/\s+/g, ' ').trim()

  return result
}