export default function toKebabCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')  // Convierte camelCase a kebab-case
        .replace(/\s+/g, '-')                   // Reemplaza los espacios por guiones
        .toLowerCase();                         // Convierte todo a minúsculas
}
