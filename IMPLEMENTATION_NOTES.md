# Data Table Selection Implementation Notes

## Overview
This document describes the implementation of a multi-page data table with persistent row selection, bulk selection capabilities, and PrimeReact DataTable integration.

## Architecture

### Components
- `App.tsx` - Main application component
- `CollectionTable.tsx` - PrimeReact DataTable wrapper
- `SelectionOverlay.tsx` - Dropdown for bulk row selection
- `useCollection.ts` - Data fetching hook
- `useRowSelection.ts` - Selection state management hook

### State Management Strategy

**PrimeReact Handles:**
- `selection` - Current page selection state (local to CollectionTable)
- DataTable checkbox UI rendering
- Selection persistence within current page

**Custom Hooks Track:**
- `allSelectedIds` - Set of ALL selected IDs across all pages
- `explicitlyDeselectedIds` - Items deselected in bulk mode
- `selectFirstN` - Bulk selection count (0 = explicit mode)
- `selectedCount` - Computed display count

## Key Changes Made

### 1. Decoupled Selection from PrimeReact (Critical)

**Problem:** Earlier attempts to sync custom selection state with PrimeReact's internal state caused flickering and race conditions.

**Solution:** 
- PrimeReact manages its own `selection` state for current page only
- Custom hooks track all selections internally
- Communication happens via callbacks only

**Files Modified:**
- `useCollection.ts` - Removed `selection` and `setSelection` exports
- `CollectionTable.tsx` - Added local selection state with useEffect for bulk mode
- `useRowSelection.ts` - Removed `selection` state, only tracks IDs

### 2. Bulk Selection with Auto-Page Selection

**Problem:** User wants to select N rows across all pages without prefetching.

**Solution:** 
- `selectFirstN` stores the target count
- `handlePageChange` calculates which items to auto-select on each page
- `explicitlyDeselectedIds` tracks exceptions in bulk mode

**Formula:** `itemsToSelect = Math.min(rowsPerPage, selectFirstN - (newPage * rowsPerPage))`

### 3. Fix for Flickering Checkmarks

**Problem:** Checkmarks appeared briefly then disappeared on page navigation.

**Solution:** 
- useEffect in CollectionTable watches `selectFirstN` and `selectedCount`
- Triggers only when values increase (not on every render)
- Uses refs to track previous values

```typescript
useEffect(() => {
  if (selectFirstN && selectFirstN > prevSelectFirstNRef.current) {
    const itemsToSelect = items.slice(0, Math.min(selectFirstN, items.length));
    setSelection(itemsToSelect);
  } else if (selectedCount === 0 && prevSelectedCountRef.current > 0) {
    setSelection([]);
  }
  prevSelectFirstNRef.current = selectFirstN || 0;
  prevSelectedCountRef.current = selectedCount || 0;
}, [selectFirstN, selectedCount, items]);
```

### 4. Deselection in Bulk Mode

**Problem:** User couldn't deselect individual items in bulk mode; count wouldn't update.

**Solution:** 
- Added `explicitlyDeselectedIds` Set to track exceptions
- `selectedCount = selectFirstN - explicitlyDeselectedIds.size`
- When user deselects: add to `explicitlyDeselectedIds`
- When user re-selects: remove from `explicitlyDeselectedIds`

## Data Flow Diagrams

### Normal Selection Flow
```
User clicks checkbox
         ↓
PrimeReact onSelectionChange fires
         ↓
handleSelectionChange updates allSelectedIds/explicitlyDeselectedIds
         ↓
selectedCount computed
         ↓
UI displays updated count
```

### Bulk Selection Flow
```
User enters "300" and clicks Select
         ↓
selectFirstN = 300
         ↓
useEffect triggers in CollectionTable
         ↓
Current page items auto-selected
         ↓
User navigates to page 2
         ↓
handlePageChange calculates items to select
         ↓
New page items auto-selected
         ↓
Continue until 300 items selected or end of data
```

### Deselection in Bulk Mode
```
User deselects 1 item
         ↓
handleSelectionChange detects item not in newSelection
         ↓
Add item ID to explicitlyDeselectedIds
         ↓
selectedCount = 300 - 1 = 299
         ↓
UI displays 299
```

## Known Limitations

1. **Navigation during bulk selection:** If user navigates away and back, selection is maintained in `allSelectedIds` but PrimeReact's `selection` resets. This is intentional - PrimeReact only tracks current page.

2. **Performance:** Using Sets for IDs is O(1) for add/has/delete, but converting to arrays for PrimeReact is O(n). Acceptable for typical page sizes (12-100 rows).

3. **No server-side selection persistence:** Selection state is client-only. Refreshing the page clears selection.

## Files and Their Responsibilities

### useRowSelection.ts
- Manages all selection state
- Exports: `handleSelectionChange`, `selectRows`, `clearSelection`, `handlePageChange`, `selectedCount`, `selectFirstN`, `allSelectedIds`, `explicitlyDeselectedIds`

### useCollection.ts
- Fetches data from API
- Manages pagination state
- Passes items to selection hooks
- Does NOT manage selection state (delegated to useRowSelection)

### CollectionTable.tsx
- Local `selection` state for PrimeReact
- useEffect to sync bulk selection to DataTable
- Receives `selectFirstN` prop for bulk mode detection

### App.tsx
- Orchestrates hooks and components
- Passes callbacks between layers
- No selection state of its own

## Testing Scenarios

### Working
- [x] Select individual rows on single page
- [x] Select rows across multiple pages (selection persists)
- [x] Deselect individual rows (count updates)
- [x] Bulk select N rows (auto-selects current page)
- [x] Navigate pages during bulk selection
- [x] Clear all selection
- [x] Count displays correctly in all modes

### Potential Edge Cases
- [ ] User rapidly clicks checkbox during bulk selection
- [ ] Network error during page fetch
- [ ] Selecting more items than available in dataset

## Future Improvements

1. **Server-side selection:** For very large datasets, track selection server-side
2. **Selection persistence:** Save selection to localStorage for page refresh
3. **Virtual scrolling:** For datasets > 10000 rows
4. **Export selected:** Add functionality to export selected items

## Debugging Tips

### Checkmarks not appearing
- Verify `selectFirstN` is being passed to CollectionTable
- Check `prevSelectFirstNRef` is updating correctly
- Ensure useEffect dependencies include `items`

### Count wrong
- Check `explicitlyDeselectedIds.size`
- Verify `selectedCount` formula: `selectFirstN - explicitlyDeselectedIds.size`
- Ensure `clearSelection` resets both Sets

### Flickering on page navigation
- PrimeReact resets selection when `value` changes
- Our useEffect should only trigger on `selectFirstN` changes, not on every page load
- Check that refs are being used to compare previous values

## API Reference

### useRowSelection()

**Returns:**
```typescript
{
  selectFirstN: number;              // 0 = explicit mode, >0 = bulk mode
  allSelectedIds: Set<number>;       // All selected IDs
  explicitlyDeselectedIds: Set<number>; // Deselected in bulk mode
  handleSelectionChange: (newSelection: Artworks[]) => void;
  selectRows: (count: number, items: Artworks[]) => void;
  clearSelection: () => void;
  handlePageChange: (first: number, rows: number, items: Artworks[]) => Artworks[];
  selectedCount: number;
}
```

### CollectionTable Props
```typescript
{
  items: Artworks[];
  loading: boolean;
  onSelectionChange: (selection: Artworks[]) => void;
  selectRows: (count: number) => void;
  clearSelection: () => void;
  selectedCount?: number;
  selectFirstN?: number;
}
```
