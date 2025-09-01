import AdminLayout from "@/components/admin/admin-layout"
import LoadingSpinner from "@/components/loading-spinner"

export default function Loading() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading snippets...</p>
        </div>
      </div>
    </AdminLayout>
  )
}
