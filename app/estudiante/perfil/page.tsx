'use client'

import { useState } from 'react'
import EditProfile from './EditProfile'

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Mi Perfil</h1>
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Editar Perfil
        </button>
      ) : (
        <>
          <EditProfile />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  )
}
