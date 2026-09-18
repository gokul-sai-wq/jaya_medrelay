"use client"

import { useState, useEffect } from "react"
import { User, Search, MapPin, Phone, ShieldCheck, Mail, Activity, RefreshCw, AlertCircle, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getHospitalResourceState, HospitalResourceState, StaffMember } from "@/lib/resource-optimizer"

export default function StaffRosterPage() {
  const [state, setState] = useState<HospitalResourceState>(getHospitalResourceState())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("All")

  useEffect(() => {
    const handleUpdate = () => setState(getHospitalResourceState())
    window.addEventListener("storage", handleUpdate)
    window.addEventListener("medrelay-resource-update", handleUpdate)
    const interval = setInterval(handleUpdate, 2000)
    return () => {
      window.removeEventListener("storage", handleUpdate)
      window.removeEventListener("medrelay-resource-update", handleUpdate)
      clearInterval(interval)
    }
  }, [])

  const filteredStaff = state.staff.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.id.toLowerCase().includes(searchTerm.toLowerCase())
    if (filterRole === "All") return matchesSearch
    if (filterRole === "Doctors") return matchesSearch && (person.role.includes("Physician") || person.role.includes("Surgeon") || person.role.includes("Cardiologist"))
    if (filterRole === "Paramedics") return matchesSearch && person.role.includes("Paramedic")
    if (filterRole === "Nurses") return matchesSearch && person.role.includes("Nurse")
    return matchesSearch
  })

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-2 sm:px-4 pb-12 animate-in fade-in duration-200">
      
      {/* Top Clinical Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-slate-300 flex items-center gap-1">
              <Layers size={12} className="text-slate-600" /> HRAS Workforce Protocol 04
            </span>
            {state.metrics.isOptimized && (
              <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                SURGE SHIFT BALANCED
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Clinical Duty Roster &amp; Surge Deployment
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Indira Gandhi Govt General Hospital • On-duty physicians, surgeons, critical care nurses, and emergency paramedic units.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/hospital/allocations">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-8 shadow-xs rounded">
              Workforce Allocation Console →
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => setState(getHospitalResourceState())}
            className="text-slate-700 border-slate-300 text-xs h-8 rounded hover:bg-slate-50"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Roster
          </Button>
        </div>
      </div>

      {/* Roster Table Card */}
      <Card className="border border-slate-200 shadow-xs rounded-lg overflow-hidden bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-3 px-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, role, employee ID..." 
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-slate-500 shadow-2xs" 
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {["All", "Doctors", "Nurses", "Paramedics"].map((role) => (
              <Button 
                key={role}
                size="sm"
                variant={filterRole === role ? "default" : "outline"} 
                onClick={() => setFilterRole(role)}
                className={`text-xs h-7 px-2.5 font-semibold rounded ${
                  filterRole === role 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'text-slate-600 border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                {role}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs text-slate-600 font-bold bg-slate-50">
                  <th className="p-3.5 py-2.5">Staff Name &amp; ID</th>
                  <th className="p-3.5 py-2.5">Clinical Role</th>
                  <th className="p-3.5 py-2.5">Department</th>
                  <th className="p-3.5 py-2.5">Duty Status</th>
                  <th className="p-3.5 py-2.5">Current Location</th>
                  <th className="p-3.5 py-2.5">Workload / Fatigue</th>
                  <th className="p-3.5 py-2.5 text-right">Comms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-xs">
                {filteredStaff.map((person) => (
                  <tr key={person.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 text-xs">
                          {person.name.charAt(person.name.startsWith("Dr.") ? 4 : 0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{person.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{person.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{person.role}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{person.assignedPatients} active patients</div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-700 font-medium">{person.department}</div>
                      {person.originalDept && person.originalDept !== person.department && (
                        <div className="text-[10px] text-slate-500 font-mono">Shifted from: {person.originalDept}</div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                        person.status === 'On Duty' || person.status === 'Available' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        person.status === 'Redeployed' ? 'bg-slate-900 text-white border-slate-900' :
                        person.status === 'Dispatched' || person.status === 'In Surgery' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                        'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          person.status === 'On Duty' || person.status === 'Available' ? 'bg-emerald-600' :
                          person.status === 'Redeployed' ? 'bg-sky-400' :
                          person.status === 'Dispatched' || person.status === 'In Surgery' ? 'bg-rose-600' :
                          'bg-amber-600'
                        }`} />
                        {person.status}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin size={12} className="text-slate-500 shrink-0" />
                        {person.location}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1 w-24">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Fatigue:</span>
                          <span className={person.burnoutScore > 75 ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                            {person.burnoutScore}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full ${
                              person.burnoutScore > 75 ? 'bg-rose-600' :
                              person.burnoutScore > 50 ? 'bg-amber-500' :
                              'bg-emerald-600'
                            }`}
                            style={{ width: `${person.burnoutScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      <Button variant="outline" size="icon" className="w-6 h-6 rounded border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300">
                        <Phone size={11} />
                      </Button>
                      <Button variant="outline" size="icon" className="w-6 h-6 rounded border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300">
                        <Mail size={11} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
