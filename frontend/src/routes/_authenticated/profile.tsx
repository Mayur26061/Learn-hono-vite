import { createFileRoute } from '@tanstack/react-router'
import { userQueryOption } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})



function Profile() {
   const { isPending, error, data } = useQuery(userQueryOption)
  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <div>Hello {data.user.family_name}</div>
      <div>You can logout with <a href="/api/logout">Logout</a></div>
    </>
  )
}
