import { redirect } from "next/navigation"

/**
 * The old `/volunteer/signup` page was a marketing-only screen that pushed
 * users into the voice onboarding flow but never created a real account.
 * It now forwards to the unified email/password signup with the volunteer
 * tab pre-selected, so a real Firebase Auth user is provisioned.
 */
export default function VolunteerSignupRedirect() {
  redirect("/signup?role=volunteer")
}
