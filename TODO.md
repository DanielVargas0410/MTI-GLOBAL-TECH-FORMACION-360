# TODO: Corregir Sección de Perfil del Estudiante

## Información Recopilada
- La sección de perfil en el dashboard del estudiante no muestra información real del estudiante.
- Campos faltantes en la query del backend: `direccion` y `foto_perfil_url`.
- El frontend no mapea `foto_perfil_url` a `avatar`.
- El botón "Editar Perfil" no envía datos al backend; solo hace console.log.
- Falta refrescar datos después de editar el perfil.

## Plan de Actualización
1. Actualizar query en `backend/controllers/userController.js` para incluir `direccion` y `foto_perfil_url`.
2. En `hooks/useStudentData.ts`, mapear `foto_perfil_url` a `avatar` en `studentData`.
3. Implementar `handleSubmit` en `app/estudiante/perfil/EditProfile.tsx` con fetch a `PUT /users/profile/:id_usuario`.
4. Agregar prop `onUpdate` en `EditProfile` para refrescar datos después de guardar.
5. En `app/estudiante/dashboard/components/NewProfileSection.tsx`, pasar `onUpdate` a `EditProfile`.
6. En `components/student-dashboard.tsx`, pasar `refreshData` como `onProfileUpdate` a `NewProfileSection`.

## Pasos a Completar
- [ ] Actualizar query en backend/controllers/userController.js
- [ ] Mapear avatar en hooks/useStudentData.ts
- [ ] Implementar envío en EditProfile.tsx
- [ ] Agregar onUpdate en EditProfile.tsx
- [ ] Pasar onUpdate en NewProfileSection.tsx
- [ ] Pasar refreshData en student-dashboard.tsx

## Archivos Dependientes
- backend/controllers/userController.js
- hooks/useStudentData.ts
- app/estudiante/perfil/EditProfile.tsx
- app/estudiante/dashboard/components/NewProfileSection.tsx
- components/student-dashboard.tsx

## Pasos de Seguimiento
- Probar la funcionalidad después de cambios.
- Verificar que los datos se muestren correctamente en el perfil.
- Confirmar que la edición funcione y refresque los datos.
