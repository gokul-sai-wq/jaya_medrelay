"use client"

import { useState, useEffect } from "react"
import { Bed, Info, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, ArrowRight, ShieldAlert, Wind, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getHospitalResourceState, HospitalResourceState, BedInfo } from "@/lib/resource-optimizer"

export default function HospitalBedsPage() {
  const [state, setState] = useState<HospitalResourceState>(getHospitalResourceState())
  const [selectedBed, setSelectedBed] = useState<{ wardName: string; bed: BedInfo } | null>(null)

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

  const totalCapacity = state.wards.reduce((acc, w) => acc + w.capacity, 0)
  const totalOccupied = state.wards.reduce((acc, w) => acc + w.occupied, 0)
  const totalAvailable = totalCapacity - totalOccupied
  const nearCapacityWards = state.wards.filter(w => (w.occupied / w.capacity) >= 0.85).length

  return (
    <div className="space-y-5 max-w-7xl mx-auto px-2 sm:px-4 pb-12 animate-in fade-in duration-200">
      
      {/* Top Clinical Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-slate-300 flex items-center gap-1">
              <Layers size={12} className="text-slate-600" /> Bed Management Protocol HRAS-04
            </span>
            {state.metrics.isOptimized && (
              <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                CAPACITY BALANCED
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Inpatient Bed Census &amp; Critical Care Capacity
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Indira Gandhi Govt General Hospital • Real-time ward census, ventilator telemetry, and emergency trauma bay reservation.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/hospital/allocations">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-8 shadow-xs rounded">
              Capacity Allocation Console →
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => setState(getHospitalResourceState())}
            className="text-slate-700 border-slate-300 text-xs h-8 rounded hover:bg-slate-50"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Census
          </Button>
        </div>
      </div>

      {/* Bed Contention Alert if Conflicts Exist */}
      {state.conflicts.some(c => c.category === "Bed Deficit") && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-3.5 rounded-r-lg flex items-center justify-between text-xs text-rose-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <div>
              <strong className="font-bold">Bed Contention Warning:</strong> Critical ICU beds approaching zero reserve margin.
              Inbound polytrauma cases reported by 108 Emergency Dispatch.
            </div>
          </div>
          <Link href="/hospital/allocations">
            <Button size="sm" variant="destructive" className="font-bold text-xs h-7 bg-rose-600 hover:bg-rose-700 rounded">
              Deploy Rebalance Protocol
            </Button>
          </Link>
        </div>
      )}

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card className="border border-slate-800 shadow-xs bg-slate-900 text-white rounded-lg">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="bg-slate-800 p-2.5 rounded border border-slate-700 text-slate-300"><Bed size={22} /></div>
            <div>
              <div className="text-2xl font-bold">{totalCapacity}</div>
              <div className="text-slate-300 text-xs">Total Monitored Beds</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-xs bg-white rounded-lg">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="bg-slate-100 text-slate-700 p-2.5 rounded border border-slate-200"><AlertCircle size={22} /></div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalOccupied}</div>
              <div className="text-slate-500 text-xs">Occupied Beds ({Math.round((totalOccupied / totalCapacity) * 100)}%)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-xs bg-white rounded-lg">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded border border-emerald-200"><CheckCircle2 size={22} /></div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalAvailable}</div>
              <div className="text-slate-500 text-xs font-semibold text-emerald-700">Available for Admission</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-xs bg-white rounded-lg">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className={`p-2.5 rounded border ${nearCapacityWards > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{nearCapacityWards}</div>
              <div className="text-slate-500 text-xs">Wards Near Capacity (&gt;85%)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Legend Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <span className="font-bold text-slate-900 text-xs">Bed Status:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-xs bg-emerald-100 border border-emerald-400"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-xs bg-slate-100 border border-slate-300"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-xs bg-sky-100 border border-sky-400"></div>
            <span>Surge Converted / Reallocated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-xs bg-amber-100 border border-amber-400"></div>
            <span>Reserved (108 Trauma)</span>
          </div>
        </div>
        <div className="text-slate-400 text-[11px] font-mono">
          Click any unit to review clinical assignment &amp; vitals.
        </div>
      </div>

      {/* Ward Cards with Dynamic Bed Matrix */}
      <div className="space-y-4">
        {state.wards.map((ward) => {
          const occupancyRate = Math.round((ward.occupied / ward.capacity) * 100)
          const isCritical = occupancyRate >= 85

          return (
            <Card key={ward.id} className={`border rounded-lg shadow-xs overflow-hidden bg-white ${isCritical ? 'border-rose-300' : 'border-slate-200'}`}>
              <CardHeader className="bg-slate-50 border-b border-slate-200 py-2.5 px-5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CardTitle className="text-sm font-bold text-slate-900">{ward.name}</CardTitle>
                  {isCritical && (
                    <span className="bg-rose-50 text-rose-800 text-[10px] font-mono font-bold px-2 py-0.2 rounded border border-rose-200">
                      CRITICAL OCCUPANCY ({occupancyRate}%)
                    </span>
                  )}
                  {ward.id === "ward-icu" && state.metrics.isOptimized && (
                    <span className="bg-sky-50 text-sky-800 text-[10px] font-mono font-bold px-2 py-0.2 rounded border border-sky-300">
                      +3 VENT UNITS CONVERTED
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-600">
                  <strong className="text-slate-900">{ward.occupied}</strong> / {ward.capacity} Occupied ({occupancyRate}%)
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {ward.beds.map((bed, bIdx) => {
                    const isOccupied = bed.status === "occupied"
                    const isReallocated = bed.status === "reallocated" || bed.bedNumber.includes("SURGE")
                    const isReserved = bed.status === "reserved"

                    return (
                      <button 
                        key={bIdx}
                        onClick={() => setSelectedBed({ wardName: ward.name, bed })}
                        className={`w-10 h-11 rounded border flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                          isReallocated
                            ? 'bg-sky-50 border-sky-400 text-sky-800 hover:bg-sky-100 shadow-xs'
                            : isReserved
                            ? 'bg-amber-50 border-amber-400 text-amber-800 hover:bg-amber-100 shadow-xs'
                            : isOccupied
                            ? 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200/60'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                        }`}
                        title={`${bed.bedNumber} - ${bed.status.toUpperCase()}`}
                      >
                        <Bed size={15} />
                        <span className="text-[8px] font-mono font-bold mt-0.5">
                          {bed.bedNumber.replace(/^[A-Z]+-/, '')}
                        </span>
                        {bed.ventilatorEquipped && (
                          <div className="absolute -top-1 -right-1 bg-slate-900 text-white p-0.5 rounded-full" title="Ventilator Equipped">
                            <Wind size={7} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Bed Detail Inspection Modal */}
      {selectedBed && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-mono">{selectedBed.wardName}</div>
                <div className="text-base font-bold">Bed Unit {selectedBed.bed.bedNumber}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                selectedBed.bed.status === 'occupied' ? 'bg-slate-800 text-slate-300' :
                selectedBed.bed.status === 'reallocated' ? 'bg-sky-500 text-white' :
                'bg-emerald-600 text-white'
              }`}>
                {selectedBed.bed.status}
              </span>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Ventilator Support:</span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {selectedBed.bed.ventilatorEquipped ? 'Active Mechanical Vent' : 'None (Standard)'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Oxygen Line:</span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {selectedBed.bed.oxygenEquipped ? 'Central Pipeline (O2)' : 'Mobile Cylinder'}
                  </div>
                </div>
              </div>

              {selectedBed.bed.patientName && (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-xs">Assigned Patient:</div>
                  <div className="text-slate-700 font-semibold">{selectedBed.bed.patientName}</div>
                  <div className="text-slate-500 text-[11px] font-mono">ESI Priority: {selectedBed.bed.priority || 'Emergent'}</div>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <Button 
                  onClick={() => setSelectedBed(null)} 
                  variant="outline" 
                  className="w-full text-slate-700 font-semibold h-8 rounded text-xs"
                >
                  Close
                </Button>
                <Link href="/hospital/allocations" className="w-full">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-8 rounded text-xs">
                    Reallocate in Console →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
