import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
// import type { AnyFieldApi } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: "0",
    },
    onSubmit: async ({ value }) => {
       await new Promise((resolve) => setTimeout(resolve, 5000))
      const res = await api.expense.$post({ json: value });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      navigate({ to: '/expenses'});
    },
  })

  return <div>
    <form className='max-w-xl m-auto' onSubmit={(ev)=> {
      ev.preventDefault();
      ev.stopPropagation();
      form.handleSubmit();
    }}>
         <form.Field
            name="title"
            children={(field)=> (
              <>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Title"/>
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
              </>
            )}
            />
         <form.Field
            name="amount"
            children={(field)=> (
              <>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Amount"/>
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                  <em>{field.state.meta.errors.join(', ')}</em>
                ) : null}
                {field.state.meta.isValidating ? 'Validating...' : null}
              </>
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
