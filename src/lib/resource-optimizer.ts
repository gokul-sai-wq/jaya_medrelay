"use client"

// HEALTH 04: Intelligent Hospital Resource Allocation System
// Algorithmic optimization engine for Beds, Departments, Staff availability, and Patient priorities.

export type BedInfo = {
  id: string
  bedNumber: string
  status: "available" | "occupied" | "reserved" | "reallocated"
  patientId?: string
  patientName?: string
  priority?: "Critical" | "Emergent" | "Urgent" | "Routine"
  ventilatorEquipped?: boolean
  oxygenEquipped?: boolean
  allocatedAt?: string
}

export type Ward = {
  id: string
  name: string
  department: "Emergency" | "ICU" | "General Medicine" | "Surgery" | "Pediatrics" | "Obstetrics"
  capacity: number
  occupied: number
  critical: boolean
  beds: BedInfo[]
}

export type StaffMember = {
  id: string
  name: string
  role: "ER Physician" | "Surgeon" | "Cardiologist" | "Critical Care Nurse" | "Triage Nurse" | "Ambulance Paramedic" | "Anesthesiologist"
  department: string
  status: "On Duty" | "Available" | "In Surgery" | "Dispatched" | "On Call" | "Redeployed"
  location: string
  phone: string
  burnoutScore: number // 0 to 100
  assignedPatients: number
  originalDept?: string
}

export type DepartmentWorkload = {
  name: string
  loadPercentage: number
  activePatients: number
  queueDepth: number
  avgWaitMinutes: number
  status: "Optimal" | "Moderate" | "Overloaded" | "Surge"
}

export type ResourceConflict = {
  id: string
  title: string
  severity: "Critical" | "High" | "Medium"
  category: "Bed Deficit" | "Staff Deficit" | "OR Bottleneck" | "SLA Wait-Time Breach"
  description: string
  impact: string
  timestamp: string
}

export type AllocationStrategy = {
  id: string
  title: string
  actions: string[]
  projectedWaitMinutes: number
  projectedConflicts: number
  bedReallocations: {
    fromWard: string
    toWard: string
    bedCount: number
    type: "ventilator_conversion" | "step_down_transfer" | "ward_overflow"
    reason: string
  }[]
  staffRedeployments: {
    staffId: string
    staffName: string
    fromDept: string
    toDept: string
    roleAction: string
  }[]
  networkOffload?: {
    targetFacility: string
    patientCount: number
    careType: string
  }
}

export type OptimizationMetrics = {
  overallEfficiency: number
  avgWaitMinutes: number
  baselineWaitMinutes: number
  bedOccupancyRate: number
  staffUtilizationRate: number
  activeConflictsCount: number
  isOptimized: boolean
  lastOptimizedAt?: string
  appliedStrategyTitle?: string
}

export type HospitalResourceState = {
  wards: Ward[]
  staff: StaffMember[]
  departments: DepartmentWorkload[]
  conflicts: ResourceConflict[]
  recommendedStrategy: AllocationStrategy | null
  metrics: OptimizationMetrics
  activeSurgeScenario?: string | null
}

const STORAGE_KEY = "medrelay.hospital_resources_v2"
const AUDIT_LOGS_KEY = "medrelay.resource_audit_logs"

