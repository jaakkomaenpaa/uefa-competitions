import { baseApiUrl } from '../config'

export const getImageUrl = (url: string) => {
  const response = `${baseApiUrl}/proxy?url=${encodeURIComponent(url)}`
  return response
}