'use client'
import React, { useState, useEffect, FC } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { X } from 'lucide-react';

// Types
interface Video { id_video: number; titulo: string; descripcion: string; video_url: string; }
interface Module { id_modulo: number; titulo: string; descripcion: string; videos: Video[]; }
interface CourseDetailData { id_curso: number; titulo: string; descripcion: string; modulos: Module[]; }
interface CourseDetailViewProps { courseId: number; onBack: () => void; }

const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  let videoId = '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') videoId = urlObj.pathname.slice(1);
    else if (urlObj.hostname.includes('youtube.com')) videoId = urlObj.searchParams.get('v') || '';
  } catch (e) { return url; }
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1` : url;
};

const CourseDetailView: FC<CourseDetailViewProps> = ({ courseId, onBack }) => {
  const [courseData, setCourseData] = useState<CourseDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [seenVideos, setSeenVideos] = useState<Set<number>>(new Set());
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id_usuario) {
      setUserId(user.id_usuario);
    }
  }, []);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3001/cursos/${courseId}/detail`);
        if (!response.ok) throw new Error('Failed to fetch course details');
        const data = await response.json();
        setCourseData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSeenVideos = async (uid: number) => {
      try {
        const response = await fetch(`http://localhost:3001/videos-vistos/usuario/${uid}`);
        if (response.ok) {
          const seenIds = await response.json();
          setSeenVideos(new Set(seenIds));
        }
      } catch (err) { console.error("Failed to fetch seen videos:", err); }
    };

    if (courseId) fetchCourseData();
    if (userId) fetchSeenVideos(userId);

  }, [courseId, userId]);

  const handleToggleSeen = async (videoId: number, isChecked: boolean) => {
    if (!userId) return;

    const originalSeenVideos = new Set(seenVideos);
    const newSeenVideos = new Set(originalSeenVideos);
    if (isChecked) newSeenVideos.add(videoId); else newSeenVideos.delete(videoId);
    setSeenVideos(newSeenVideos);

    try {
      const response = await fetch(`http://localhost:3001/videos-vistos`, {
        method: isChecked ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: userId, id_video: videoId }),
      });
      if (!response.ok) throw new Error('Failed to update progress');
    } catch (error) {
      console.error(error);
      setSeenVideos(originalSeenVideos); // Revert on error
      alert('No se pudo actualizar tu progreso. Inténtalo de nuevo.');
    }
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error) return <div className="text-center py-10 text-destructive">Error: {error}</div>;
  if (!courseData) return <div className="text-center py-10">No se encontraron datos del curso.</div>;

  return (
    <div className="animate-fade-in-up text-foreground">
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Mis Cursos
      </Button>

      <div className="bg-card p-6 rounded-lg shadow-sm border dark:border-slate-800 mb-6">
        <h1 className="text-3xl font-bold text-foreground">{courseData.titulo}</h1>
        <p className="mt-2 text-muted-foreground">{courseData.descripcion}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Contenido del Curso</h2>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {courseData.modulos.map((module, index) => (
            <AccordionItem value={`item-${index}`} key={module.id_modulo}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                    <Badge>{`Módulo ${index + 1}`}</Badge>
                    <span>{module.titulo}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-2 bg-slate-100/50 dark:bg-slate-800/30 rounded-b-md">
                <p className="text-sm text-muted-foreground mb-4 ml-2">{module.descripcion}</p>
                <ul className="space-y-1">
                  {module.videos.map((video) => {
                    const isSeen = seenVideos.has(video.id_video);
                    return (
                      <li key={video.id_video} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isSeen ? 'text-muted-foreground' : ''}`}>
                        <Checkbox
                          id={`video-${video.id_video}`}
                          checked={isSeen}
                          onCheckedChange={(checked) => handleToggleSeen(video.id_video, !!checked)}
                        />
                        <label
                          htmlFor={`video-${video.id_video}`}
                          onClick={() => setSelectedVideo(video)}
                          className="flex-grow flex items-center gap-3 cursor-pointer hover:text-primary dark:hover:text-primary-light"
                        >
                          {isSeen ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <PlayCircle className="w-5 h-5 text-primary/70" />}
                          <span className={`font-medium ${isSeen ? 'line-through' : ''}`}>{video.titulo}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl w-full p-0 border-0 bg-transparent shadow-none aspect-video">
            <DialogHeader>
                <DialogTitle className="sr-only">{selectedVideo?.titulo}</DialogTitle>
                <DialogDescription className="sr-only">{selectedVideo?.descripcion}</DialogDescription>
            </DialogHeader>
            <DialogClose asChild className="absolute top-0 right-0 z-50 m-2">
                <Button variant="outline" size="icon" className="rounded-full bg-black/50 text-white border-white/20 hover:bg-black/75 hover:text-white"><X className="h-5 w-5" /><span className="sr-only">Cerrar</span></Button>
            </DialogClose>
            {selectedVideo && (
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(selectedVideo.video_url)}
                  title={selectedVideo.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetailView;
