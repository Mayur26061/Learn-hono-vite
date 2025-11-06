import { userQueryOption } from '@/lib/api'
import { createFileRoute, Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOption);
      return data;
    } catch {
      return { user: null }
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  if (!user) {
    return <div>Please log in to access this page. <a href="/api/login">Login</a></div>
  }
  return <div>
    <Outlet />
  </div>
}
