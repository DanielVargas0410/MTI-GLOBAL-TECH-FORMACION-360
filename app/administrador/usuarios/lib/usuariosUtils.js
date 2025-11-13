export function filtrarUsuariosPorRol(users, filtroRol) {
  if (!filtroRol || filtroRol === 'all') return users;
  return users.filter(user => user.rol === filtroRol);
}

export function filtrarUsuariosPorEstado(users, filtroEstado) {
  if (!filtroEstado || filtroEstado === 'all') return users;
  return users.filter(user => user.estado === filtroEstado);
}

export function ordenarUsuariosPorNombre(users) {
  return users.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));
}

export function generarAvatarPlaceholder(nombre) {
  const initials = nombre.split(' ').map(n => n[0]).join('').toUpperCase();
  return initials;
}

export function formatearFechaRegistro(fecha) {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES');
}
