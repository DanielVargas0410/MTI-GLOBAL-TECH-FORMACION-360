// Utilidades para categorías
export function filtrarCategoriasPorEstado(categorias, estado) {
  if (!estado || estado === '') return categorias;
  return categorias.filter(categoria => categoria.estado === estado);
}

export function getEstadoColorCategoria(estado) {
  switch (estado) {
    case 'activo':
      return 'badgeActivo';
    case 'inactivo':
      return 'badgeInactivo';
    default:
      return 'badgeDefault';
  }
}

export function ordenarCategoriasPorNombre(categorias) {
  return categorias.sort((a, b) => a.nombre.localeCompare(b.nombre));
}
