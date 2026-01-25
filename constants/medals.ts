export interface Medal {
    id: string;
    title: string;
    description: string;
    icon: string;
    requirement: number;
    type: 'streak' | 'total' | 'sdgs';
    color: string;
}

export const MEDALS: Medal[] = [
    {
        id: 'first-impact',
        title: 'First Impact',
        description: 'Completed your very first daily action.',
        icon: 'star',
        requirement: 1,
        type: 'total',
        color: '#FFD700',
    },
    {
        id: 'streak-3',
        title: 'Consistency Starter',
        description: 'Maintained a 3-day action streak.',
        icon: 'flame',
        requirement: 3,
        type: 'streak',
        color: '#FF9500',
    },
    {
        id: 'streak-7',
        title: 'Week of Impact',
        description: 'Completed actions for 7 consecutive days.',
        icon: 'calendar',
        requirement: 7,
        type: 'streak',
        color: '#5856D6',
    },
    {
        id: 'sdg-explorer',
        title: 'SDG Explorer',
        description: 'Completed actions for 5 different SDGs.',
        icon: 'compass',
        requirement: 5,
        type: 'sdgs',
        color: '#3F7E44',
    },
    {
        id: 'sdg-master',
        title: 'Global Hero',
        description: 'Completed actions for all 17 SDGs.',
        icon: 'earth',
        requirement: 17,
        type: 'sdgs',
        color: '#007AFF',
    },
    {
        id: 'total-30',
        title: 'Monthly Impact',
        description: 'Completed 30 daily actions in total.',
        icon: 'medal',
        requirement: 30,
        type: 'total',
        color: '#FF2D55',
    },
];
