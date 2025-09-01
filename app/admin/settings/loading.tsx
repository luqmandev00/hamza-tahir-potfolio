import AdminLayout from "@/components/admin/admin-layout"

export default function SettingsLoading() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>

        <div className="space-y-4">
          <div className="h-12 w-full bg-muted animate-pulse rounded" />
          <div className="h-96 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </AdminLayout>
  )
}
