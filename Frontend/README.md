# Alumni Management System - Admin Dashboard

A modern, responsive Alumni Management System Admin Dashboard built with React, Tailwind CSS, and modern web technologies.

## 🚀 Features

### 📊 Dashboard
- **KPI Cards**: Total Alumni, Events Organized, Donations Collected, Active Mentors
- **Interactive Charts**: Alumni growth trends, donation analytics, department distribution
- **Recent Activity**: Latest events and their attendance
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 👥 Alumni Management
- **Comprehensive Database**: Name, batch, department, profession, company, location
- **Advanced Search**: Search by name, company, or profession
- **Smart Filters**: Filter by batch, department, and location
- **Pagination**: Efficient data browsing with pagination
- **Actions**: View, edit, and delete alumni records
- **Export Functionality**: Download alumni data in various formats

### 📅 Events Management
- **Event Listing**: Beautiful card-based event display
- **Event Creation**: Modal-based event creation form
- **Status Tracking**: Upcoming, completed, and cancelled events
- **Event Details**: Date, time, location, attendance, and organizer info
- **Filter System**: Filter events by status
- **Visual Cards**: High-quality images and detailed information

### 💰 Donations Management
- **Financial Overview**: Total donations, completion status, pending amounts
- **Donor Analytics**: Alumni vs non-alumni donor tracking
- **Visual Charts**: Monthly donation trends and category-wise distribution
- **Transaction Table**: Detailed donation records with search and filter
- **Status Tracking**: Completed, pending, and cancelled donations
- **Export Reports**: Download financial reports

### 📈 Reports & Analytics
- **Analytics Dashboard**: Interactive charts for alumni, events, and donations
- **Pre-built Reports**: Alumni, events, financial, and engagement reports
- **Custom Report Builder**: Create personalized reports
- **Multiple Formats**: PDF, Excel, and CSV export options
- **Scheduled Reports**: Automated report generation
- **Data Visualization**: Bar charts, line charts, pie charts, and area charts

### ⚙️ Settings
- **Profile Management**: Admin profile with photo upload
- **Security Settings**: Password change and two-factor authentication
- **Notification Preferences**: Email, push, SMS, and weekly summary settings
- **Appearance**: Dark/light mode toggle and theme customization
- **Data Management**: Export data and backup configurations
- **Language & Region**: Multi-language support and timezone settings

## 🛠️ Technologies Used

- **Frontend Framework**: React 19.1.1
- **Styling**: Tailwind CSS 4.1.13
- **Routing**: React Router DOM 7.8.2
- **Charts**: Recharts 3.2.0
- **Icons**: Lucide React 0.542.0
- **HTTP Client**: Axios 1.11.0
- **Build Tool**: Vite 7.1.2
- **Development Tools**: ESLint, PostCSS, Autoprefixer

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

### Mobile Features:
- Collapsible sidebar with hamburger menu
- Touch-friendly interface
- Optimized charts for small screens
- Responsive tables with horizontal scroll
- Mobile-optimized search and filters

## 🎨 Design Features

- **Modern UI**: Clean, minimal design with consistent spacing
- **Color Scheme**: Professional indigo and gray palette
- **Typography**: Readable fonts with proper hierarchy
- **Icons**: Consistent Lucide React icons throughout
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Proper focus states and keyboard navigation

## 📦 Project Structure

```
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Topbar.jsx           # Header with search and profile
│   │   └── StateCard.jsx        # Reusable KPI card component
│   ├── pages/
│   │   ├── DashboardPage.jsx    # Main dashboard with charts
│   │   ├── AlumniPage.jsx       # Alumni management
│   │   ├── EventPage.jsx        # Events management
│   │   ├── DonationPage.jsx     # Donations tracking
│   │   ├── ReportsPage.jsx      # Reports and analytics
│   │   └── SettingsPage.jsx     # System settings
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   ├── index.css                # Global styles and Tailwind
│   └── api.jsx                  # API configuration (if needed)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIH-PROJECT/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Alumni Management System
```

### Tailwind Configuration
The project uses Tailwind CSS with custom configurations for:
- Custom color palette
- Extended spacing and sizing
- Custom animations
- Responsive breakpoints

## 📊 Features Overview

### Dashboard Analytics
- **Real-time KPIs**: Live updates of key metrics
- **Interactive Charts**: Click and hover interactions
- **Trend Analysis**: Month-over-month comparisons
- **Quick Actions**: Direct links to main features

### Data Management
- **Search & Filter**: Advanced search capabilities
- **Sorting**: Multi-column sorting options
- **Pagination**: Efficient large dataset handling
- **Export**: Multiple export formats

### User Experience
- **Fast Navigation**: React Router for instant page transitions
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error management
- **Offline Support**: Basic offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: React Native companion app
- **API Integration**: Full backend integration
- **Multi-language**: Complete internationalization
- **Role-based Access**: Different permission levels
- **Email Templates**: Automated email campaigns
- **Social Integration**: LinkedIn and social media connections

---

Built with ❤️ for the Alumni Management System project.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
