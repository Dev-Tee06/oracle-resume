export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
  })
}

export function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(dateString)
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE_MB = 10
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

export function validateImageFile(file) {
  if (!file) return 'No file selected.'
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Unsupported format. Use JPEG, PNG, or WebP.'
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `File too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`
  }
  return null
}

export function generateStoragePath(projectId, filename) {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const unique = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  return `projects/${projectId}/${unique}.${ext}`
}

export function truncate(text, length = 120) {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '…' : text
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