// Baseline Default State
export function getInitialHospitalState(): HospitalResourceState {
  const wards: Ward[] = [
    {
      id: "ward-icu",
      name: "Intensive Care Unit (ICU)",
      department: "ICU",
      capacity: 20,
      occupied: 18,
      critical: true,
      beds: Array(20).fill(0).map((_, i) => ({
        id: `icu-b${i + 1}`,
        bedNumber: `ICU-${100 + i + 1}`,
        status: i < 18 ? "occupied" : "available",
        ventilatorEquipped: true,
        oxygenEquipped: true,
        patientName: i < 18 ? `Patient PT-ICU-${i + 1}` : undefined,
        priority: i < 6 ? "Critical" : "Emergent"
      }))
    },
    {
      id: "ward-emergency",
      name: "Emergency & Trauma Casualty",
      department: "Emergency",
      capacity: 30,
      occupied: 22,
      critical: false,
      beds: Array(30).fill(0).map((_, i) => ({
        id: `emg-b${i + 1}`,
        bedNumber: `ER-${200 + i + 1}`,
        status: i < 22 ? "occupied" : "available",
        ventilatorEquipped: i < 6,
        oxygenEquipped: true,
        patientName: i < 22 ? `Patient PT-ER-${i + 1}` : undefined,
        priority: i < 8 ? "Critical" : "Emergent"
      }))
    },
    {
      id: "ward-surgery",
      name: "Surgical Recovery & HDU",
      department: "Surgery",
      capacity: 25,
      occupied: 19,
      critical: false,
      beds: Array(25).fill(0).map((_, i) => ({
        id: `surg-b${i + 1}`,
        bedNumber: `SURG-${300 + i + 1}`,
        status: i < 19 ? "occupied" : "available",
        ventilatorEquipped: i < 4,
        oxygenEquipped: true,
        patientName: i < 19 ? `Patient PT-SURG-${i + 1}` : undefined,
        priority: "Urgent"
      }))
    },
    {
      id: "ward-medicine",
      name: "General Medicine A & Step-Down",
      department: "General Medicine",
      capacity: 40,
      occupied: 32,
      critical: false,
      beds: Array(40).fill(0).map((_, i) => ({
        id: `med-b${i + 1}`,
        bedNumber: `GEN-${400 + i + 1}`,
        status: i < 32 ? "occupied" : "available",
        ventilatorEquipped: false,
        oxygenEquipped: i < 25,
        patientName: i < 32 ? `Patient PT-GEN-${i + 1}` : undefined,
        priority: "Routine"
      }))
    },
    {
      id: "ward-pediatrics",
      name: "Pediatrics & Neonatal Care",
      department: "Pediatrics",
      capacity: 25,
      occupied: 12,
      critical: false,
      beds: Array(25).fill(0).map((_, i) => ({
        id: `peds-b${i + 1}`,
        bedNumber: `PED-${500 + i + 1}`,
        status: i < 12 ? "occupied" : "available",
        ventilatorEquipped: i < 3,
        oxygenEquipped: true,
        patientName: i < 12 ? `Child PT-PED-${i + 1}` : undefined,
        priority: "Routine"
      }))
    }
  ]

  const staff: StaffMember[] = [
    { id: "EMP-001", name: "Dr. Sarah Jenkins", role: "ER Physician", department: "Emergency Ward", status: "On Duty", location: "Emergency Casualty", phone: "555-0101", burnoutScore: 68, assignedPatients: 9 },
    { id: "EMP-002", name: "Paramedic Unit 4", role: "Ambulance Paramedic", department: "Ambulance Bay", status: "Dispatched", location: "Route to incident (Ward 4)", phone: "555-0102", burnoutScore: 54, assignedPatients: 2 },
    { id: "EMP-003", name: "Dr. Marcus Chen", role: "Cardiologist", department: "Cardiology", status: "On Call", location: "Off-site (5 min radius)", phone: "555-0103", burnoutScore: 32, assignedPatients: 1 },
    { id: "EMP-004", name: "Nurse Emily Davis", role: "Triage Nurse", department: "Outpatient OPD", status: "Available", location: "Triage Desk A", phone: "555-0104", burnoutScore: 40, assignedPatients: 4 },
    { id: "EMP-005", name: "Paramedic Unit 7", role: "Ambulance Paramedic", department: "Ambulance Bay", status: "Available", location: "Ambulance Bay", phone: "555-0105", burnoutScore: 28, assignedPatients: 0 },
    { id: "EMP-006", name: "Dr. James Wilson", role: "Surgeon", department: "General Surgery", status: "In Surgery", location: "Operation Theater 2", phone: "555-0106", burnoutScore: 82, assignedPatients: 6 },
    { id: "EMP-007", name: "Dr. K. Anitha", role: "Surgeon", department: "Elective Surgery OPD", status: "Available", location: "Consultation Room 4", phone: "555-0107", burnoutScore: 35, assignedPatients: 3 },
    { id: "EMP-008", name: "Nurse Rajesh Raman", role: "Critical Care Nurse", department: "ICU Ward", status: "On Duty", location: "ICU Central Pod", phone: "555-0108", burnoutScore: 74, assignedPatients: 5 },
  ]

  const departments: DepartmentWorkload[] = [
    { name: "Emergency Casualty", loadPercentage: 88, activePatients: 22, queueDepth: 7, avgWaitMinutes: 38, status: "Overloaded" },
    { name: "Intensive Care (ICU)", loadPercentage: 90, activePatients: 18, queueDepth: 3, avgWaitMinutes: 24, status: "Surge" },
    { name: "General Surgery & OR", loadPercentage: 76, activePatients: 19, queueDepth: 4, avgWaitMinutes: 45, status: "Moderate" },
    { name: "General Medicine", loadPercentage: 80, activePatients: 32, queueDepth: 8, avgWaitMinutes: 32, status: "Moderate" },
    { name: "Pediatrics & MCH", loadPercentage: 48, activePatients: 12, queueDepth: 2, avgWaitMinutes: 12, status: "Optimal" },
  ]

  const conflicts: ResourceConflict[] = [
    {
      id: "CONF-101",
      title: "Imminent ICU Bed Exhaustion (< 10% Reserve)",
      severity: "Critical",
      category: "Bed Deficit",
      description: "ICU is at 90% capacity (18/20 beds occupied). 3 inbound critical trauma patients require immediate ventilator beds.",
      impact: "High risk of diverting 108 trauma ambulances to private centers outside district.",
      timestamp: "Just now"
    },
    {
      id: "CONF-102",
      title: "Surgical Bottleneck: OR 2 Backlog vs Inbound Trauma",
      severity: "High",
      category: "OR Bottleneck",
      description: "Dr. James Wilson is tied up in emergency surgery until 2:00 PM; second emergency laparotomy is queueing with no assigned surgeon.",
      impact: "Clinical SLA breach (> 45 min delay to surgical intervention).",
      timestamp: "6 mins ago"
    },
    {
      id: "CONF-103",
      title: "Casualty Triage Wait-Time Spike (38 mins)",
      severity: "Medium",
      category: "SLA Wait-Time Breach",
      description: "OPD Nurse Emily Davis is underutilized while Emergency Casualty triage desk has 7 unsorted walk-in patients.",
      impact: "Delayed detection of deteriorating vitals among walk-ins.",
      timestamp: "12 mins ago"
    }
  ]

  const recommendedStrategy: AllocationStrategy = {
    id: "STRAT-OPT-901",
    title: "Dynamic Bed Conversion & Surge Cross-Deployment Protocol",
    actions: [
      "Convert 3 Surgical HDU beds (SURG-320 to 322) into Emergency ICU Ventilator status.",
      "Redeploy Dr. K. Anitha from Elective OPD to Emergency OR for pending laparotomy.",
      "Mobilize Nurse Emily Davis from OPD Triage to Emergency Casualty Intake desk.",
      "Put Dr. Marcus Chen (Cardiologist, on call) on active standby for inbound cardiac telemetry.",
      "Offload 4 stable General Medicine convalescent patients to Villianur Sub-Centre PHC."
    ],
    projectedWaitMinutes: 14,
    projectedConflicts: 0,
    bedReallocations: [
      { fromWard: "Surgical Recovery & HDU", toWard: "Intensive Care Unit (ICU)", bedCount: 3, type: "ventilator_conversion", reason: "Absorb 3 incoming critical trauma arrivals without diversion" },
      { fromWard: "General Medicine A & Step-Down", toWard: "Villianur PHC Step-down", bedCount: 4, type: "step_down_transfer", reason: "Free up acute district hospital capacity" }
    ],
    staffRedeployments: [
      { staffId: "EMP-007", staffName: "Dr. K. Anitha", fromDept: "Elective Surgery OPD", toDept: "Emergency OR Suite", roleAction: "Assume second emergency laparotomy" },
      { staffId: "EMP-004", staffName: "Nurse Emily Davis", fromDept: "Outpatient OPD", toDept: "Emergency Casualty", roleAction: "Fast-track walk-in triage desk" }
    ],
    networkOffload: {
      targetFacility: "Villianur PHC Step-Down Ward, Pondicherry",
      patientCount: 4,
      careType: "Sub-acute convalescent recovery"
    }
  }

  const metrics: OptimizationMetrics = {
    overallEfficiency: 74,
    avgWaitMinutes: 38,
    baselineWaitMinutes: 48,
    bedOccupancyRate: 85,
    staffUtilizationRate: 64,
    activeConflictsCount: 3,
    isOptimized: false,
    appliedStrategyTitle: undefined
  }

  return {
    wards,
    staff,
    departments,
    conflicts,
    recommendedStrategy,
    metrics,
    activeSurgeScenario: null
  }
}

