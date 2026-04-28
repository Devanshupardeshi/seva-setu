"use client"

import { Award, Download, Share2, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CertificateCard({ 
  volunteerName, 
  ngoName, 
  taskTitle, 
  date, 
  hours,
  certificateId
}: { 
  volunteerName: string
  ngoName: string
  taskTitle: string
  date: string
  hours: number
  certificateId: string
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-[12px] border-primary/5 bg-card p-1">
      <div className="relative rounded-[1.5rem] border border-primary/20 bg-card p-8 md:p-12">
        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Award className="h-10 w-10" />
          </div>
          
          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Certificate of Impact
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
              {volunteerName}
            </h1>
          </div>
          
          <div className="mt-8 max-w-lg">
            <p className="text-lg leading-relaxed text-muted-foreground">
              This certificate is awarded in recognition of your dedicated service with <span className="font-serif font-medium text-foreground italic">{ngoName}</span>. 
              By completing the task <span className="font-medium text-foreground">"{taskTitle}"</span>, you have contributed <span className="font-serif text-2xl font-bold text-primary">{hours} hours</span> of meaningful work to our community.
            </p>
          </div>
          
          <div className="mt-12 grid w-full grid-cols-2 gap-8 border-t border-border pt-12 text-left">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Issued on</p>
              <p className="mt-1 font-serif text-xl">{date}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Verification ID</p>
              <p className="mt-1 font-mono text-xs text-foreground uppercase tracking-wider">{certificateId}</p>
            </div>
          </div>
          
          <div className="mt-12 flex items-center gap-6 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <p className="text-[10px] font-medium uppercase tracking-widest">Verified NGO</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Star className="h-6 w-6 text-primary" />
              <p className="text-[10px] font-medium uppercase tracking-widest">SevaSetu Impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
