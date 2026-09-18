"use client"

import { useState, useEffect } from "react"
import { 
  getHospitalResourceState, 
  executeOptimizationPlan, 
  triggerSurgeSimulation, 
  HospitalResourceState,
  ResourceConflict,
  AllocationStrategy
} from "@/lib/resource-optimizer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ShieldAlert, 
  Activity, 
  Bed, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  RefreshCw, 
  ArrowRight, 
  Zap, 
  TrendingDown, 
  Building2, 
  Stethoscope, 
  UserCheck, 
  Share2, 
  Sliders, 
  Check, 
  ChevronRight,
  RotateCcw,
  Layers,
  FileCheck,
  CheckSquare
} from "lucide-react"
import Link from "next/link"

export default function HospitalResourceAllocationsPage() {
  const [state, setState] = useState<HospitalResourceState>(getHospitalResourceState())
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizeSuccess, setOptimizeSuccess] = useState(false)

  useEffect(() => {
    const handleUpdate = () => setState(getHospitalResourceState())
    window.addEventListener("storage", handleUpdate)
    window.addEventListener("medrelay-resource-update", handleUpdate)
    const interval = setInterval(handleUpdate, 1500)
    return () => {
      window.removeEventListener("storage", handleUpdate)
      window.removeEventListener("medrelay-resource-update", handleUpdate)
      clearInterval(interval)
    }
  }, [])

  const handleExecuteOptimization = () => {
    if (!state.recommendedStrategy) return
    setIsOptimizing(true)
    setTimeout(() => {
      const updated = executeOptimizationPlan(state.recommendedStrategy!.id)
      setState(updated)
      setIsOptimizing(false)
      setOptimizeSuccess(true)
      setTimeout(() => setOptimizeSuccess(false), 4000)
    }, 1000)
  }

  const handleSurge = (scenario: "mass_casualty" | "epidemic_surge" | "reset") => {
    const updated = triggerSurgeSimulation(scenario)
    setState(updated)
    setOptimizeSuccess(false)
  }

  const totalBeds = state.wards.reduce((acc, w) => acc + w.capacity, 0)
  const totalOccupied = state.wards.reduce((acc, w) => acc + w.occupied, 0)
  const availableBeds = totalBeds - totalOccupied

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12 animate-in fade-in duration-200">
      
      {/* Top Clinical Header & Emergency Drills */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-slate-300 flex items-center gap-1.5">
              <Layers size={13} className="text-slate-600" /> HRAS Protocol 04 • Bed &amp; Workforce Allocation
            </span>
            {state.activeSurgeScenario && (
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded border border-rose-300 flex items-center gap-1 animate-pulse">
                <AlertOctagon size={13} className="text-rose-600" /> Surge Mode Active: {state.activeSurgeScenario}
              </span>
            )}
            {state.metrics.isOptimized && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" /> Capacity Balanced &amp; Optimized
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Clinical Resource Allocation &amp; Capacity Management
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Indira Gandhi Govt General Hospital • Dynamic bed balancing, clinical staff surge redeployment &amp; queue triage.
          </p>
        </div>

        {/* Emergency Surge Testing Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Surge Drills:</div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSurge("mass_casualty")}
            className="border-rose-300 text-rose-700 bg-rose-50/50 hover:bg-rose-100 cursor-pointer text-xs h-8 font-semibold rounded-md"
          >
            <AlertTriangle size={13} className="mr-1 text-rose-600" /> Mass Casualty (ECR)
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSurge("epidemic_surge")}
            className="border-amber-300 text-amber-800 bg-amber-50/50 hover:bg-amber-100 cursor-pointer text-xs h-8 font-semibold rounded-md"
          >
            <Activity size={13} className="mr-1 text-amber-600" /> Dengue Epidemic
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleSurge("reset")}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer text-xs h-8 font-semibold rounded-md"
          >
            <RotateCcw size={13} className="mr-1" /> Reset Baseline
          </Button>
        </div>
      </div>

      {/* Protocol Execution Toast */}
      {optimizeSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-lg flex items-center justify-between shadow-xs animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <div className="text-xs">
              <strong className="font-bold">Protocol Deployed:</strong> All identified bed collisions and surgeon bottlenecks resolved. Average patient wait time reduced from {state.metrics.baselineWaitMinutes} mins to {state.metrics.avgWaitMinutes} mins.
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            SYNCED
          </span>
        </div>
      )}

      {/* Primary Clinical KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Capacity Index */}
        <Card className="border border-slate-200 shadow-xs bg-white rounded-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity Efficiency Index</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {state.metrics.overallEfficiency}%
                </div>
              </div>
              <div className={`p-2 rounded-md ${state.metrics.overallEfficiency >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                <Activity size={18} />
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2 text-xs">
              <span className={`font-semibold ${state.metrics.overallEfficiency >= 85 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {state.metrics.overallEfficiency >= 85 ? 'Operating at Optimal Margin' : 'Resource Contention Flagged'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Average Wait Time */}
        <Card className="border border-slate-200 shadow-xs bg-white rounded-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Triage Wait Time</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                  {state.metrics.avgWaitMinutes} <span className="text-xs font-normal text-slate-500">minutes</span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <TrendingDown size={13} /> -{state.metrics.baselineWaitMinutes - state.metrics.avgWaitMinutes}m
              </span>
              <span>vs unmitigated peak ({state.metrics.baselineWaitMinutes}m)</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Bed Occupancy */}
        <Card className="border border-slate-200 shadow-xs bg-white rounded-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospital Bed Occupancy</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {totalOccupied} <span className="text-xs font-normal text-slate-500">/ {totalBeds} Beds</span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Bed size={18} />
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
              <span>Rate: <strong className="text-slate-800">{Math.round((totalOccupied / totalBeds) * 100)}%</strong></span>
              <span className="text-emerald-700 font-semibold">{availableBeds} beds available</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Active Conflicts */}
        <Card className="border border-slate-200 shadow-xs bg-white rounded-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Resource Bottlenecks</div>
                <div className={`text-2xl font-bold mt-1 ${state.conflicts.length > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {state.conflicts.length}
                </div>
              </div>
              <div className={`p-2 rounded-md ${state.conflicts.length > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {state.conflicts.length > 0 ? <AlertOctagon size={18} /> : <CheckCircle2 size={18} />}
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              {state.conflicts.length > 0 ? (
                <span className="text-rose-700 font-bold">Action Required: Strategy Formulated</span>
              ) : (
                <span className="text-emerald-700 font-bold">All Bottlenecks Mitigated</span>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Two-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left Column: Conflicts and Action Protocol (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">

          {/* Conflict Avoidance Panel */}
          <Card className="border border-slate-200 shadow-xs rounded-lg overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-3 px-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="text-rose-600" size={16} />
                  Resource Bottlenecks &amp; Clinical Conflict Monitor
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-500 mt-0.5">
                  Surveillance of ICU bed exhaustion, OR backlog, and emergency department SLA breaches.
                </CardDescription>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                state.conflicts.length > 0 ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {state.conflicts.length} Bottlenecks
              </span>
            </CardHeader>
            <CardContent className="p-4">
              {state.conflicts.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded border border-slate-200">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-600 mb-1.5" />
                  <div className="font-bold text-slate-800 text-sm">All Clinical Resource Conflicts Cleared</div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-0.5">
                    Bed capacity is safely distributed across all surgical and medical wards. Staff rosters are aligned with intake volume.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleSurge("mass_casualty")}
                    className="mt-3 text-xs border-slate-300 h-7"
                  >
                    Simulate Emergency Influx
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.conflicts.map((conflict) => (
                    <div 
                      key={conflict.id} 
                      className={`p-3.5 rounded border text-xs ${
                        conflict.severity === 'Critical' 
                          ? 'border-rose-300 bg-rose-50/40' 
                          : conflict.severity === 'High' 
                          ? 'border-amber-300 bg-amber-50/40' 
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <AlertOctagon size={16} className={`shrink-0 mt-0.5 ${
                            conflict.severity === 'Critical' ? 'text-rose-600' : 'text-amber-600'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{conflict.title}</span>
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                conflict.severity === 'Critical' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}>
                                {conflict.severity}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                              Category: {conflict.category} • Detected: {conflict.timestamp}
                            </div>
                            <p className="text-slate-700 mt-1 leading-relaxed">
                              {conflict.description}
                            </p>
                            <div className="mt-1.5 text-slate-800 font-medium bg-white/80 p-1.5 rounded border border-slate-200">
                              <span className="text-slate-500 font-semibold">Clinical Impact:</span> {conflict.impact}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Automated Resource Reallocation Protocol Card */}
          {state.recommendedStrategy && (
            <Card className="border border-slate-300 shadow-xs rounded-lg overflow-hidden bg-white">
              <CardHeader className="bg-slate-900 text-white p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                      Protocol ID: {state.recommendedStrategy.id}
                    </div>
                    <CardTitle className="text-base font-bold text-white">
                      {state.recommendedStrategy.title}
                    </CardTitle>
                  </div>
                  <Button 
                    onClick={handleExecuteOptimization}
                    disabled={isOptimizing || state.conflicts.length === 0}
                    className={`text-xs font-bold px-4 py-2 rounded shadow-xs cursor-pointer ${
                      state.conflicts.length === 0 
                        ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isOptimizing ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw size={13} className="animate-spin" /> Deploying Protocol...
                      </span>
                    ) : state.conflicts.length === 0 ? (
                      <span className="flex items-center gap-1.5">
                        <Check size={13} /> Protocol Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <CheckSquare size={13} /> Deploy Reallocation Protocol
                      </span>
                    )}
                  </Button>
                </div>

                {/* Projected Impact Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px] font-mono">Projected Wait Time:</div>
                    <div className="text-sm font-bold text-white">
                      {state.recommendedStrategy.projectedWaitMinutes} mins <span className="text-emerald-400 text-xs font-normal">(-70%)</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] font-mono">Post-Deployment Collisions:</div>
                    <div className="text-sm font-bold text-emerald-400">
                      0 Conflicts
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] font-mono">Network Offload:</div>
                    <div className="text-xs font-bold text-white">
                      Villianur / Bahour PHC
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Action Directives:
                  </div>
                  <div className="space-y-1.5">
                    {state.recommendedStrategy.actions.map((act, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-800 bg-slate-50 p-2 rounded border border-slate-200">
                        <CheckCircle2 size={14} className="text-slate-600 mt-0.5 shrink-0" />
                        <span className="font-medium leading-relaxed">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bed and Staff Reallocation Directives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                      <Bed size={14} className="text-slate-600" /> Bed Rebalancing Directives
                    </div>
                    {state.recommendedStrategy.bedReallocations.map((b, idx) => (
                      <div key={idx} className="text-xs text-slate-600 border-b border-slate-200 pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                        <div className="font-semibold text-slate-800">
                          {b.fromWard} <ArrowRight size={10} className="inline mx-1" /> {b.toWard}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {b.bedCount} beds • {b.reason}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                      <Users size={14} className="text-slate-600" /> Clinical Staff Redeployment
                    </div>
                    {state.recommendedStrategy.staffRedeployments.map((s, idx) => (
                      <div key={idx} className="text-xs text-slate-600 border-b border-slate-200 pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                        <div className="font-semibold text-slate-800">{s.staffName}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Reassigned to: {s.toDept} ({s.roleAction})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Column: Department Workloads and Personnel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">

          {/* Department Workload Matrix */}
          <Card className="border border-slate-200 shadow-xs rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Building2 size={14} className="text-slate-600" /> Department Capacity &amp; Queue Depth
              </CardTitle>
              <span className="text-[11px] text-slate-500 font-mono">5 Clinical Units</span>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              {state.departments.map((dept, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] font-mono">{dept.queueDepth} in queue • ~{dept.avgWaitMinutes}m</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] border font-mono ${
                        dept.status === 'Surge' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                        dept.status === 'Overloaded' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        dept.status === 'Moderate' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                        'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {dept.loadPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        dept.loadPercentage > 85 ? 'bg-rose-600' :
                        dept.loadPercentage > 70 ? 'bg-amber-500' :
                        dept.loadPercentage > 50 ? 'bg-slate-600' :
                        'bg-emerald-600'
                      }`}
                      style={{ width: `${dept.loadPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Clinical Personnel Roster */}
          <Card className="border border-slate-200 shadow-xs rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Users size={14} className="text-slate-600" /> Active Shift Personnel
              </CardTitle>
              <Link href="/hospital/staff" className="text-xs text-slate-700 hover:text-slate-900 font-semibold underline">
                View All →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                {state.staff.slice(0, 5).map(member => (
                  <div key={member.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900">{member.name}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{member.role} • {member.department}</div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        member.status === 'On Duty' || member.status === 'Available' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        member.status === 'Redeployed' ? 'bg-slate-900 text-white border-slate-900' :
                        member.status === 'In Surgery' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {member.status}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Burnout: {member.burnoutScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ward Bed Matrix Quick Link */}
          <Card className="border border-slate-200 shadow-xs bg-slate-900 text-white p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0">
                <Bed size={16} />
              </div>
              <div>
                <div className="font-bold text-xs">Direct Bed Management Matrix</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Inspect individual ICU ventilator bays, step-down capacity, and reserved emergency trauma beds.
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800">
              <Link href="/hospital/beds" className="w-full">
                <Button variant="outline" size="sm" className="w-full bg-slate-800 hover:bg-slate-700 text-white border-slate-700 font-semibold text-xs h-8">
                  Open Ward Bed Matrix →
                </Button>
              </Link>
            </div>
          </Card>

        </div>

      </div>

    </div>
  )
}
