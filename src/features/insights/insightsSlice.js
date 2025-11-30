import { createSlice, createSelector } from '@reduxjs/toolkit'
import { formatISTDate } from '../../utils/helpers'

/**
 * Redux slice for managing insights and recommendations
 * Computes insights from attendance data using memoized selectors
 */

const initialState = {
  preferences: {
    showInsights: true,
    showRecommendations: true,
    insightRefreshInterval: 3600000, // 1 hour in ms
  },
  lastComputedAt: null,
  dismissedInsights: [],
  dismissedRecommendations: [],
}

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    dismissInsight: (state, action) => {
      state.dismissedInsights.push(action.payload)
    },
    dismissRecommendation: (state, action) => {
      state.dismissedRecommendations.push(action.payload)
    },
    clearDismissedInsights: (state) => {
      state.dismissedInsights = []
    },
    clearDismissedRecommendations: (state) => {
      state.dismissedRecommendations = []
    },
    toggleInsights: (state) => {
      state.preferences.showInsights = !state.preferences.showInsights
    },
    toggleRecommendations: (state) => {
      state.preferences.showRecommendations = !state.preferences.showRecommendations
    },
    updateLastComputed: (state) => {
      state.lastComputedAt = new Date().toISOString()
    },
  },
})

export const {
  dismissInsight,
  dismissRecommendation,
  clearDismissedInsights,
  clearDismissedRecommendations,
  toggleInsights,
  toggleRecommendations,
  updateLastComputed,
} = insightsSlice.actions

// Selectors
export const selectInsightsPreferences = (state) => state.insights.preferences
export const selectDismissedInsights = (state) => state.insights.dismissedInsights
export const selectDismissedRecommendations = (state) => state.insights.dismissedRecommendations
export const selectLastComputedAt = (state) => state.insights.lastComputedAt

// Memoized selector for computing insights from attendance records
export const selectComputedInsights = createSelector(
  [(state) => state.dashboard.employee.data?.recent || []],
  (records) => {
    if (!records || records.length === 0) return []

    const insights = []

    // Analyze punctuality by day of week
    const dayStats = records.reduce((acc, record) => {
      if (!record.checkInTime) return acc

      const day = formatISTDate(record.date, { weekday: 'long' }, 'en-US')
      if (day === '—') {
        return acc
      }
      
      if (!acc[day]) {
        acc[day] = { total: 0, onTime: 0, late: 0 }
      }
      
      acc[day].total++
      if (record.status === 'present') {
        acc[day].onTime++
      } else if (record.status === 'late') {
        acc[day].late++
      }
      
      return acc
    }, {})

    // Find best day
    const bestDay = Object.entries(dayStats)
      .map(([day, stats]) => ({
        day,
        onTimeRate: stats.total > 0 ? (stats.onTime / stats.total) * 100 : 0,
        total: stats.total
      }))
      .filter(d => d.total >= 2)
      .sort((a, b) => b.onTimeRate - a.onTimeRate)[0]

    if (bestDay && bestDay.onTimeRate >= 80) {
      insights.push({
        id: 'best-day',
        type: 'positive',
        icon: '📊',
        title: 'Pattern Detected',
        message: `You were more punctual on ${bestDay.day}s this month.`,
        detail: `${Math.round(bestDay.onTimeRate)}% on-time arrival rate`,
        color: 'emerald',
        priority: 1
      })
    }

    // Analyze recent streak
    const recentRecords = [...records].reverse().slice(0, 7)
    const currentStreak = recentRecords.reduce((streak, record) => {
      if (streak === null) return null
      if (record.status === 'present') return streak + 1
      return null
    }, 0)

    if (currentStreak !== null && currentStreak >= 3) {
      insights.push({
        id: 'streak',
        type: 'achievement',
        icon: '🔥',
        title: 'Hot Streak!',
        message: `You're on a ${currentStreak}-day on-time streak.`,
        detail: 'Keep up the excellent work!',
        color: 'orange',
        priority: 0
      })
    }

    // Check for improvement trend
    const firstHalf = records.slice(0, Math.floor(records.length / 2))
    const secondHalf = records.slice(Math.floor(records.length / 2))
    
    const firstHalfOnTime = firstHalf.filter(r => r.status === 'present').length
    const secondHalfOnTime = secondHalf.filter(r => r.status === 'present').length
    
    const firstRate = firstHalf.length > 0 ? (firstHalfOnTime / firstHalf.length) * 100 : 0
    const secondRate = secondHalf.length > 0 ? (secondHalfOnTime / secondHalf.length) * 100 : 0
    
    if (secondRate > firstRate + 10) {
      insights.push({
        id: 'improvement',
        type: 'positive',
        icon: '📈',
        title: 'Great Improvement!',
        message: 'Your punctuality has improved significantly.',
        detail: `${Math.round(secondRate - firstRate)}% better in recent weeks`,
        color: 'sky',
        priority: 1
      })
    }

    // Late pattern warning
    const lateCount = records.filter(r => r.status === 'late').length
    const lateRate = records.length > 0 ? (lateCount / records.length) * 100 : 0
    
    if (lateRate > 20 && lateCount >= 3) {
      insights.push({
        id: 'late-pattern',
        type: 'warning',
        icon: '⚠️',
        title: 'Punctuality Alert',
        message: 'You\'ve been late more frequently recently.',
        detail: `${lateCount} late arrivals this month`,
        color: 'amber',
        priority: 0
      })
    }

    // Average check-in time analysis
    const checkInTimes = records
      .filter(r => r.checkInTime)
      .map(r => {
        const time = new Date(r.checkInTime)
        return time.getHours() + time.getMinutes() / 60
      })

    if (checkInTimes.length > 0) {
      const avgCheckInTime = checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length
      const avgHour = Math.floor(avgCheckInTime)
      const avgMinute = Math.round((avgCheckInTime - avgHour) * 60)
      
      insights.push({
        id: 'avg-time',
        type: 'info',
        icon: '⏰',
        title: 'Your Average Check-in',
        message: `You typically arrive at ${avgHour}:${avgMinute.toString().padStart(2, '0')} AM.`,
        detail: avgCheckInTime < 9 ? 'Early bird! 🌅' : 'Consider arriving earlier for the badge.',
        color: avgCheckInTime < 9 ? 'emerald' : 'purple',
        priority: 2
      })
    }

    // Productivity insight
    const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0)
    const avgHours = records.length > 0 ? totalHours / records.length : 0
    
    if (avgHours >= 8.5) {
      insights.push({
        id: 'hours',
        type: 'positive',
        icon: '💪',
        title: 'Strong Work Ethic',
        message: `You average ${avgHours.toFixed(1)} hours per day.`,
        detail: 'Outstanding dedication!',
        color: 'emerald',
        priority: 1
      })
    }

    return insights.sort((a, b) => a.priority - b.priority).slice(0, 5)
  }
)

