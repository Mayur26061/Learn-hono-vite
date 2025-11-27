import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from "@/components/ui/calendar"
import { creatExpense, fetchAllExpenseQueryOption } from '@/lib/api';
import { expenseSchema } from '@server/sharedTypes';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existing = await queryClient.ensureQueryData(fetchAllExpenseQueryOption)
      navigate({ to: '/expenses'});
      // 
      const expense = await creatExpense(value);
      queryClient.setQueryData(fetchAllExpenseQueryOption.queryKey, {
        expenses: [expense, ...existing.expenses],
      });
    },
  })

return <div>
    <form className='max-w-xl mx-auto my-5 flex flex-col gap-y-4' onSubmit={(ev)=> {
      ev.preventDefault();
      ev.stopPropagation();
      form.handleSubmit();
    }}>
         <form.Field
            name="title"
            validators={{
              onChange: expenseSchema.shape.title
            }}
            children={(field)=> (
              <div>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                className='mt-5 mb-3'
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Title"/>
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors[0]?.message}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
              </div>
            )}
            />
         <form.Field
            name="amount"
            validators={{
              onChange: expenseSchema.shape.amount
            }}
            children={(field)=> (
              <div>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  id={field.name}
                  className='mt-5 mb-3'
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Amount"/>
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                  <em>{field.state.meta.errors[0]?.message}</em>
                ) : null}
                {field.state.meta.isValidating ? 'Validating...' : null}
              </div>
            )}
            />
            <form.Field
            name="date"
            children={(field)=> (
              <div className='self-center'>
                 <Calendar
                  mode="single"
                  selected={new Date(field.state.value)}
                  onSelect={(date) => field.handleChange((date ?? new Date()).toISOString() )}
                  className="rounded-lg border"
                />
              </div>
            )}
            />
             <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
    </form>
  </div>
}
