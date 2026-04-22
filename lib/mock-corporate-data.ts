import { CorporateUser, CSRStat, CompanyNeed, TeamEvent } from "./types"

export const currentCorporate: CorporateUser = {
  id: "corp_infosys",
  name: "Infosys CSR Board",
  company: "Infosys Limited",
  location: { label: "Electronic City, Bengaluru", lat: 12.85, lng: 77.66 },
  employeesCount: 300000,
  verified: true,
}

export const corporateStats: CSRStat[] = [
  { label: "Total Employee Hours", value: "1.2M", trend: "+15%", color: "primary" },
  { label: "Partner NGOs", value: "142", trend: "0%", color: "blue" },
  { label: "SDGs Impacted", value: "12", trend: "+2", color: "green" },
  { label: "Budget Utilization", value: "84%", trend: "+5%", color: "orange" },
]

export const companyNeeds: CompanyNeed[] = [
  {
    id: "cn_1",
    title: "Project Literacy Drive",
    partnerNgo: "Pratham Education Foundation",
    employeesRequested: 500,
    employeesJoined: 420,
    status: "active",
    deadline: "2026-05-15",
  },
  {
    id: "cn_2",
    title: "Urban Forestation Week",
    partnerNgo: "SayTrees",
    employeesRequested: 200,
    employeesJoined: 200,
    status: "filled",
    deadline: "2026-04-30",
  }
]

export const teamEvents: TeamEvent[] = [
  {
    id: "te_1",
    title: "Team Building: Food Distribution",
    dept: "Cloud Infrastructure",
    date: "2026-05-02",
    slots: 20,
    booked: 18,
  },
  {
    id: "te_2",
    title: "Code for Good: NGO Tech Support",
    dept: "Digital Engineering",
    date: "2026-05-10",
    slots: 15,
    booked: 5,
  }
]
