import {  useEffect, useState } from "react";
import type Artworks from "../types/artworks";
import { getArtworks } from "../lib/api";

export type ID = Artworks['id']; 
export type SelectionMode = 'NONE' |'FIRST_N' | 'ALL';

export function useCollection() {
  const [items, setItems] = useState<Artworks[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);

  useEffect(() => {
    fetchArtworks();
  }, [first, rows]);

  async function fetchArtworks() {
    setLoading(true);
    try {
      const page = Math.floor(first / rows) + 1;
      const res = await getArtworks(page, rows);
      setItems(res.data);
      setTotalRecords(res.pagination.total);
    } finally {
      setLoading(false);
    }
  }

    const onPageChange = (e: { first: number; rows: number }) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  return {
    items,
    loading,
    first,
    rows,
    totalRecords,
    onPageChange,
  };
}

