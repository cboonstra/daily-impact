import { useImpact } from '@/context/ImpactContext';

export function useDailyImpact() {
    const {
        action,
        shufflesRemaining,
        isDone,
        isLoading,
        shuffle,
        markDone,
        unmarkDone
    } = useImpact();

    return {
        action,
        shufflesRemaining,
        isDone,
        isLoading,
        shuffle,
        markDone,
        unmarkDone,
    };
}
