"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosRequestConfig, Method } from "axios";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type UseFetchConfig = {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  immediate?: boolean;
  axiosConfig?: AxiosRequestConfig;
};

type RefetchOptionsType = {
  refetchData?: any | null;
  refetchParams?: any | null;
};

export function useFetch<T = any>({
  url,
  method = "get",
  data,
  params,
  headers,
  immediate = true,
  axiosConfig = {},
}: UseFetchConfig) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (
      {
        refetchData = null,
        refetchParams = null,
      }: RefetchOptionsType = {} as RefetchOptionsType
    ) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await axios.request<T>({
          url,
          method,
          data: refetchData || data,
          params: refetchParams || params,
          headers,
          signal: controller.signal,
          ...axiosConfig,
        });

        setState({ data: response.data, loading: false, error: null });
      } catch (err: any) {
        setState({
          data: null,
          loading: false,
          error: err?.response?.data?.message || err.message || "Unknown error",
        });
      } finally {
        setState((prev) => ({ ...prev, loading: false, error: null }));
      }
    },
    []
  );

  useEffect(() => {
    if (immediate) fetchData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData, immediate]);

  return {
    ...state,
    refetch: fetchData,
    setState,
  };
}