// Read state from localStorage with fallback
export function getHospitalResourceState(): HospitalResourceState {
  if (typeof window === "undefined") return getInitialHospitalState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = getInitialHospitalState()
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return getInitialHospitalState()
  }
}

// Save state to localStorage and broadcast event across tabs
export function saveHospitalResourceState(state: HospitalResourceState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new Event("storage"))
  window.dispatchEvent(new CustomEvent("medrelay-resource-update", { detail: state }))
}

// Execute the AI Optimization Strategy
export function executeOptimizationPlan(strategyId: string): HospitalResourceState {
  const current = getHospitalResourceState()
  const strategy = current.recommendedStrategy

  if (!strategy || strategy.id !== strategyId) return current

  // 1. Reallocate beds:
  const updatedWards = current.wards.map(ward => {
    // If ICU, add 3 converted beds
    if (ward.id === "ward-icu") {
      const newBeds = [...ward.beds]
      // Mark available or add converted beds
      const firstAvail = newBeds.findIndex(b => b.status === "available")
      if (firstAvail !== -1) {
        newBeds[firstAvail] = { ...newBeds[firstAvail], status: "reallocated", patientName: "Reserved for Inbound Trauma" }
      }
      return {
        ...ward,
        capacity: ward.capacity + 3,
        occupied: ward.occupied,
        critical: false,
        beds: [
          ...newBeds,
          { id: "icu-surge-1", bedNumber: "ICU-SURGE-101", status: "available" as const, ventilatorEquipped: true, oxygenEquipped: true },
          { id: "icu-surge-2", bedNumber: "ICU-SURGE-102", status: "available" as const, ventilatorEquipped: true, oxygenEquipped: true },
          { id: "icu-surge-3", bedNumber: "ICU-SURGE-103", status: "available" as const, ventilatorEquipped: true, oxygenEquipped: true },
        ]
      }
    }
    // If Surgery HDU, decrease capacity by 3 as they are shifted
    if (ward.id === "ward-surgery") {
      return {
        ...ward,
        capacity: Math.max(ward.occupied, ward.capacity - 3),
        beds: ward.beds.slice(0, 22)
      }
    }
    // If General Medicine, discharge 4 stable patients to Villianur PHC
    if (ward.id === "ward-medicine") {
      const newBeds = ward.beds.map((b, idx) => {
        if (idx >= 28 && idx < 32) {
          return { ...b, status: "available" as const, patientName: undefined, priority: undefined }
        }
        return b
      })
      return {
        ...ward,
        occupied: Math.max(0, ward.occupied - 4),
        beds: newBeds
      }
    }
    return ward
  })

  // 2. Redeploy Staff:
  const updatedStaff = current.staff.map(s => {
    const redeploy = strategy.staffRedeployments.find(r => r.staffId === s.id)
    if (redeploy) {
      return {
        ...s,
        originalDept: s.originalDept || s.department,
        department: redeploy.toDept,
        location: redeploy.toDept,
        status: "Redeployed" as const,
        burnoutScore: Math.min(100, s.burnoutScore + 10)
      }
    }
    // If Dr. Marcus Chen (Cardiologist), set to On Duty Standby
    if (s.id === "EMP-003") {
      return { ...s, status: "On Duty" as const, location: "Emergency Telemetry Pod" }
    }
    return s
  })

  // 3. Rebalance Department Workload:
  const updatedDepts = current.departments.map(dept => {
    if (dept.name === "Emergency Casualty") {
      return {
        ...dept,
        loadPercentage: 58,
        queueDepth: 2,
        avgWaitMinutes: 12,
        status: "Optimal" as const
      }
    }
    if (dept.name === "Intensive Care (ICU)") {
      return {
        ...dept,
        loadPercentage: 78,
        status: "Optimal" as const
      }
    }
    if (dept.name === "General Surgery & OR") {
      return {
        ...dept,
        loadPercentage: 62,
        queueDepth: 1,
        avgWaitMinutes: 15,
        status: "Optimal" as const
      }
    }
    return dept
  })

  // 4. Update Metrics:
  const updatedMetrics: OptimizationMetrics = {
    overallEfficiency: 95,
    avgWaitMinutes: strategy.projectedWaitMinutes,
    baselineWaitMinutes: 48,
    bedOccupancyRate: 76,
    staffUtilizationRate: 84,
    activeConflictsCount: 0,
    isOptimized: true,
    lastOptimizedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    appliedStrategyTitle: strategy.title
  }

  // 5. Clear or Resolve Conflicts:
  const resolvedState: HospitalResourceState = {
    ...current,
    wards: updatedWards,
    staff: updatedStaff,
    departments: updatedDepts,
    conflicts: [], // All active conflicts resolved!
    metrics: updatedMetrics
  }

  saveHospitalResourceState(resolvedState)

  // Append Audit Record
  try {
    const rawAudit = localStorage.getItem(AUDIT_LOGS_KEY)
    const auditLogs = rawAudit ? JSON.parse(rawAudit) : []
    auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: "AI Resource Optimization Executed",
      strategy: strategy.title,
      conflictsResolvedCount: current.conflicts.length,
      waitReduction: `${current.metrics.avgWaitMinutes}m -> ${strategy.projectedWaitMinutes}m`,
      actor: "Hospital Command AI Engine (HEALTH-04)"
    })
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(auditLogs.slice(0, 50)))
  } catch {}

  return resolvedState
}

