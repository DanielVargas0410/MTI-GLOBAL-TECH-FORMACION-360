'use client'
import React, { useState, useEffect } from "react"
import {
  User,
  BookOpen,
  KeyRound,
  LogOut,
  Sparkles,
  Award,
  Video
} from "lucide-react"
import NewProfileSection from "@/app/estudiante/dashboard/components/NewProfileSection"
import NewCoursesSection from "@/app/estudiante/dashboard/components/NewCoursesSection"
import NewCertificatesSection from "@/app/estudiante/dashboard/components/NewCertificatesSection"
import NewRecommendationsSection from "@/app/estudiante/dashboard/components/NewRecommendationsSection"
import ActivationSection from "@/app/estudiante/dashboard/components/ActivationSection";
import StudentVideoCard from "@/app/estudiante/dashboard/components/StudentVideoCard";
import Chatbot from "./Chatbot"
import IntegratedStudentSidebar from "@/app/estudiante/dashboard/components/IntegratedStudentSidebar"
import Header from "./Header"
import { SidebarItem } from "./types"
import CourseDetailView from "./CourseDetailView"
import { useStudentData } from "@/hooks/useStudentData"

const sidebarItems: SidebarItem[] = [
  { id: 'profile', icon: User, label: "Mi Perfil" },
  { id: 'courses', icon: BookOpen, label: "Mis Cursos" },
  { id: 'videos', icon: Video, label: "Mis Videos" },
  { id: 'certificates', icon: Award, label: "Certificados" },
  { id: 'activate', icon: KeyRound, label: "Activar Curso" },
  { id: 'recommendations', icon: Sparkles, label: "Recomendaciones" },
]

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")
  const [userId, setUserId] = useState<number | null>(null)
  const { studentData, courses, myVideos, certificates, activityFeed, loading, refreshData } = useStudentData(userId)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user && user.id_usuario) {
      setUserId(user.id_usuario)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = "/";
  }

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourseId(courseId)
  }

  const handleBackToCourses = () => {
    setSelectedCourseId(null)
  }

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>
    }

    if (!studentData) {
      return <div>No student data found.</div>
    }

    if (activeSection === 'courses' && selectedCourseId) {
      return <CourseDetailView courseId={selectedCourseId} onBack={handleBackToCourses} />
    }

    switch (activeSection) {
      case 'profile':
        return <NewProfileSection student={studentData} activity={activityFeed} courses={courses} videos={myVideos} onProfileUpdate={refreshData} />
      case 'courses':
        return <NewCoursesSection courses={courses} onCourseSelect={handleSelectCourse} onCourseActivated={refreshData} />
      case 'videos':
        return <StudentVideoCard videos={myVideos} onVideoStatusChange={refreshData} />
      case 'certificates':
        return <NewCertificatesSection certificates={certificates} studentName={studentData.nombre_completo} />
      case 'activate':
        return <ActivationSection />
      case 'recommendations':
        return <NewRecommendationsSection />
      default:
        return <NewProfileSection student={studentData} activity={activityFeed} courses={courses} videos={myVideos} onProfileUpdate={refreshData} />
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 lg:flex">
        <div className="dark:border-r-0 lg:dark:border-r lg:dark:border-slate-800">
          <IntegratedStudentSidebar
            sidebarItems={sidebarItems}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLogout={handleLogout}
            isOpen={sidebarOpen}
            setOpen={setSidebarOpen}
          />
        </div>

        <div className="flex-1 lg:ml-64">
          <Header
            studentName={studentData?.nombre_completo || ''}
            avatar={studentData?.avatar || ''}
            onMenuClick={() => setSidebarOpen(true)}
            title="Panel de Estudiante"
          />
          <main className="p-4 sm:p-6 lg:p-8">{renderContent()}</main>
        </div>
      </div>

      <Chatbot />
    </div>
  )
}
