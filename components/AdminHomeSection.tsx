"use client"
import React, { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Award, TrendingUp, Users, BookOpen } from "lucide-react"
import { AdminMetric, AdminActivity, AdminPieData } from "./types"

type AdminHomeSectionProps = {
  metrics: AdminMetric[]
  activities: AdminActivity[]
  pieData: AdminPieData[]
}

const AdminHomeSection: FC<AdminHomeSectionProps> = ({ metrics, activities, pieData }) => (
  <div className="space-y-6">
    {/* Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="animate-fade-in-up border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metric.value}</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">{metric.change}</p>
              </div>
              <div className="h-12 w-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <metric.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 6).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/student-avatar.png" />
                  <AvatarFallback>
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                    {activity.course && <span className="text-blue-600 dark:text-blue-400"> {activity.course}</span>}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progreso de Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
                  formatter={(value, name) => [`${value} actividades`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {pieData.reduce((sum, item) => sum + item.value, 0)}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Total Actividades</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {pieData.length}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">Categorías</div>
            </div>
          </div>

          {/* Detailed Legend */}
          <div className="mt-4 space-y-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.name}</span>
                </div>
                <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {entry.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

export default AdminHomeSection
