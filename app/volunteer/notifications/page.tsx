"use client"

import { Bell, Inbox, Trash2 } from "lucide-react"
import { VolunteerShell } from "@/components/app-shell/volunteer-shell"
import { currentVolunteer } from "@/lib/mock-data"
import { useCollection } from "@/hooks/use-firestore"
import { where, orderBy, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export default function NotificationsPage() {
  const { data: notifications, loading } = useCollection<any>(
    `volunteers/${currentVolunteer.id}/notifications`,
    [orderBy("timestamp", "desc")]
  )

  const clearNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, `volunteers/${currentVolunteer.id}/notifications`, id))
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }

  return (
    <VolunteerShell
      userName={currentVolunteer.name}
      userLocation={currentVolunteer.location.label}
    >
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-tight">Notifications</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time alerts and mobilization updates.
            </p>
          </div>
          <Bell className="h-6 w-6 text-primary/40" />
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground animate-pulse">Syncing with SevaSetu...</p>
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-medium">All caught up!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                When a crisis strikes, your mobilization alerts will appear here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id}
                className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                      {n.type || "Alert"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {n.timestamp ? formatDistanceToNow(new Date(n.timestamp), { addSuffix: true }) : "just now"}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-medium leading-tight">{n.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                </div>

                <div className="flex items-center justify-end border-t border-border/50 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => clearNotification(n.id)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Dismiss
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </VolunteerShell>
  )
}
