import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Avatar, IconButton, Stack, Chip, Tabs, Tab } from '@mui/material';
import { ArrowBack, Whatshot, WorkspacePremium, Security, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../core/ProgressContext';
import { getGamificationStatus } from '../core/api';
import { motion, AnimatePresence } from 'framer-motion';

type LeagueType = 'Bronze' | 'Silver' | 'Gold';

interface LeaderboardUser {
    id: string;
    name: string;
    xp: number;
    streak: number;
    isCurrentUser?: boolean;
    rank?: number;
}

// Generate deterministic mock users
const generateMockUsers = (league: LeagueType, count: number): LeaderboardUser[] => {
    const names = [
        'Youssef Ahmed', 'Sara Mohamed', 'Omar Ali', 'Laila Hassan', 'Ziad Tariq',
        'Nour Kareem', 'Habiba Said', 'Kareem Mostafa', 'Mariam Tarek', 'Ali Yasser'
    ];
    // Base XP depends on league
    const base = league === 'Gold' ? 8000 : league === 'Silver' ? 4000 : 1500;
    const spread = league === 'Gold' ? 7000 : league === 'Silver' ? 3000 : 2000;

    return Array.from({ length: count }).map((_, i) => ({
        id: `${league}-${i}`,
        name: names[i % names.length] + (i > names.length - 1 ? ` ${i}` : ''),
        // Predictable pseudo-random
        xp: Math.round(base + (Math.sin(i * 13) * spread)),
        streak: Math.max(1, Math.round(15 + Math.sin(i * 7) * 14))
    }));
};

const LeaderboardPage = () => {
    const navigate = useNavigate();
    const { progress } = useProgress();
    const [currentLeague, setCurrentLeague] = useState<LeagueType>('Bronze');
    const [stats, setStats] = useState({ xp: 0, streak: 1 });

    useEffect(() => {
        getGamificationStatus().then((gamification: any) => {
            const currentXp = gamification?.totalXp ?? (progress.stars * 10) + 2100;
            const currentStreak = gamification?.currentStreakDays ?? 1;
            setStats({ xp: currentXp, streak: currentStreak });

            // Auto-assign league based on XP
            if (currentXp > 6000) setCurrentLeague('Gold');
            else if (currentXp > 3000) setCurrentLeague('Silver');
            else setCurrentLeague('Bronze');

        }).catch(() => {
            const fallbackXp = (progress.stars * 10) + 2100;
            setStats({ xp: fallbackXp, streak: 1 });
        });
    }, [progress]);

    // Compute leaderboard based on selected league
    const users = useMemo(() => {
        const generated = generateMockUsers(currentLeague, 9);
        const currentUser: LeaderboardUser = {
            id: 'current',
            name: progress.username || 'You',
            xp: stats.xp,
            streak: stats.streak,
            isCurrentUser: true
        };

        let pool = generated;

        // Only inject current user into their correct or expected league to avoid weird UX
        // For demonstration, we'll put them in whatever league is selected, 
        // but maybe adjust their XP so they don't look completely out of place?
        // Actually, just inserting them exactly as they are is fine.
        pool.push(currentUser);

        return pool
            .sort((a, b) => b.xp - a.xp)
            .map((u, index) => ({ ...u, rank: index + 1 }));
    }, [currentLeague, stats, progress.username]);

    const getRankColor = (index: number) => {
        if (index === 0) return '#FFD700'; // Gold
        if (index === 1) return '#C0C0C0'; // Silver
        if (index === 2) return '#CD7F32'; // Bronze
        return '#E0E0E0';
    };

    const getLeagueColor = (league: LeagueType) => {
        if (league === 'Gold') return '#FFCA28';
        if (league === 'Silver') return '#BDBDBD';
        return '#FF8A65'; // Bronze
    };

    const getLeagueIcon = (league: LeagueType) => {
        if (league === 'Gold') return <WorkspacePremium />;
        if (league === 'Silver') return <Security />;
        return <Star />;
    };

    const handleLeagueChange = (_: React.SyntheticEvent, newValue: LeagueType) => {
        setCurrentLeague(newValue);
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FBE7', fontFamily: '"Nunito", sans-serif', pb: 10 }}>
            {/* Header */}
            <Box sx={{ background: `linear-gradient(135deg, ${getLeagueColor(currentLeague)} 0%, ${getLeagueColor(currentLeague)}dd 100%)`, color: 'white', pt: 4, pb: 0, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, mb: 4, boxShadow: `0 8px 24px ${getLeagueColor(currentLeague)}66`, position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, mb: 2 }}>
                    <IconButton onClick={() => navigate('/home')} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                        Weekly Leagues
                    </Typography>
                    <Box sx={{ width: 40 }} />
                </Box>

                <Tabs
                    value={currentLeague}
                    onChange={handleLeagueChange}
                    centered
                    TabIndicatorProps={{ style: { backgroundColor: 'white', height: 4, borderRadius: '4px 4px 0 0' } }}
                    sx={{
                        '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 800, fontSize: '1.1rem', py: 2, minWidth: '33.33%' },
                        '& .Mui-selected': { color: 'white !important' }
                    }}
                >
                    <Tab value="Bronze" label="Bronze" icon={getLeagueIcon('Bronze')} iconPosition="start" />
                    <Tab value="Silver" label="Silver" icon={getLeagueIcon('Silver')} iconPosition="start" />
                    <Tab value="Gold" label="Gold" icon={getLeagueIcon('Gold')} iconPosition="start" />
                </Tabs>
            </Box>

            {/* Top 3 Promotion Zone Indicator */}
            {currentLeague !== 'Gold' && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, mt: -1 }}>
                    <Box sx={{ borderTop: `2px dashed ${getLeagueColor(currentLeague)}`, width: '100%', position: 'absolute', zIndex: 0, opacity: 0.4 }} />
                    <Chip label="Top 3 Promote to Next League!" size="small" sx={{ bgcolor: `${getLeagueColor(currentLeague)}22`, color: getLeagueColor(currentLeague), fontWeight: 800, px: 2, zIndex: 1 }} />
                </Box>
            )}

            <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={currentLeague} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        <Stack spacing={2}>
                            {users.map((user, index) => {
                                const isTop3 = index < 3;
                                const isZonePromote = currentLeague !== 'Gold' && isTop3;
                                const rankColor = getRankColor(index);

                                return (
                                    <Paper
                                        key={user.id}
                                        elevation={user.isCurrentUser ? 10 : 0}
                                        sx={{
                                            p: 2,
                                            borderRadius: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            bgcolor: user.isCurrentUser ? 'white' : 'white',
                                            border: user.isCurrentUser ? `3px solid ${getLeagueColor(currentLeague)}` : '1px solid #E0E0E0',
                                            borderLeft: isZonePromote && !user.isCurrentUser ? `4px solid ${getLeagueColor(currentLeague)}` : user.isCurrentUser ? `4px solid ${getLeagueColor(currentLeague)}` : '1px solid #E0E0E0',
                                            boxShadow: user.isCurrentUser ? `0 8px 30px ${getLeagueColor(currentLeague)}44` : '0 2px 10px rgba(0,0,0,0.03)',
                                            transform: user.isCurrentUser ? 'scale(1.03)' : 'scale(1)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            zIndex: user.isCurrentUser ? 10 : 1
                                        }}
                                    >
                                        <Box sx={{ width: 45, textAlign: 'center' }}>
                                            {isTop3 ? (
                                                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: rankColor, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', color: index === 1 ? '#424242' : 'white', fontWeight: 900, boxShadow: `0 4px 10px ${rankColor}88`, fontSize: '1.2rem' }}>
                                                    {index + 1}
                                                </Box>
                                            ) : (
                                                <Typography sx={{ fontWeight: 900, color: '#9E9E9E', fontSize: '1.2rem' }}>{index + 1}</Typography>
                                            )}
                                        </Box>

                                        <Avatar sx={{ bgcolor: isTop3 ? rankColor + '20' : '#F5F5F5', color: isTop3 ? rankColor : '#757575', fontWeight: 900, width: 48, height: 48 }}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </Avatar>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontWeight: 800, color: user.isCurrentUser ? '#2D3748' : '#424242', fontSize: '1.1rem' }}>
                                                {user.name} {user.isCurrentUser && ' (You)'}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.9rem', color: '#757575', fontWeight: 600 }}>
                                                {user.xp} XP total
                                            </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <Typography sx={{ fontWeight: 900, color: getLeagueColor(currentLeague), fontSize: '1.3rem' }}>
                                                {user.xp} <Typography component="span" sx={{ fontSize: '0.8rem', color: '#9E9E9E' }}>XP</Typography>
                                            </Typography>
                                            {user.streak > 2 && (
                                                <Chip
                                                    icon={<Whatshot sx={{ color: '#E65100 !important', fontSize: '1.1rem' }} />}
                                                    label={`${user.streak} days`}
                                                    size="small"
                                                    sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 800, height: 24, mt: 0.5, '& .MuiChip-label': { px: 1 } }}
                                                />
                                            )}
                                        </Box>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </motion.div>
                </AnimatePresence>
            </Box>

            {/* Sticky Current User Footer (if not in top 6, could be pinned, but for now it's inline) */}
        </Box>
    );
};

export default LeaderboardPage;
