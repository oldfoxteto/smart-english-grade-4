import React from 'react'
import { Box, Typography, Chip } from '@mui/material'

export type Badge = {
  id: string
  title: string
  icon: string
  color: string
  earned: boolean
}

interface BadgesListProps {
  badges: Badge[]
}

const BadgesList: React.FC<BadgesListProps> = ({ badges }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
      {badges.map((badge) => (
        <Box
          key={badge.id}
          sx={{
            textAlign: 'center',
            p: 1.5,
            background: badge.earned ? 'white' : '#f5f5f5',
            borderRadius: 2,
            border: badge.earned ? `2px solid ${badge.color}` : '2px solid #e0e0e0',
            boxShadow: badge.earned ? `0 4px 12px ${badge.color}20` : '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 0.5,
              filter: badge.earned ? 'none' : 'grayscale(1)',
              opacity: badge.earned ? 1 : 0.4
            }}
          >
            {badge.icon}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              color: badge.earned ? 'text.primary' : '#999'
            }}
          >
            {badge.title}
          </Typography>
          {badge.earned && (
            <Chip
              size="small"
              label="✓"
              sx={{
                mt: 0.5,
                height: 16,
                fontSize: '0.6rem',
                background: badge.color,
                color: 'white'
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  )
}

export default BadgesList
