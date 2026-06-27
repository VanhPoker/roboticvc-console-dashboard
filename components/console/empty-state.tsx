import { InboxIcon } from "lucide-react"

export function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <InboxIcon className="size-5" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