// Memoized selector for computing recommendations
export const selectComputedRecommendations = createSelector(
  [
    (state) => state.dashboard.employee.data?.recent || []
  ],
  (records) => {
    const recommendations = []

    // Calculate stats
    const lateRecords = records.filter(r => r.status === 'late')
    
    // Recommendation: Early arrival
    if (lateRecords.length > 0) {
      recommendations.push({
        id: 'early-arrival',
        icon: '🎯',
        title: 'Arrive Earlier',
        message: 'Try checking in before 9:05 AM to earn a punctuality badge.',
        action: 'Set a reminder',
        color: 'sky',
        priority: 1
      })
    }

    // Recommendation: Consistency
    const recentWeek = records.slice(-7)
    const missedDays = recentWeek.filter(r => r.status === 'absent').length
    
    if (missedDays > 1) {
      recommendations.push({
        id: 'consistency',
        icon: '📅',
        title: 'Build Consistency',
        message: 'Try to check in every workday to build a strong attendance record.',
        action: 'View calendar',
        color: 'purple',
        priority: 2
      })
    }

    // Recommendation: Work hours
    const avgHours = records.length > 0
      ? records.reduce((sum, r) => sum + (r.totalHours || 0), 0) / records.length
      : 0

    if (avgHours < 8 && records.length >= 5) {
      recommendations.push({
        id: 'work-hours',
        icon: '⏱️',
        title: 'Increase Work Hours',
        message: `Your average is ${avgHours.toFixed(1)} hours. Aim for 8+ hours per day.`,
        action: 'Track time',
        color: 'orange',
        priority: 3
      })
    }

    // Recommendation: Perfect week
    const thisWeek = records.slice(-5)
    const onTimeThisWeek = thisWeek.filter(r => r.status === 'present').length
    
    if (onTimeThisWeek === thisWeek.length && thisWeek.length >= 3) {
      recommendations.push({
        id: 'perfect-week',
        icon: '🏆',
        title: 'Perfect Week in Progress!',
        message: 'You\'ve been on time every day this week. Keep it up!',
        action: 'Celebrate',
        color: 'emerald',
        priority: 0
      })
    }

    return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 4)
  }
)

// Filtered selectors that exclude dismissed items
export const selectActiveInsights = createSelector(
  [selectComputedInsights, selectDismissedInsights],
  (insights, dismissed) => insights.filter(insight => !dismissed.includes(insight.id))
)

export const selectActiveRecommendations = createSelector(
  [selectComputedRecommendations, selectDismissedRecommendations],
  (recommendations, dismissed) => recommendations.filter(rec => !dismissed.includes(rec.id))
)

export default insightsSlice.reducer
