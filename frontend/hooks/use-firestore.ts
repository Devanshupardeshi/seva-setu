"use client"

import { useState, useEffect, useMemo } from "react"
import {
  collection,
  query,
  onSnapshot,
  type QueryConstraint,
  doc,
  type DocumentData,
} from "firebase/firestore"
import { getDb } from "@/lib/firebase/client"
import { useMode } from "@/frontend/lib/mode/mode-context"

/**
 * Subscribe to a Firestore collection.
 *
 * Behaviour by mode:
 *   - Demo Mode    → returns `initialData` (your mock fixture). Never touches Firestore.
 *   - Actual Mode  → returns the live snapshot. Starts empty (`[]`) and is replaced
 *                    by the live result once the snapshot fires. **Never** falls back
 *                    to `initialData`, so an empty collection stays empty.
 *
 * `loading` is true while the first Actual-mode snapshot is in-flight.
 */
export function useCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  initialData: T[] = [],
) {
  const { mode, hydrated } = useMode()
  const isActual = hydrated && mode === "actual"

  const [data, setData] = useState<T[]>(isActual ? [] : initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Stable key for re-running effect when constraints semantically change.
  const constraintKey = useMemo(() => {
    try {
      return JSON.stringify(
        constraints.map((c) => (c as unknown as { _op?: string })._op ?? ""),
      )
    } catch {
      return String(constraints.length)
    }
  }, [constraints])

  useEffect(() => {
    // Demo mode (or pre-hydration) → mock fixture, no Firestore I/O.
    if (mode !== "actual") {
      setData(initialData)
      setLoading(false)
      setError(null)
      return
    }

    // Actual mode: start empty, then let the snapshot fill it in.
    setData([])

    const db = getDb()
    if (!db) {
      setError(
        new Error(
          "Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars to enable live data.",
        ),
      )
      setLoading(false)
      return
    }

    setLoading(true)
    const ref = collection(db, collectionName)
    const q = query(ref, ...constraints)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as T[]
        setData(docs)
        setLoading(false)
      },
      (err) => {
        console.error(`[useCollection] ${collectionName}:`, err)
        setError(err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, constraintKey, mode])

  return { data, loading, error, isActual }
}

/**
 * Subscribe to a single Firestore document.
 *
 * Same mode contract as `useCollection`: demo returns `initialData`, actual
 * starts as `null` until the snapshot resolves. Never falls back to the mock
 * once we are in actual mode.
 */
export function useDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  initialData: T | null = null,
) {
  const { mode, hydrated } = useMode()
  const isActual = hydrated && mode === "actual"

  const [data, setData] = useState<T | null>(isActual ? null : initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!docId) return

    if (mode !== "actual") {
      setData(initialData)
      setLoading(false)
      setError(null)
      return
    }

    // Actual mode: start blank, fill from snapshot.
    setData(null)

    const db = getDb()
    if (!db) {
      setError(
        new Error(
          "Firestore is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars to enable live data.",
        ),
      )
      setLoading(false)
      return
    }

    setLoading(true)
    const ref = doc(db, collectionName, docId)
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setData(snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null)
        setLoading(false)
      },
      (err) => {
        console.error(`[useDocument] ${collectionName}/${docId}:`, err)
        setError(err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, docId, mode])

  return { data, loading, error, isActual }
}
