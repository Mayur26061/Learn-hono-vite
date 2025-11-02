import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Index,
})

const fetctTotal = async () => { 
  const res = await api.expense.total.$get()
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data;

}

function Index() {
  // const [totalExpense, setTotalExpense] = useState<number>(0);
   const { isPending, error, data } = useQuery({
    queryKey: ['get-total-spent'],
    queryFn: fetctTotal
  })
  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  // useEffect(() => {
  //   async function fetTotalExpense() {
  //     const result = await api.expense.total.$get()
  //     const data = await result.json();
  //     setTotalExpense(data.total);
  //     // console.log(data)
  //     // const res = await fetch('/api/expense/total');
  //     // const data  = await res.json();
  //     // setTotalExpense(data);
  //   }
  //   fetTotalExpense();
  // }, []);

  return (
    <>
       <Card className="w-full max-w-sm m-auto">
        <CardHeader>
          <CardTitle>Total Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data.total}</p>
        </CardContent>
      </Card>
    </>
  )
}
