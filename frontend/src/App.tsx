import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {
  const [totalExpense, setTotalExpense] = useState<number>(0);

  useEffect(() => {
    async function fetTotalExpense() {
      const res = await fetch('/api/expense/total');
      const data  = await res.json();
      setTotalExpense(data.total);
    }
    fetTotalExpense();
  }, []);

  return (
    <>
       <Card className="w-full max-w-sm m-auto">
        <CardHeader>
          <CardTitle>Total Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{totalExpense}</p>
        </CardContent>
      </Card>
    </>
  )
}

export default App
