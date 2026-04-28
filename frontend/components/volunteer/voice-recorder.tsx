"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, Square } from "lucide-react"

// Scripted transcript chunks — simulates Gemini Live streaming the user's voice
// back as interim transcription.
const scriptedChunks = [
  "Namaste, I'm Priya.",
  "I'm in the third year of engineering at K.J. Somaiya.",
  "I know Python and a little bit of web design —",
  "built two sites for college fests.",
  "I can teach small kids math and basics of computers.",
  "I'm free most Saturdays and Sundays.",
  "I live in Andheri West, near D.N. Nagar metro.",
]

type Props = {
  onComplete: (audioData: Blob | null, fallbackText?: string) => void
}

export function VoiceRecorder({ onComplete }: Props) {
  const [state, setState] = useState<"idle" | "recording" | "done">("idle")
  const [elapsed, setElapsed] = useState(0)
  const [transcript, setTranscript] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chunkRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function start() {
    setState("recording")
    setTranscript("Listening...")
    setElapsed(0)
    
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1)
    }, 1000)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      
      mediaRecorder.start(1000) // fire dataavailable every 1000ms
    } catch (err) {
      console.warn("Mic access denied or unsupported, falling back to mock", err)
      // Fallback to exactly what the mock did
      let i = 0
      let running = ""
      setTranscript("")
      function pushChunk() {
        if (i >= scriptedChunks.length) {
          finishMock(running)
          return
        }
        running = running ? `${running} ${scriptedChunks[i]}` : scriptedChunks[i]
        setTranscript(running)
        i += 1
        chunkRef.current = setTimeout(pushChunk, 1800 + Math.random() * 700)
      }
      chunkRef.current = setTimeout(pushChunk, 900)
    }
  }

  function finishMock(finalTranscript: string) {
    if (timerRef.current) clearInterval(timerRef.current)
    if (chunkRef.current) clearTimeout(chunkRef.current)
    setState("done")
    onComplete(null, finalTranscript)
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current)
    if (chunkRef.current) clearTimeout(chunkRef.current)
    
    setState("done")
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = () => {
        const type = mediaRecorderRef.current?.mimeType || "audio/webm"
        const audioBlob = new Blob(chunksRef.current, { type })
        onComplete(audioBlob)
        // Cleanup stream tracks
        mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop())
      }
      mediaRecorderRef.current.stop()
    } else {
      onComplete(null, transcript || scriptedChunks.join(" "))
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (chunkRef.current) clearTimeout(chunkRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex h-44 w-44 items-center justify-center">
        {state === "recording" && (
          <>
            <span className="absolute h-44 w-44 animate-seva-ping rounded-full bg-primary/30" />
            <span
              className="absolute h-44 w-44 animate-seva-ping rounded-full bg-primary/20"
              style={{ animationDelay: "0.6s" }}
            />
          </>
        )}
        <button
          type="button"
          onClick={state === "recording" ? stop : start}
          disabled={state === "done"}
          className={
            "relative flex h-32 w-32 items-center justify-center rounded-full text-primary-foreground transition-transform focus:outline-none focus:ring-4 focus:ring-primary/30 " +
            (state === "recording"
              ? "scale-105 bg-accent"
              : state === "done"
                ? "bg-primary/60"
                : "bg-primary hover:scale-105")
          }
          aria-label={state === "recording" ? "Stop recording" : "Start recording"}
        >
          {state === "recording" ? (
            <Square className="h-10 w-10 fill-current" />
          ) : (
            <Mic className="h-12 w-12" />
          )}
        </button>
      </div>

      {state === "idle" && (
        <p className="max-w-md text-pretty text-center text-sm text-muted-foreground">
          Tap the microphone and speak for about 30 seconds — in any mix of
          Hindi, English, Marathi, Tamil, Telugu, or Bengali.
        </p>
      )}

      {state !== "idle" && (
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <span
                className={
                  "inline-block h-2 w-2 rounded-full " +
                  (state === "recording"
                    ? "animate-seva-pulse bg-accent"
                    : "bg-muted-foreground")
                }
              />
              {state === "recording" ? "Recording · Gemini Live" : "Transcript"}
            </span>
            <span>
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
              {String(elapsed % 60).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-3 min-h-28 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed">
            {transcript || (
              <span className="text-muted-foreground">Listening…</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
