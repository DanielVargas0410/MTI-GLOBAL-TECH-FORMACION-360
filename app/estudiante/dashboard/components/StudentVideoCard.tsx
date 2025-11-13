'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

// Interfaces
interface Video {
  id_video: number
  titulo: string
  descripcion: string | null
  video_url: string
  thumbnail_url: string | null
  id_modulo: number
  numero_orden: number
  estado: string
  created_at: string
  updated_at: string
  modulo_titulo: string
  id_curso: number | null
  curso_titulo: string | null
}

interface StudentVideoCardProps {
  videos: Video[];
  onVideoStatusChange: () => void;
}

// Helper Functions
const getYoutubeEmbedUrl = (url: string): string | null => {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`
    }
    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname === '/watch') {
        return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`
      }
      if (urlObj.pathname.startsWith('/embed/')) {
        return url
      }
    }
  } catch (e) {
    return null
  }
  return null
}

const getFullFileUrl = (url: string) => {
  return url ? (url.startsWith('http') || url.startsWith('blob:') ? url : `http://localhost:3001${url}`) : ''
}

export default function StudentVideoCard({ videos, onVideoStatusChange }: StudentVideoCardProps) {
  const [seenVideos, setSeenVideos] = useState<number[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser)
      setUser(parsedUser)
      fetchSeenVideos(parsedUser.id_usuario)
    }
  }, [])

  const fetchSeenVideos = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/videos-vistos/usuario/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSeenVideos(data)
      }
    } catch (error) {
      console.error('Error fetching seen videos:', error)
    }
  }

  const toggleVideoSeen = async (videoId: number) => {
    if (!user) return

    const isSeen = seenVideos.includes(videoId)
    const url = 'http://localhost:3001/videos-vistos'
    const method = isSeen ? 'DELETE' : 'POST'
    const body = JSON.stringify({ id_usuario: user.id_usuario, id_video: videoId })

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      if (response.ok) {
        setSeenVideos(prev =>
          isSeen
            ? prev.filter(id => id !== videoId)
            : [...prev, videoId]
        );
        onVideoStatusChange(); // Call the callback function
      }
    } catch (error) {
      console.error('Error toggling video seen status:', error)
    }
  }

  const videosAgrupados = Array.isArray(videos)
    ? videos.reduce((acc, video) => {
        const cursoKey = video.curso_titulo || 'Sin Curso Asignado'
        if (!acc[cursoKey]) acc[cursoKey] = []
        acc[cursoKey].push(video)
        return acc
      }, {} as Record<string, Video[]>)
    : {}

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mis Videos</h2>

      <div className="space-y-10">
        {Object.entries(videosAgrupados).map(([cursoTitulo, videosDelCurso]) => (
          <section key={cursoTitulo}>
            <h3 className="text-2xl font-bold mb-4 border-b pb-2">{cursoTitulo}</h3>
            <div className="space-y-4">
              {videosDelCurso.map((video) => {
                const embedUrl = getYoutubeEmbedUrl(video.video_url)
                return (
                  <Card key={video.id_video} className="flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-1/3">
                      <div className="relative w-full aspect-video">
                        <Image
                          src={video.thumbnail_url ? getFullFileUrl(video.thumbnail_url) : '/placeholder.jpg'}
                          alt={`Miniatura del video: ${video.titulo}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{video.titulo}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {video.descripcion}
                        </p>
                        <div className="flex items-center">
                          <Checkbox
                            checked={seenVideos.includes(video.id_video)}
                            onCheckedChange={() => toggleVideoSeen(video.id_video)}
                          />
                          <span className="ml-2 text-sm">
                            {seenVideos.includes(video.id_video) ? 'Visto' : 'Marcar como visto'}
                          </span>
                        </div>
                      </CardContent>
                    </div>
                    <div className="w-full md:w-2/3">
                      <div className="aspect-video">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            title={video.titulo}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        ) : (
                          <video
                            src={getFullFileUrl(video.video_url)}
                            controls
                            poster={video.thumbnail_url ? getFullFileUrl(video.thumbnail_url) : undefined}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
