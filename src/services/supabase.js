import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// WORDS OPERATIONS
// ============================================

export async function getAllWords() {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching words:', error)
    throw error
  }
}

export async function getWordById(id) {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching word:', error)
    throw error
  }
}

export async function createWord(wordData) {
  try {
    const { data, error } = await supabase
      .from('words')
      .insert([{
        word: wordData.word,
        meaning: wordData.meaning,
        examples: wordData.examples || [],
        tags: wordData.tags || [],
        simplified_meaning: wordData.simplified_meaning || null
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating word:', error)
    throw error
  }
}

export async function updateWord(id, updates) {
  try {
    const { data, error } = await supabase
      .from('words')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating word:', error)
    throw error
  }
}

export async function deleteWord(id) {
  try {
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Also delete from review schedule
    await supabase
      .from('review_schedule')
      .delete()
      .eq('item_type', 'word')
      .eq('item_id', id)

    return true
  } catch (error) {
    console.error('Error deleting word:', error)
    throw error
  }
}

// ============================================
// IDIOMS OPERATIONS
// ============================================

export async function getAllIdioms() {
  try {
    const { data, error } = await supabase
      .from('idioms')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching idioms:', error)
    throw error
  }
}

export async function getIdiomById(id) {
  try {
    const { data, error } = await supabase
      .from('idioms')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching idiom:', error)
    throw error
  }
}

export async function createIdiom(idiomData) {
  try {
    const { data, error } = await supabase
      .from('idioms')
      .insert([{
        idiom: idiomData.idiom,
        meaning: idiomData.meaning,
        origin: idiomData.origin || null,
        examples: idiomData.examples || [],
        tags: idiomData.tags || [],
        simplified_meaning: idiomData.simplified_meaning || null
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating idiom:', error)
    throw error
  }
}

export async function updateIdiom(id, updates) {
  try {
    const { data, error } = await supabase
      .from('idioms')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating idiom:', error)
    throw error
  }
}

export async function deleteIdiom(id) {
  try {
    const { error } = await supabase
      .from('idioms')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Also delete from review schedule
    await supabase
      .from('review_schedule')
      .delete()
      .eq('item_type', 'idiom')
      .eq('item_id', id)

    return true
  } catch (error) {
    console.error('Error deleting idiom:', error)
    throw error
  }
}

// ============================================
// TAGS OPERATIONS
// ============================================

export async function getAllTags() {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw error
  }
}

export async function createTag(name, color) {
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name, color }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating tag:', error)
    throw error
  }
}

export async function deleteTag(id) {
  try {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting tag:', error)
    throw error
  }
}

// ============================================
// QUIZ OPERATIONS
// ============================================

export async function saveQuizResult(quizData) {
  try {
    const { data, error } = await supabase
      .from('quiz_history')
      .insert([{
        type: quizData.type,
        score: quizData.score,
        total_questions: quizData.total_questions,
        completed_at: quizData.completed_at || new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving quiz result:', error)
    throw error
  }
}

export async function getQuizHistory(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('quiz_history')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching quiz history:', error)
    throw error
  }
}

// ============================================
// SPACED REPETITION OPERATIONS
// ============================================

export async function getItemsDueForReview() {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('review_schedule')
      .select('*')
      .lte('next_review_at', now)
      .order('next_review_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching due items:', error)
    throw error
  }
}

export async function createReviewSchedule(itemType, itemId) {
  try {
    // Check if schedule already exists
    const { data: existing } = await supabase
      .from('review_schedule')
      .select('*')
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .single()

    if (existing) {
      return existing
    }

    // Create new schedule
    const { data, error } = await supabase
      .from('review_schedule')
      .insert([{
        item_type: itemType,
        item_id: itemId,
        easiness_factor: 2.5,
        repetition_count: 0,
        interval_days: 1,
        next_review_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating review schedule:', error)
    throw error
  }
}

export async function updateReviewSchedule(id, scheduleData) {
  try {
    const { data, error } = await supabase
      .from('review_schedule')
      .update({
        easiness_factor: scheduleData.easiness_factor,
        repetition_count: scheduleData.repetition_count,
        interval_days: scheduleData.interval_days,
        next_review_at: scheduleData.next_review_at,
        last_reviewed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating review schedule:', error)
    throw error
  }
}

export async function getReviewScheduleForItem(itemType, itemId) {
  try {
    const { data, error } = await supabase
      .from('review_schedule')
      .select('*')
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
    return data || null
  } catch (error) {
    console.error('Error fetching review schedule:', error)
    throw error
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export async function getRandomItems(count = 10, type = 'both') {
  try {
    let items = []

    if (type === 'words' || type === 'both') {
      const { data: words } = await supabase
        .from('words')
        .select('*')
      if (words) items = [...items, ...words.map(w => ({ ...w, type: 'word' }))]
    }

    if (type === 'idioms' || type === 'both') {
      const { data: idioms } = await supabase
        .from('idioms')
        .select('*')
      if (idioms) items = [...items, ...idioms.map(i => ({ ...i, type: 'idiom' }))]
    }

    // Shuffle and return count items
    const shuffled = items.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  } catch (error) {
    console.error('Error fetching random items:', error)
    throw error
  }
}

export async function getStats() {
  try {
    const [wordsResult, idiomsResult, dueResult, quizResult] = await Promise.all([
      supabase.from('words').select('id', { count: 'exact', head: true }),
      supabase.from('idioms').select('id', { count: 'exact', head: true }),
      getItemsDueForReview(),
      getQuizHistory(5)
    ])

    return {
      totalWords: wordsResult.count || 0,
      totalIdioms: idiomsResult.count || 0,
      dueCount: dueResult.length,
      recentQuizzes: quizResult
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}
