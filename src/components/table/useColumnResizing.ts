import { useState, useEffect, useCallback, useRef } from 'react';

type ColumnWidths = Record<string, number>;

// columns prop should be visible columns
export const useColumnResizing = (tableId: string | undefined, visibleColumns: { key: string }[]) => {
    const [widths, setWidths] = useState<ColumnWidths>({});

    // Track previous visible columns to detect changes
    const prevVisibleRef = useRef<{ key: string }[]>(visibleColumns);

    // Load from local storage on mount
    useEffect(() => {
        if (!tableId) return;
        const key = `table-widths-${tableId}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                setWidths(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse table widths', e);
            }
        }
    }, [tableId]);

    // Handle Visibility Changes
    useEffect(() => {
        // Logic:
        // If removed(X), find neighbor and add X's width to it.
        // If added(X), find neighbor and subtract X's width from it.
        // Limitation: X must have a width in state.

        const prev = prevVisibleRef.current;
        const current = visibleColumns;

        // We only run this if we have some widths defined (custom layout active)
        if (Object.keys(widths).length === 0) {
            prevVisibleRef.current = current;
            return;
        }

        // Check for Removed
        const removed = prev.find(p => !current.find(c => c.key === p.key));
        if (removed) {
            const removedWidth = widths[removed.key];
            if (removedWidth) {
                // Find neighbor in PREV list
                const idx = prev.findIndex(p => p.key === removed.key);
                let neighborKey: string | null = null;

                // Prefer Previous Neighbor (idx - 1), else Next (idx + 1)
                if (idx > 0) neighborKey = prev[idx - 1].key;
                else if (idx < prev.length - 1) neighborKey = prev[idx + 1].key;

                if (neighborKey) {
                    setWidths(prevW => ({
                        ...prevW,
                        [neighborKey!]: (prevW[neighborKey!] || 0) + removedWidth
                        // We do NOT delete removed key, so we can restore it later
                    }));
                }
            }
        }

        // Check for Added
        const added = current.find(c => !prev.find(p => p.key === c.key));
        if (added) {
            const addedWidth = widths[added.key];
            if (addedWidth) {
                // Find neighbor in CURRENT list
                const idx = current.findIndex(c => c.key === added.key);
                let neighborKey: string | null = null;

                // Logic must mirror removal: 
                // if we gave to Previous (idx-1), we take from Previous.
                // But wait, indices act differently on insert.

                // If added at 0: we probably gave to Next (old 0) when it was removed? 
                // No, if removed at 0, we gave to Next.
                // So if added at 0, we take from Next (current 1).
                if (idx === 0) {
                    if (current.length > 1) neighborKey = current[1].key;
                } else {
                    // If added > 0, we probably gave to Previous (idx-1).
                    neighborKey = current[idx - 1].key;
                }

                if (neighborKey) {
                    setWidths(prevW => ({
                        ...prevW,
                        [neighborKey!]: (prevW[neighborKey!] || 0) - addedWidth
                    }));
                }
            }
        }

        prevVisibleRef.current = current;
    }, [visibleColumns, widths]);

    // Debounced save
    useEffect(() => {
        if (!tableId || Object.keys(widths).length === 0) return;
        const handler = setTimeout(() => {
            localStorage.setItem(`table-widths-${tableId}`, JSON.stringify(widths));
        }, 1000);
        return () => clearTimeout(handler);
    }, [widths, tableId]);

    const resizingState = useRef<{
        startX: number;
        leftColKey: string;
        rightColKey: string;
        startLeftWidth: number;
        startRightWidth: number;
    } | null>(null);

    const startResize = useCallback((leftColKey: string, rightColKey: string, e: React.MouseEvent) => {
        e.preventDefault();
        const table = (e.target as HTMLElement).closest('table');
        if (!table) return;

        // Freeze logic: Capture ALL current widths to lock the table
        const allThs = Array.from(table.querySelectorAll('thead th[data-key]')) as HTMLElement[];
        const currentWidthsSnapshot: ColumnWidths = {};

        allThs.forEach(th => {
            const key = th.getAttribute('data-key');
            if (key) {
                currentWidthsSnapshot[key] = th.getBoundingClientRect().width;
            }
        });

        setWidths(prev => ({ ...prev, ...currentWidthsSnapshot }));

        resizingState.current = {
            startX: e.clientX,
            leftColKey,
            rightColKey,
            startLeftWidth: currentWidthsSnapshot[leftColKey],
            startRightWidth: currentWidthsSnapshot[rightColKey]
        };

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!resizingState.current) return;
        const { startX, leftColKey, rightColKey, startLeftWidth, startRightWidth } = resizingState.current;

        const delta = e.clientX - startX;

        let newLeftWidth = startLeftWidth + delta;
        let newRightWidth = startRightWidth - delta;

        const leftTh = document.querySelector(`th[data-key="${leftColKey}"]`);
        const rightTh = document.querySelector(`th[data-key="${rightColKey}"]`);

        let minLeft = 50;
        let minRight = 50;

        if (leftTh) {
            const textSpan = leftTh.querySelector('.th-content');
            if (textSpan) minLeft = textSpan.getBoundingClientRect().width + 25;
        }
        if (rightTh) {
            const textSpan = rightTh.querySelector('.th-content');
            if (textSpan) minRight = textSpan.getBoundingClientRect().width + 25;
        }

        if (newLeftWidth < minLeft) {
            const correction = minLeft - newLeftWidth;
            newLeftWidth = minLeft;
            newRightWidth -= correction;
        }

        if (newRightWidth < minRight) {
            const correction = minRight - newRightWidth;
            newRightWidth = minRight;
            newLeftWidth -= correction;
        }

        setWidths(prev => ({
            ...prev,
            [leftColKey]: newLeftWidth,
            [rightColKey]: newRightWidth
        }));
    }, []);

    const handleMouseUp = useCallback(() => {
        resizingState.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    return { widths, startResize };
};
