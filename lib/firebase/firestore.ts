import { db } from "./client"
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, addDoc } from "firebase/firestore"
import type { Volunteer, NGO, Need, Match, Incident } from "@/lib/types"

// --- Volunteers ---

export async function createVolunteer(volunteer: Volunteer) {
  const ref = doc(collection(db, "volunteers"), volunteer.id)
  await setDoc(ref, volunteer)
  return volunteer
}

export async function getVolunteer(id: string) {
  const ref = doc(db, "volunteers", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as Volunteer
}

export async function getAllVolunteers() {
  const ref = collection(db, "volunteers")
  const snap = await getDocs(ref)
  return snap.docs.map(doc => doc.data() as Volunteer)
}

// --- NGOs ---

export async function createNGO(ngo: NGO) {
  const ref = doc(collection(db, "ngos"), ngo.id)
  await setDoc(ref, ngo)
  return ngo
}

export async function getNGO(id: string) {
  const ref = doc(db, "ngos", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as NGO
}

// --- Needs ---

export async function createNeed(need: Need) {
  const ref = doc(collection(db, "needs"), need.id)
  await setDoc(ref, need)
  return need
}

export async function getNeedsByNGO(ngoId: string) {
  const ref = collection(db, "needs")
  const q = query(ref, where("ngoId", "==", ngoId))
  const snap = await getDocs(q)
  return snap.docs.map(doc => doc.data() as Need)
}

// --- Matches ---

export async function createMatch(match: Match) {
  const ref = doc(collection(db, "matches"), match.id)
  await setDoc(ref, match)
  return match
}

export async function getMatchesForVolunteer(volunteerId: string) {
  const ref = collection(db, "matches")
  const q = query(ref, where("volunteerId", "==", volunteerId))
  const snap = await getDocs(q)
  return snap.docs.map(doc => doc.data() as Match)
}

// --- Incidents ---

export async function getIncident(id: string) {
  const ref = doc(db, "incidents", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as Incident
}
