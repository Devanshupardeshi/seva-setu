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
 * Subscribe to a Firestore collection. In Demo Mode, or when Firebase is not
 * configured, the hook simply returns the provided initialData and stays idle.
 */
export function useCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  initialData: T[] = [],
) {
  const { mode } = useMode()
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Stable key for re-running effect when constraints semantically change.
  const constraintKey = useMemo(() => {
    try {
      return JSON.stringify(constraints.map((c) => (c as unknown as { _op?: string })._op ?? ""))
    } catch {
      return String(constraints.length)
    }
  }, [constraints])

  useEffect(() => {
    if (mode !== "actual") {
      setData(initialData)
      setLoading(false)
      setError(null)
      return
    }

    const db = getDb()
    if (!db) {
      setError(new Error("Firestore is not configured"))
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

  return { data, loading, error }
}

export function useDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  initialData: T | null = null,
) {
  const { mode } = useMode()
  const [data, setData] = useState<T | null>(initialData)
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

    const db = getDb()
    if (!db) {
      setError(new Error("Firestore is not configured"))
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

  return { data, loading, error }
}
