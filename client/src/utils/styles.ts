export const themeToCssVariables = (theme: Record<string, any>) => {
  const toCssVariables = (obj: Record<string, any>, prefix: string = '--') => {
    return Object.entries(obj)
      .map(([key, value]): string => {
        if (typeof value === 'object') {
          return toCssVariables(value, `${prefix}${key}-`)
        }
        return `${prefix}${key}: ${value};`
      })
      .join('\n')
  }
  return toCssVariables(theme)
}
