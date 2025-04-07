import { supabase } from "../lib/supabase"

export type ReflectionType = "bud" | "rose" | "thorn"

export interface Reflection {
  id: string
  user_id: string
  type: ReflectionType
  content: string
  created_at: string
}

export const reflectionService = {
  async getReflections(userId: string, type?: ReflectionType): Promise<Reflection[]> {
    let query = supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Reflection[]
  },

  async addReflection(userId: string, type: ReflectionType, content: string): Promise<Reflection> {
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          user_id: userId,
          type,
          content,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data as Reflection
  },

  getReflectionTypeEmoji(type: ReflectionType): string {
    switch (type) {
      case "bud":
        return "🌱"
      case "rose":
        return "🌹"
      case "thorn":
        return "🌵"
    }
  },

  getReflectionTypeDescription(type: ReflectionType): string {
    switch (type) {
      case "bud":
        return "Opportunities"
      case "rose":
        return "Success Stories"
      case "thorn":
        return "Challenges"
    }
  }
} 