'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, CheckCircle, Circle } from 'lucide-react';

interface Video {
  id_video: number;
  video_titulo: string;
  video_descripcion: string;
  video_url: string;
  thumbnail_url: string;
  id_modulo: number;
  modulo_titulo: string;
  id_curso: number;
  curso_titulo: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [seenVideos, setSeenVideos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      fetchVideos(parsedUser.id_usuario);
      fetchSeenVideos(parsedUser.id_usuario);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchVideos = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/videos/estudiante/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchSeenVideos = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/videos-vistos/usuario/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSeenVideos(data);
      }
    } catch (error) {
      console.error('Error fetching seen videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoSeen = async (videoId: number) => {
    if (!user) return;

    const isSeen = seenVideos.includes(videoId);
    const url = 'http://localhost:3001/videos-vistos';
    const method = isSeen ? 'DELETE' : 'POST';
    const body = JSON.stringify({ id_usuario: user.id_usuario, id_video: videoId });

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        setSeenVideos(prev =>
          isSeen
            ? prev.filter(id => id !== videoId)
            : [...prev, videoId]
        );
      }
    } catch (error) {
      console.error('Error toggling video seen status:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Cargando videos...</div>;
  }

  if (!user) {
    return <div className="container mx-auto py-8">Debes iniciar sesión para ver tus videos.</div>;
  }

  // Group videos by course and module
  const groupedVideos = videos.reduce((acc, video) => {
    const courseKey = video.curso_titulo;
    const moduleKey = video.modulo_titulo;

    if (!acc[courseKey]) acc[courseKey] = {};
    if (!acc[courseKey][moduleKey]) acc[courseKey][moduleKey] = [];
    acc[courseKey][moduleKey].push(video);

    return acc;
  }, {} as Record<string, Record<string, Video[]>>);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Mis Videos</h1>

      {Object.keys(groupedVideos).length === 0 ? (
        <p>No tienes videos disponibles. Activa un curso para comenzar.</p>
      ) : (
        Object.entries(groupedVideos).map(([courseTitle, modules]) => (
          <div key={courseTitle} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{courseTitle}</h2>
            {Object.entries(modules).map(([moduleTitle, moduleVideos]) => (
              <Card key={moduleTitle} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">{moduleTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moduleVideos.map((video) => (
                      <div key={video.id_video} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <Play className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{video.video_titulo}</h3>
                            <p className="text-sm text-gray-600">{video.video_descripcion}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Ver Video
                          </Button>
                          <Checkbox
                            checked={seenVideos.includes(video.id_video)}
                            onCheckedChange={() => toggleVideoSeen(video.id_video)}
                          />
                          <span className="text-sm">
                            {seenVideos.includes(video.id_video) ? 'Visto' : 'No visto'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
