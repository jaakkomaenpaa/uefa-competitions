export const sleep = (s: number) => {
  return new Promise(resolve => setTimeout(resolve, s * 1000))
}

export const splitArrayIntoChunks = (array: any[], chunkSize: number) => {
  const chunks: any[] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

