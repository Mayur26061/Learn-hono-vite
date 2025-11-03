import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/expenses')({
  component: Expenses,
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

function Expenses() {
   const { isPending, error, data } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: fetctAllExpense,
    refetchOnWindowFocus: false,
  })

  if (error) return 'An error has occurred: ' + error.message
  return    <Table className='max-w-4xl mx-auto my-3'>
      <TableCaption>A list of your recent expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending?
        Array(3).fill(1).map((_, index) => (
          <TableRow key={index} >
            <TableCell ><Skeleton className='h-4 w-full'/></TableCell>
            <TableCell><Skeleton className='h-4 w-full'/></TableCell>
            <TableCell><Skeleton className='h-4 w-full'/></TableCell>
          </TableRow>
        ))
        : (data.expenses.map((ex) => (
          <TableRow key={ex.id}>
            <TableCell className="font-medium">{ex.id}</TableCell>
            <TableCell>{ex.title}</TableCell>
            <TableCell>{ex.amount}</TableCell>
          </TableRow>
        )))}
      </TableBody>
    </Table>
}
