export type StudentData = {
  id_usuario: number;
  email: string;
  nombre_completo: string;
  telefono: string;
  ciudad: string;
  pais: string;
  rol: string;
  estado: string;
  fecha_registro: string;
  fecha_ultimo_acceso: string;
  avatar: string;
  direccion?: string;
};

export type ActivityItem = {
  id: number;
  type: string;
  description: string;
  timestamp: string;
};

export type Course = {
  id_curso: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  progreso: number;
  estado: string;
};

export type CourseProgress = {
  name: string;
  progress: number;
};

export type TimeSpent = {
  day: string;
  hours: number;
};

export type ProgressDetails = {
  overallProgress: number;
  courses: CourseProgress[];
  timeSpent: TimeSpent[];
};

export type Certificate = {
  id: number;
  courseName: string;
  issueDate: string;
  credentialId: string;
};

export type SidebarItem = {
  id: string;
  icon: any;
  label: string;
};

export type SidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export type HeaderProps = { studentName: string; avatar: string; onMenuClick: () => void; title?: string; };

// Admin types
export type AdminMetric = {
  title: string;
  value: string;
  icon: any;
  change: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
};

export type AdminChartData = {
  month: string;
  estudiantes: number;
  cursos: number;
  videos_vistos?: number;
  total_videos?: number;
};

export type AdminPieData = {
  name: string;
  value: number;
  color: string;
};

export type AdminActivity = {
  user: string;
  action: string;
  course: string;
  time: string;
};

export type AdminSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export type AdminHeaderProps = {
  adminName: string;
  adminEmail: string;
  avatar: string;
  onMenuClick: () => void;
};

export type StudentSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};
