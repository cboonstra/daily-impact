import { useImpact } from '@/context/ImpactContext';

export function useImpactHistory() {
    const {
        history,
        isLoading,
        refreshHistory,
        getStats
    } = useImpact();

    return {
        history,
        isLoading,
        refreshHistory,
        getStats,
        // legacy compatibility
        toggleDay: async () => { console.warn('toggleDay is deprecated, use markDone/unmarkDone'); }
    };
}
