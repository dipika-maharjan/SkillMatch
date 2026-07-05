import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({
  user,
  title,
  description,
  actions,
  children,
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <AdminNavbar user={user} />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">Admin workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-zinc-950 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>

        {children}
      </main>
    </div>
  );
}
