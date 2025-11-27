import { queryOptions } from "@tanstack/react-query";
import type { ApiRoute } from "@server/app";
import { hc } from 'hono/client'

import type { NewExpense } from '@server/sharedTypes';

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

const fetctAllExpense = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate network delay
  const res = await api.expense.$get()
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data;
}

export const fetchAllExpenseQueryOption = queryOptions({
  queryKey: ['get-all-expenses'],
  queryFn: fetctAllExpense,
  staleTime: 5 * 60 * 1000, // 5 minutes
})

export async function creatExpense(value: NewExpense) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const res = await api.expense.$post({ json: value });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const expense = await res.json();
  return expense
}