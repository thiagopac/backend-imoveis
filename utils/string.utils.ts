/**
 * Converte uma string para o formato de título (Title Case).
 * Exemplo: "BELO HORIZONTE" será convertido para "Belo Horizonte".
 * @param str A string a ser convertida.
 * @returns A string convertida.
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ')
}
