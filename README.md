# 🏠 Homeschool Management Platform

> A comprehensive digital solution for homeschool families using **The Good and the Beautiful** curriculum, featuring **Tennessee compliance tracking**, lesson planning, and multi-child management.

![Homeschool Platform](https://img.shields.io/badge/Platform-Homeschool%20Management-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tennessee](https://img.shields.io/badge/Tennessee-Compliant-green)
![TGTB](https://img.shields.io/badge/TGTB-Ready-purple)

## ✨ Features

### 🎯 **Tennessee Compliance**
- **180-day attendance tracking** with real-time compliance alerts
- **Automated testing reminders** for grades 5, 7, and 9
- **Notice of Intent** form generation and filing tracking
- **Risk assessment** with color-coded compliance status

### 📚 **TGTB Curriculum Integration**
- **Curriculum templates** specifically designed for The Good and the Beautiful
- **Family-style learning** support for multi-child lesson sharing
- **Flexible scheduling** that adapts to your family's pace
- **Progress tracking** across all subjects and grade levels

### 👥 **Multi-Child Management**
- **Individual student dashboards** with personalized progress
- **Shared lesson planning** for siblings learning together
- **Grade-specific tracking** from K-12 with electives
- **Assignment management** with due dates and completion status

### 📊 **Interactive Dashboard**
- **Enhanced attendance chart** with compliance calculations
- **Student progress overview** with visual progress bars
- **Quick action buttons** for daily homeschool tasks
- **Recent activity feed** to track family learning

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL** (or use Docker)
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/Degenius12/homeschool-management-platform.git
cd homeschool-management-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your database credentials
```

### 4. Start Database (Docker)
```bash
# Start PostgreSQL with Docker
docker-compose -f docker-compose.dev.yml up -d

# Initialize database
npx prisma generate
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```

🎉 **Visit [http://localhost:3000](http://localhost:3000)** to see your homeschool dashboard!

## 📁 Project Structure

```
homeschool-management-platform/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Main dashboard
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── dashboard/         # Dashboard components
│   │       ├── attendance-chart.tsx
│   │       ├── compliance-status.tsx
│   │       ├── student-overview.tsx
│   │       ├── upcoming-tasks.tsx
│   │       └── quick-actions.tsx
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── .github/workflows/         # CI/CD automation
├── docker-compose.yml         # Production containers
└── docker-compose.dev.yml     # Development containers
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS with custom theme
- **Database:** PostgreSQL with Prisma ORM
- **Charts:** Recharts for data visualization  
- **Icons:** Lucide React
- **Deployment:** Vercel-ready with Docker support

## 📊 Dashboard Components

### **Attendance Chart**
- Weekly attendance visualization with bar charts
- Tennessee 180-day compliance tracking
- Risk alerts when falling behind schedule
- Quick action buttons for daily tasks

### **Student Overview**
- Individual progress tracking per subject
- Visual progress bars for Math, Reading, Science, History
- Recent activity timeline
- Grade-level specific metrics

### **Compliance Status**
- Real-time Tennessee requirement monitoring
- Notice of Intent filing status
- Testing schedule for grades 5, 7, 9
- Color-coded compliance indicators

### **Quick Actions**
- One-click lesson planning
- Attendance marking
- Report generation
- Student management

## 🏛️ Tennessee Compliance Features

### **Attendance Requirements**
- ✅ **180-day minimum** with automatic calculation
- ✅ **4 hours per day** tracking
- ✅ **Weekly progress** monitoring
- ✅ **Risk alerts** when behind schedule

### **Testing Requirements**
- ✅ **Grade 5, 7, 9** testing reminders
- ✅ **Testing window** notifications
- ✅ **Documentation** generation
- ✅ **Compliance tracking** by student

### **Record Keeping**
- ✅ **Notice of Intent** form generation
- ✅ **Attendance records** with export
- ✅ **Portfolio management** 
- ✅ **Transcript generation**

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

### **Database Management**
```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate migration
npx prisma migrate dev --name init
```

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to connect repository
```

### **Docker Production**
```bash
# Build and run with Docker
docker-compose up -d
```

### **Environment Variables**
For production deployment, set these environment variables:
```env
DATABASE_URL=postgresql://user:pass@host:port/db
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com
```

## 📈 Roadmap

### **Phase 1: Core Platform** ✅
- [x] Tennessee compliance tracking
- [x] TGTB curriculum framework
- [x] Multi-child dashboard
- [x] Attendance chart with alerts

### **Phase 2: Enhanced Features** 🚧
- [ ] User authentication (NextAuth.js)
- [ ] Family registration and management
- [ ] Real data integration
- [ ] Assignment and grade tracking
- [ ] Portfolio management

### **Phase 3: Advanced Features** 📋
- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Multi-state expansion
- [ ] Umbrella school integration
- [ ] Parent community features

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/Degenius12/homeschool-management-platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Degenius12/homeschool-management-platform/discussions)
- **Documentation:** Check the `/docs` folder for detailed guides

## 🏆 Acknowledgments

- **The Good and the Beautiful** for their excellent curriculum
- **Tennessee Department of Education** for clear homeschool guidelines
- **Homeschool families** who provided requirements and feedback

---

**Made with ❤️ for homeschool families using The Good and the Beautiful curriculum**

🚀 **Ready to streamline your homeschool management?** [Get started now!](#-quick-start)