# Claude Code Integration Instructions

## 🚀 Getting Started with Claude Code Extension

### Initial Setup
1. **Run initialization command:**
   ```
   /init
   ```

2. **Set up terminal integration:**
   ```
   /terminal-setup
   ```

3. **Verify your project structure:**
   ```
   /file-tree
   ```

## 📁 Project Overview

This is a **Next.js 14 Homeschool Management Platform** with:
- Student management system
- Tennessee compliance attendance tracking
- Dashboard with progress monitoring
- Modern UI with Tailwind CSS

### Key Directories
```
homeschool-management-platform/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── students/        # Student management
│   │   ├── attendance/      # Attendance tracking
│   │   └── layout/          # Navigation & layout
│   └── lib/                 # Utilities and configurations
├── public/                  # Static assets
├── docker-compose.dev.yml   # Development database
└── package.json             # Dependencies
```

## 💬 How to Work with Claude

### Be Specific and Clear
Claude works best when you:
- **Specify exact file paths**: `src/components/dashboard/quick-actions.tsx`
- **Describe the desired outcome**: "Add a button that navigates to /attendance"
- **Mention constraints**: "Keep the existing Tailwind styling"
- **Reference existing patterns**: "Similar to how StudentForm handles notifications"

### Example Commands
```bash
# Analyze a specific component
"Show me the StudentForm component and explain how it handles form submission"

# Request modifications
"In src/components/dashboard/student-overview.tsx, move the compliance section to the bottom and make Quick Actions more prominent"

# Debug issues
"The attendance form is only showing 3 students instead of 4. Check the localStorage loading logic in AttendanceForm component"

# Add new features
"Create a new Reports page component with Tennessee compliance report generation"
```

## 🔧 Development Workflow

### Running the Project
```bash
# Start database (first time)
docker-compose -f docker-compose.dev.yml up -d

# Development server
npm run dev

# Production build
npm run build
npm start
```

### Common Tasks
- **Add new students**: Students page → form → localStorage persistence
- **Mark attendance**: Attendance page → daily form → calendar view
- **Check compliance**: Dashboard → Tennessee compliance section
- **Navigate pages**: Use navigation bar (Dashboard, Students, Attendance)

## ⚙️ MCP Server Configuration

### Adding Superdesign MCP
If you want to use Superdesign for UI generation:

1. **Install the MCP server:**
   ```bash
   npm install -g @jonthebeef/superdesign-mcp-claude-code
   ```

2. **Configure in Claude Code settings:**
   ```json
   {
     "mcpServers": {
       "jonthebeef-superdesign-mcp-claude-code": {
         "command": "node",
         "args": [
           "path/to/superdesign/dist/index.js"
         ]
       }
     }
   }
   ```

3. **Restart Claude Code extension**

## 🎯 Project-Specific Instructions

### Student Management
- **Data persistence**: Uses localStorage with key `homeschool-students`
- **State management**: Centralized in `/students/page.tsx`
- **Components**: `StudentForm` (add) + `StudentList` (display/manage)

### Attendance Tracking
- **Compliance focus**: Tennessee 180-day requirement
- **Data storage**: localStorage with key `homeschool-attendance`
- **Components**: `AttendanceForm` (daily) + `AttendanceCalendar` (history) + `AttendanceStats` (compliance)

### UI/UX Considerations
- **Tailwind CSS** for all styling
- **Lucide React** for icons
- **Toast notifications** for user feedback
- **Mobile responsive** design
- **Focus on daily workflow** over administrative features

## 🐛 Common Issues & Solutions

### Localhost Connection Issues
```bash
# Kill all Node processes
taskkill /f /im node.exe

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Restart on different port
npx next dev -p 8080
```

### Data Persistence Issues
```javascript
// Check localStorage in browser console
console.log('Students:', JSON.parse(localStorage.getItem('homeschool-students')))
console.log('Attendance:', JSON.parse(localStorage.getItem('homeschool-attendance')))

// Trigger data refresh
window.dispatchEvent(new CustomEvent('students-updated'))
window.location.reload()
```

### Multiple Tab Sync Issues
- **Always use one browser tab** for data management
- **Hard refresh** (Ctrl+Shift+R) to sync state
- **Check console** for state management debug messages

## 📋 Best Practices

### When Requesting Changes
1. **Specify the exact component** and file path
2. **Describe the user experience** you want
3. **Mention any data dependencies** (localStorage, props, etc.)
4. **Reference existing UI patterns** to maintain consistency

### Code Quality
- **TypeScript strict mode** enabled
- **ESLint** for code quality
- **Responsive design** required
- **Accessibility** considerations
- **Performance optimizations** for React components

## 🎨 UI/UX Improvement Areas

Based on user feedback, focus on:
- **Daily workflow optimization** (attendance marking, quick actions)
- **Individual student views** vs. aggregate data
- **Prominent placement** of frequently-used features
- **Reduced cognitive load** - clear visual hierarchy
- **Better information architecture** - compliance as secondary info

## 📞 Getting Help

When working with Claude:
- **Be specific about file paths**
- **Explain the business context** (homeschool compliance requirements)
- **Reference existing components** for consistency
- **Ask for explanations** of complex logic
- **Request step-by-step guidance** for multi-file changes

---

**Remember**: This is a production homeschool management system with real data persistence. Always test changes thoroughly and maintain backup of localStorage data when needed.