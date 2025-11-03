import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
        <Navbar />
              <hr />
      <Outlet />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  )
}

function Navbar() {
    return   <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
                <Link
          to="/expenses"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Expenses
        </Link>
        <Link
          to="/create-expense"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Create
        </Link>
      </div>
    </>
}