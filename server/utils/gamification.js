export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1
}


export function calculateXpGain(correctCount, passed) {
  const base = correctCount * 10
  const bonus = passed ? 20 : 0
  return base + bonus
}


function toDateString(date) {
  return new Date(date).toISOString().split('T')[0]
}


// Mutates the given user document's streak + lastActivityDate
export function updateStreak(user) {
  const today = toDateString(new Date())


  if (!user.lastActivityDate) {
    user.streak = 1
  } else {
    const lastDate = toDateString(user.lastActivityDate)


    if (lastDate !== today) {
      const yesterday = toDateString(new Date(Date.now() - 24 * 60 * 60 * 1000))
      user.streak = lastDate === yesterday ? user.streak + 1 : 1
    }
    // if lastDate === today, streak stays the same — already counted
  }


  user.lastActivityDate = new Date()
}
