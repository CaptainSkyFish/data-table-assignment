import { useState, useEffect, useCallback } from 'react';
import type { PaginatorPageChangeEvent } from 'primereact/paginator';
import { getArtworks } from '../lib/api';
import type Artworks from '../types/artworks';

interface ApiResponse {
  data: Artworks[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

export const useCollection = () => {
  const [items, setItems] = useState<Artworks[]>([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows] = useState(12);
  const [totalRecords, setTotalRecords] = useState(0);

  const currentPage = Math.floor(first / rows) + 1;

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const data: ApiResponse = await getArtworks(page, rows);

      setItems(data.data);
      setTotalRecords(data.pagination.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [rows]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
  };

  return {
    items,
    loading,
    first,
    rows,
    totalRecords,
    onPageChange,
  };
};
