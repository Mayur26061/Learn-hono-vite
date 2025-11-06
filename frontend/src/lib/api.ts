import { queryOptions } from "@tanstack/react-query";
import type { ApiRoute } from "../../../server/app";
import { hc } from 'hono/client'

const client = hc<ApiRoute>('/')
export const api = client.api;


const getCurrentUser = async () => { 
  const res = await api.me.$get()
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data;

}

export const userQueryOption = queryOptions({
    queryKey: ['get-current-user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  }) 