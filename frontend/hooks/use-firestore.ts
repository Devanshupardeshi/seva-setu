"use client"

import { useState, useEffect } from "react"
import { 
  collection, 
  query, 
  onSnapshot, 
  QueryConstraint, 
  doc,
  DocumentData,
  onSnapshot as onDocSnapshot
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"

export function useCollection<T = DocumentData>(
  collectionName: string, 
  constraints: QueryConstraint[] = [],
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const ref = collection(db, collectionName)
    const q = query(ref, ...constraints)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[]
        setData(docs)
        setLoading(false)
      },
      (err) => {
        console.error(`Firestore subscription error (${collectionName}):`, err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, JSON.stringify(constraints)])

  return { data, loading, error }
}

export function useDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  initialData: T | null = null
) {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!docId) return

    const ref = doc(db, collectionName, docId)
    const unsubscribe = onDocSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setData({ id: snap.id, ...snap.data() } as T)
        } else {
          setData(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error(`Firestore doc subscription error (${collectionName}/${docId}):`, err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  return { data, loading, error }
}
