const templateModules = import.meta.glob('../../Marketing/png/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export function getTemplatePreview(slug: string): string | undefined {
  const key = Object.keys(templateModules).find((k) => k.includes(`${slug}.png`))
  return key ? templateModules[key] : undefined
}

export const allTemplatePreviews = templateModules
