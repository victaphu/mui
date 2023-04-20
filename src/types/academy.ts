export type AcademyItem = {
  id: string
  title: string
  video: string
  image: string
  order: number
  intro?: string
  content?: string
  category?: string
  wp_id?: number
  created_at: number
  updated_at: number
}

export type AcademyItemUser = {
  id: number
  user_id: string
  academy_item_id: string
  status: string
  created_at: number
  updated_at: number
  completed_at: string
  title: string
}
