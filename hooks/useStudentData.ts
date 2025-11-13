import { useState, useEffect, useCallback } from 'react';
import { StudentData, Course, ActivityItem, Certificate } from '@/components/types';

export function useStudentData(userId: number | null) {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [myVideos, setMyVideos] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [studentRes, coursesRes, certificatesRes, activityRes, videosRes] = await Promise.all([
        fetch(`http://localhost:3001/users/${userId}`),
        fetch(`http://localhost:3001/cursos-estudiante/estudiante/${userId}`),
        fetch(`http://localhost:3001/certificados/usuario/${userId}`),
        fetch(`http://localhost:3001/actividades/usuario/${userId}`),
        fetch(`http://localhost:3001/videos/estudiante/${userId}`),
      ]);

      const student = await studentRes.json();
      const courses = await coursesRes.json();
      const myVideos = await videosRes.json();
      const certificates = await certificatesRes.json();
      const activitiesRaw = await activityRes.json();
      const activities = activitiesRaw.map((a: any) => ({
        id: a.id_actividad,
        type: a.tipo_actividad,
        description: a.descripcion,
        timestamp: a.fecha_actividad,
      }));

      // Map foto_perfil_url to avatar
      const studentWithAvatar = { ...student, avatar: student.foto_perfil_url };

      setStudentData(studentWithAvatar);
      setCourses(courses);
      setMyVideos(myVideos);
      setCertificates(certificates);
      setActivityFeed(activities);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  return {
    studentData,
    courses,
    myVideos,
    certificates,
    activityFeed,
    loading,
    refreshData: fetchStudentData,
  };
}
