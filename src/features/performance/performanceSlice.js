import { createSlice, createSelector } from '@reduxjs/toolkit'

/**
 * Redux slice for managing performance metrics and calculations
 * Uses memoized selectors for efficient computation
 */

const initialState = {
  preferences: {
    scoreCalculationMethod: 'weighted', // 'weighted' or 'simple'
    targetScore: 95,
    targetHoursPerDay: 8,
  },
  achievements: {
    badges: [],
    milestones: [],
  },
}

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    updateScoreMethod: (state, action) => {
      state.preferences.scoreCalculationMethod = action.payload
    },
    updateTargetScore: (state, action) => {
      state.preferences.targetScore = action.payload
    },
    updateTargetHours: (state, action) => {
      state.preferences.targetHoursPerDay = action.payload
    },
    addBadge: (state, action) => {
      if (!state.achievements.badges.includes(action.payload)) {
        state.achievements.badges.push(action.payload)
      }
    },
    addMilestone: (state, action) => {
      state.achievements.milestones.push({
        ...action.payload,
        achievedAt: new Date().toISOString(),
      })
    },
    resetAchievements: (state) => {
      state.achievements = { badges: [], milestones: [] }
    },
  },
})

export const {
  updateScoreMethod,
  updateTargetScore,
  updateTargetHours,
  addBadge,
  addMilestone,
  resetAchievements,
} = performanceSlice.actions

// Selectors
export const selectPerformancePreferences = (state) => state.performance.preferences
export const selectAchievements = (state) => state.performance.achievements

// Base selectors for employee data
const selectEmployeeSummary = (state) => state.dashboard.employee.data?.summary
const selectEmployeeRecent = (state) => state.dashboard.employee.data?.recent

// Memoized selector for calculating attendance metrics
export const selectAttendanceMetrics = createSelector(
  [selectEmployeeSummary],
  (summary) => {
    if (!summary) {
      return {
        totalDays: 0,
        latePercentage: 0,
        absentPercentage: 0,
        presentPercentage: 0,
      }
    }
    
    const totalDays = Object.values(summary).reduce((sum, val) => 
      typeof val === 'number' && val !== summary.totalHours ? sum + val : sum, 0
    )
    
    const latePercentage = totalDays > 0 ? ((summary.late || 0) / totalDays) * 100 : 0
    const absentPercentage = totalDays > 0 ? ((summary.absent || 0) / totalDays) * 100 : 0
    const presentPercentage = totalDays > 0 ? ((summary.present || 0) / totalDays) * 100 : 0
    
    return {
      totalDays,
      latePercentage: parseFloat(latePercentage.toFixed(1)),
      absentPercentage: parseFloat(absentPercentage.toFixed(1)),
      presentPercentage: parseFloat(presentPercentage.toFixed(1)),
    }
  }
)

// Memoized selector for calculating attendance score
export const selectAttendanceScore = createSelector(
  [selectEmployeeSummary, selectPerformancePreferences],
  (summary, preferences) => {
    if (!summary) return 0
    
    const totalDays = Object.values(summary).reduce((sum, val) => 
      typeof val === 'number' && val !== summary.totalHours ? sum + val : sum, 0
    )

    if (totalDays === 0) return 0

    if (preferences.scoreCalculationMethod === 'weighted') {
      // Weighted calculation: Present=100%, Late=80%, Half-day=50%, Absent=0%
      const score = (
        (summary.present || 0) * 100 +
        (summary.late || 0) * 80 +
        (summary['half-day'] || 0) * 50 +
        (summary.absent || 0) * 0
      ) / totalDays
      
      return parseFloat(score.toFixed(0))
    } else {
      // Simple calculation: Present and Late count, others don't
      const attendedDays = (summary.present || 0) + (summary.late || 0) + (summary['half-day'] || 0) * 0.5
      const score = (attendedDays / totalDays) * 100
      return parseFloat(score.toFixed(0))
    }
  }
)

// Memoized selector for performance breakdown
export const selectPerformanceBreakdown = createSelector(
  [selectEmployeeSummary, selectAttendanceMetrics],
  (summary, metrics) => {
    if (!summary) {
      return {
        present: 0,
        late: 0,
        halfDay: 0,
        absent: 0,
        total: 0,
      }
    }
    
    return {
      present: summary.present || 0,
      late: summary.late || 0,
      halfDay: summary['half-day'] || 0,
      absent: summary.absent || 0,
      total: metrics.totalDays,
    }
  }
)

// Memoized selector for badge progress
export const selectBadgeProgress = createSelector(
  [selectEmployeeSummary, selectAttendanceMetrics, selectAchievements],
  (summary, metrics, achievements) => {
    if (!summary) {
      return {
        onTimeDays: 0,
        workingDays: 0,
        badges: [],
        nextBadge: null,
        progressToNext: 0,
      }
    }
    
    const onTimeDays = summary.present || 0
    const workingDays = metrics.totalDays || 0

    const badges = [
      {
        id: 'bronze',
        label: 'Bronze Star',
        requirement: '5 on-time days',
        threshold: 5,
        color: 'from-amber-500/20 to-amber-400/10 border-amber-500/40 text-amber-200',
        achieved: onTimeDays >= 5 || achievements.badges.includes('bronze'),
      },
      {
        id: 'silver',
        label: 'Silver Star',
        requirement: '15 on-time days',
        threshold: 15,
        color: 'from-slate-200/20 to-slate-100/10 border-slate-200/40 text-slate-100',
        achieved: onTimeDays >= 15 || achievements.badges.includes('silver'),
      },
      {
        id: 'gold',
        label: 'Gold Star',
        requirement: 'Perfect month',
        threshold: Math.max(workingDays, 1),
        color: 'from-yellow-300/20 to-yellow-200/10 border-yellow-300/40 text-yellow-100',
        achieved: (workingDays > 0 && onTimeDays === workingDays) || achievements.badges.includes('gold'),
      },
    ]

    const nextBadge = badges.find((badge) => !badge.achieved)
    const progressToNext = nextBadge
      ? Math.min(100, Math.round((onTimeDays / nextBadge.threshold) * 100))
      : 100

    return {
      onTimeDays,
      workingDays,
      badges,
      nextBadge: nextBadge ? { ...nextBadge, current: onTimeDays } : null,
      progressToNext,
    }
  }
)

// Memoized selector for work hours analysis
export const selectWorkHoursAnalysis = createSelector(
  [selectEmployeeRecent],
  (records) => {
    if (!records || records.length === 0) {
      return {
        total: 0,
        average: 0,
        max: 0,
        min: 0,
      }
    }
    
    const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0)
    const avgHours = records.length > 0 ? totalHours / records.length : 0
    const maxHours = Math.max(...records.map(r => r.totalHours || 0), 0)
    const minHours = records.length > 0 ? Math.min(...records.filter(r => r.totalHours > 0).map(r => r.totalHours)) : 0

    return {
      total: parseFloat(totalHours.toFixed(1)),
      average: parseFloat(avgHours.toFixed(1)),
      max: parseFloat(maxHours.toFixed(1)),
      min: parseFloat(minHours.toFixed(1)),
    }
  }
)

export default performanceSlice.reducer
