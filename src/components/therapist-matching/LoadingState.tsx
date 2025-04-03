export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <h3 className="mt-4 text-lg font-medium">Processing Patient Documents</h3>
      <p className="mt-2 text-sm text-muted-foreground">Please wait while we analyze the uploaded files...</p>
    </div>
  )
} 