// Simulation Scenarios for Hackathon Presentation
export function triggerSurgeSimulation(scenario: "mass_casualty" | "epidemic_surge" | "reset"): HospitalResourceState {
  if (scenario === "reset") {
    const resetState = getInitialHospitalState()
    saveHospitalResourceState(resetState)
    return resetState
  }

  if (scenario === "mass_casualty") {
    const current = getInitialHospitalState()
    
    // Simulate a major 4-vehicle accident on East Coast Road (ECR), Pondicherry
    const surgeConflicts: ResourceConflict[] = [
      {
        id: "CONF-ECR-01",
        title: "Mass Casualty Surge: 6 Critical Polytrauma Inbound",
        severity: "Critical",
        category: "Bed Deficit",
        description: "108 Ambulance dispatch reports 6 polytrauma casualties arriving in 8 minutes. Available ICU ventilator beds: 2.",
        impact: "Imminent catastrophic bed collision (4 patients without ventilator/trauma beds).",
        timestamp: "Just now"
      },
      {
        id: "CONF-ECR-02",
        title: "Critical Shortage: Dual Emergency Laparotomy & Orthopedic OR",
        severity: "Critical",
        category: "OR Bottleneck",
        description: "OR 1 & OR 2 occupied. Third emergency surgical suite requires on-call surgeon and anesthesiologist.",
        impact: "Severe surgical delay exceeding 60 minutes for hemorrhagic shock.",
        timestamp: "Just now"
      },
      {
        id: "CONF-ECR-03",
        title: "Casualty OPD Queue Gridlock (> 55 min wait)",
        severity: "High",
        category: "SLA Wait-Time Breach",
        description: "Emergency room crowding at 98% with 14 patients in waiting corridor.",
        impact: "Clinical staff overwhelmed; triage accuracy deteriorating.",
        timestamp: "1 min ago"
      }
    ]

    const massCasualtyStrategy: AllocationStrategy = {
      id: "STRAT-MASS-ECR",
      title: "Mass Casualty Incident (MCI) Code Red Optimization Plan",
      actions: [
        "Immediate conversion of 4 Post-Op HDU beds to Emergency Trauma Resuscitation Bays.",
        "Emergency mobilization of Dr. Marcus Chen and Dr. K. Anitha to Trauma Bay 1 & 2.",
        "Reassign Nurse Emily Davis and Nurse Rajesh Raman to continuous rapid casualty triage.",
        "Initiate Code Green network offload: Transfer 6 stable medical patients to Bahour & Villianur PHCs.",
        "Activate Central Medical Depot blood transfusion expedited courier."
      ],
      projectedWaitMinutes: 11,
      projectedConflicts: 0,
      bedReallocations: [
        { fromWard: "Surgical Recovery & HDU", toWard: "Emergency & Trauma Casualty", bedCount: 4, type: "ventilator_conversion", reason: "Absorb 6 critical polytrauma arrivals" },
        { fromWard: "General Medicine A & Step-Down", toWard: "Bahour PHC Inpatient Ward", bedCount: 6, type: "step_down_transfer", reason: "Evacuate acute beds for disaster surge" }
      ],
      staffRedeployments: [
        { staffId: "EMP-003", staffName: "Dr. Marcus Chen", fromDept: "Cardiology", toDept: "Trauma Resuscitation", roleAction: "Lead hemodynamic stabilization" },
        { staffId: "EMP-007", staffName: "Dr. K. Anitha", fromDept: "Elective Surgery OPD", toDept: "Emergency OR Suite", roleAction: "Open OR 3 for emergency laparotomy" },
        { staffId: "EMP-004", staffName: "Nurse Emily Davis", fromDept: "Outpatient OPD", toDept: "Casualty Intake", roleAction: "Rapid ESI Acuity Triage" }
      ],
      networkOffload: {
        targetFacility: "Bahour PHC & Villianur PHC, Pondicherry",
        patientCount: 6,
        careType: "Sub-acute medical convalescence"
      }
    }

    const surgeState: HospitalResourceState = {
      ...current,
      activeSurgeScenario: "Mass Casualty Highway Collision (ECR Pondicherry)",
      conflicts: surgeConflicts,
      recommendedStrategy: massCasualtyStrategy,
      metrics: {
        overallEfficiency: 52,
        avgWaitMinutes: 55,
        baselineWaitMinutes: 55,
        bedOccupancyRate: 96,
        staffUtilizationRate: 98,
        activeConflictsCount: 3,
        isOptimized: false
      }
    }

    saveHospitalResourceState(surgeState)
    return surgeState
  }

  if (scenario === "epidemic_surge") {
    const current = getInitialHospitalState()

    const dengueConflicts: ResourceConflict[] = [
      {
        id: "CONF-DNG-01",
        title: "Dengue Epidemic Surge: Ward 4 Muthialpet Cluster",
        severity: "Critical",
        category: "Bed Deficit",
        description: "Spike of 12 pediatric and adult dengue patients with severe thrombocytopenia (Platelets < 30,000). General ward near capacity.",
        impact: "Severe bed deficit in infectious isolation wing.",
        timestamp: "Just now"
      },
      {
        id: "CONF-DNG-02",
        title: "Platelet & IV Fluid Infusion Nursing Deficit",
        severity: "High",
        category: "Staff Deficit",
        description: "Ratio of critical care nurses to pediatric dengue patients has dropped to 1:6 (Standard is 1:2).",
        impact: "Delayed platelet transfusions and IV colloid titration.",
        timestamp: "3 mins ago"
      }
    ]

    const epidemicStrategy: AllocationStrategy = {
      id: "STRAT-DENGUE-99",
      title: "Epidemic Dengue Inpatient Surge & Fluid Protocol",
      actions: [
        "Repurpose 8 Pediatric Day-Care beds into Infectious Disease Observation Ward.",
        "Mobilize 2 Community Health Nurses from Ariyankuppam PHC to District Dengue Ward.",
        "Fast-track IV fluid titration order set and coordinate with Puducherry Central Blood Bank."
      ],
      projectedWaitMinutes: 16,
      projectedConflicts: 0,
      bedReallocations: [
        { fromWard: "Pediatrics & Neonatal Care", toWard: "Infectious Disease Observation", bedCount: 8, type: "ward_overflow", reason: "Isolate and monitor acute dengue thrombocytopenia" }
      ],
      staffRedeployments: [
        { staffId: "EMP-004", staffName: "Nurse Emily Davis", fromDept: "Outpatient OPD", toDept: "Dengue Fluid Ward", roleAction: "Continuous vitals & hematocrit monitoring" }
      ]
    }

    const surgeState: HospitalResourceState = {
      ...current,
      activeSurgeScenario: "Dengue Fever Epidemic Surge (Muthialpet Ward 4)",
      conflicts: dengueConflicts,
      recommendedStrategy: epidemicStrategy,
      metrics: {
        overallEfficiency: 61,
        avgWaitMinutes: 44,
        baselineWaitMinutes: 44,
        bedOccupancyRate: 92,
        staffUtilizationRate: 88,
        activeConflictsCount: 2,
        isOptimized: false
      }
    }

    saveHospitalResourceState(surgeState)
    return surgeState
  }

  return getHospitalResourceState()
}
