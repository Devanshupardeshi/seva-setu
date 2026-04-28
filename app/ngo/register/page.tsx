import { redirect } from "next/navigation"

/**
 * The legacy /ngo/register form was a mock with no backend wiring.
 * Permanently redirect to the real Firebase-backed signup flow.
 */
export default function NgoRegisterRedirect() {
  redirect("/signup?role=ngo")
}
