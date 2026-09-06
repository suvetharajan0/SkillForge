const SKILL_COLORS = [
  { bg: 'bg-[#f7df1e]/10', text: 'text-[#b8860b]' },
  { bg: 'bg-[#61dafb]/10', text: 'text-[#0891b2]' },
  { bg: 'bg-[#339933]/10', text: 'text-[#339933]' },
  { bg: 'bg-[#e34f26]/10', text: 'text-[#e34f26]' },
  { bg: 'bg-[#47a248]/10', text: 'text-[#47a248]' },
]


export function getSkillStyle(name = '') {
  const index = name.charCodeAt(0) % SKILL_COLORS.length
  return SKILL_COLORS[index] || SKILL_COLORS[0]
}
