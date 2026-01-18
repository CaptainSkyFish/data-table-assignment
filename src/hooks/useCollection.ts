import { useEffect, useState } from "react";
import type Artworks from "../types/artworks";
import { getArtworks } from "../lib/api";

export function useCollection() {
  const [items, setItems] = useState<Artworks[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [selectedItems, setSelectedItems] = useState<Artworks[]>([]);
  const [rowClick, setRowClick] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, [first, rows]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const page = Math.floor(first / rows) + 1;
      const res = await getArtworks(page, rows);
      setItems(res.data);
      setTotalRecords(res.pagination.total);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (e: { first: number; rows: number }) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const selectRows = (count: number) => {
    const rowsToAdd = items.slice(0, Math.min(count, items.length));
    setSelectedItems(rowsToAdd);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return { items, loading, first, rows, totalRecords, setFirst, setRows, onPageChange, selectRows, clearSelection, rowClick, selectedItems, setRowClick, setSelectedItems };
}
