'use client'
import React from 'react'
import { ActivityItem } from '@/components/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, CheckCircle, Award } from 'lucide-react'

type NewActivitySectionProps = {
  activity: ActivityItem[]
}

export default function NewActivitySection({ activity }: NewActivitySectionProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-6 animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-mti-blue">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="activity-list">
          {activity.map((item) => (
            <li key={item.id} className="activity-item">
              <div className="activity-icon">
                {item.type === 'start_course' && <Play size={20} />}
                {item.type === 'complete_module' && <CheckCircle size={20} />}
                {item.type === 'earn_certificate' && <Award size={20} />}
              </div>
              <div>
                <p className="font-semibold text-mti-blue">{item.description}</p>
                <p className="text-sm text-gray-500">{formatDate(item.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
