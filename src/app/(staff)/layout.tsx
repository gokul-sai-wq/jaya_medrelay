"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldAlert, User, LogOut, CheckSquare, Stethoscope, Hospital, ShieldCheck, BarChart3, Landmark, UserPlus, Package, AlertOctagon, Activity, Users, FileText, Share2, Menu, X, Layers } from "lucide-react"
import { OfflineBanner } from "@/components/layout/offline-banner"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isDoctor = pathname.startsWith('/doctor')
  const isHospital = pathname.startsWith('/hospital')
  const isAdmin = pathname.startsWith('/admin')
  const isPHC = pathname.startsWith('/phc')
  const isASHA = pathname.startsWith('/asha')

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const renderNavLinks = () => (
    <nav className="space-y-1 px-3">
      <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Portal Access</div>
      
      {isDoctor && (
        <Link href="/doctor" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/doctor' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
          <Stethoscope size={20} className={pathname === '/doctor' ? "text-indigo-400" : "text-slate-400"} />
          <span className="font-medium">Doctor Portal</span>
        </Link>
      )}

      {isHospital && (
        <Link href="/hospital" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
          <Hospital size={20} className={pathname === '/hospital' ? "text-red-400" : "text-slate-400"} />
          <span className="font-medium">Hospital Portal</span>
        </Link>
      )}

      {isPHC && (
        <Link href="/phc" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/phc' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
          <Landmark size={20} className={pathname === '/phc' ? "text-teal-400" : "text-slate-400"} />
          <span className="font-medium">Sub-Centre / PHC Portal</span>
        </Link>
      )}

      {isASHA && (
        <Link href="/asha" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/asha' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
          <Users size={20} className={pathname === '/asha' ? "text-yellow-400" : "text-slate-400"} />
          <span className="font-medium">ASHA Worker Portal</span>
        </Link>
      )}

      {isAdmin && (
        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
          <ShieldCheck size={20} className={pathname === '/admin' ? "text-purple-400" : "text-slate-400"} />
          <span className="font-medium">Admin Portal</span>
        </Link>
      )}
      
      <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-2">My Workspace</div>
      
      {isDoctor && (
        <>
          <Link href="/doctor" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/doctor' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <CheckSquare size={20} className="text-slate-400" />
            <span className="font-medium">Pending Consults</span>
          </Link>
          <Link href="/doctor/records" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/doctor/records' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <User size={20} className="text-slate-400" />
            <span className="font-medium">Patient Records</span>
          </Link>
          <Link href="/doctor/schedule" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/doctor/schedule' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Stethoscope size={20} className="text-slate-400" />
            <span className="font-medium">My Schedule</span>
          </Link>
        </>
      )}

      {isHospital && (
        <>
          <Link href="/hospital/allocations" onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital/allocations' ? 'bg-slate-800 text-white font-semibold border-l-4 border-sky-500' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <div className="flex items-center gap-3">
              <Layers size={18} className={pathname === '/hospital/allocations' ? "text-sky-400" : "text-slate-400"} />
              <span className="font-medium text-xs">Capacity &amp; Resource Allocation</span>
            </div>
            <span className="bg-slate-800 text-sky-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700">HRAS</span>
          </Link>
          <Link href="/hospital" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <ShieldAlert size={20} className="text-slate-400" />
            <span className="font-medium">Active Emergencies</span>
          </Link>
          <Link href="/hospital/intake" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital/intake' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <UserPlus size={20} className="text-slate-400" />
            <span className="font-medium">Patient Intake</span>
          </Link>
          <Link href="/hospital/beds" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital/beds' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Hospital size={20} className="text-slate-400" />
            <span className="font-medium">Bed Availability</span>
          </Link>
          <Link href="/hospital/staff" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital/staff' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <User size={20} className="text-slate-400" />
            <span className="font-medium">Staff Roster</span>
          </Link>
          <Link href="/hospital/records" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital/records' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <FileText size={20} className="text-slate-400" />
            <span className="font-medium">Patient Records</span>
          </Link>
          <Link href="/hospital/referrals" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital/referrals' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <UserPlus size={20} className="text-slate-400" />
            <span className="font-medium">Inbound Referrals</span>
          </Link>
          <Link href="/hospital/queue" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/hospital/queue' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Users size={20} className="text-slate-400" />
            <span className="font-medium">OPD Queue Management</span>
          </Link>
        </>
      )}

      {isAdmin && (
        <>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Activity size={20} className="text-slate-400" />
            <span className="font-medium">District Command</span>
          </Link>
          <Link href="/admin/grievances" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/grievances' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <ShieldAlert size={20} className="text-red-400" />
            <span className="font-medium">Citizen Grievances &amp; Reports</span>
          </Link>
          <Link href="/admin/leaderboard" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/leaderboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <BarChart3 size={20} className="text-slate-400" />
            <span className="font-medium">Swasthya Leaderboard</span>
          </Link>
          <Link href="/admin/users" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/users' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <User size={20} className="text-slate-400" />
            <span className="font-medium">User Management</span>
          </Link>
          <Link href="/admin/logs" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/logs' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <ShieldCheck size={20} className="text-slate-400" />
            <span className="font-medium">System Audit Logs</span>
          </Link>
          <Link href="/admin/quality" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/quality' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <CheckSquare size={20} className="text-slate-400" />
            <span className="font-medium">Quality &amp; Accountability</span>
          </Link>
        </>
      )}

      {isPHC && (
        <>
          <Link href="/phc" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/phc' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Activity size={20} className="text-slate-400" />
            <span className="font-medium">PHC Dashboard</span>
          </Link>
          <Link href="/phc/emergency" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/phc/emergency' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <AlertOctagon size={20} className="text-slate-400" />
            <span className="font-medium">Emergency Requests</span>
          </Link>
          <Link href="/phc/intake" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/phc/intake' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <UserPlus size={20} className="text-slate-400" />
            <span className="font-medium">Patient Intake</span>
          </Link>
          <Link href="/phc/records" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/phc/records' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <FileText size={20} className="text-slate-400" />
            <span className="font-medium">Patient Records</span>
          </Link>
          <Link href="/phc/referrals" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/phc/referrals' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Share2 size={20} className="text-slate-400" />
            <span className="font-medium">Referrals &amp; Closures</span>
          </Link>
          <Link href="/phc/queue" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/phc/queue' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Users size={20} className="text-slate-400" />
            <span className="font-medium">Queue Management</span>
          </Link>
          <Link href="/phc/stock" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/phc/stock' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Package size={20} className="text-slate-400" />
            <span className="font-medium">Stock Reporting</span>
          </Link>
        </>
      )}

      {isASHA && (
        <>
          <Link href="/asha" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/asha' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <AlertOctagon size={20} className="text-red-400" />
            <span className="font-medium">Emergency SOS Alerts</span>
          </Link>
        </>
      )}
    </nav>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      {/* Staff Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex-1 max-w-xs w-full bg-slate-900 text-slate-300 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950">
              <Link href="/login" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <img src="/medrelay-logo.svg" alt="MedRelay" className="h-6 w-6 shrink-0" />
                <span className="text-lg font-bold text-white">MedRelay</span>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto py-4">
              {renderNavLinks()}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-red-900/30 transition-colors">
                <LogOut size={20} />
                <span className="font-medium">Exit to Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Staff Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Link href="/login" className="flex items-center gap-2">
            <img src="/medrelay-logo.svg" alt="MedRelay" className="h-6 w-6 shrink-0" />
            <span className="text-xl font-bold text-white">MedRelay <span className="text-sm font-normal text-slate-400">
              {isDoctor ? 'Doctor' : isHospital ? 'Hospital' : isPHC ? 'Sub-Centre / PHC' : isASHA ? 'ASHA Worker' : 'Admin'}
            </span></span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          {renderNavLinks()}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-red-900/30 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Exit to Login</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <OfflineBanner />
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-xs">
          {/* Left Facility & Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 md:hidden cursor-pointer"
              aria-label="Open staff menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 hidden sm:block" />
              <div>
                <div className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <span>
                    {isDoctor ? 'Clinical Consultation Suite — Department of Medicine' :
                     isHospital ? 'Indira Gandhi Govt General Hospital & PG Institute • Puducherry' :
                     isPHC ? 'Primary Health Centre Clinical Network • Villianur Sector' :
                     isASHA ? 'Frontline ASHA Worker Response Portal • Sector 4' :
                     'Directorate of Health & Family Welfare Services • Govt of Puducherry'}
                  </span>
                  <span className="hidden lg:inline-block bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 font-semibold">
                    HIS Node Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
                  {isHospital ? 'Facility Code: PY-IGGGH-01 • ESI Triage Active • Protocol: HRAS-04' :
                   isPHC ? 'Facility Code: PY-PHC-VILL-03 • ABHA Gateway Synchronized' :
                   isAdmin ? 'Facility Code: PY-DHS-CENTRAL • Epidemic Surveillance Active' :
                   'Emergency Care Coordination Gateway'}
                </div>
              </div>
            </div>
          </div>

          {/* Right User & Shift Status */}
          <div className="flex items-center gap-3.5">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">
                {isDoctor ? 'Dr. Marcus Chen, MD (Cardiology)' :
                 isHospital ? 'Dr. Sarah Jenkins, MD (Chief Medical Officer)' :
                 isPHC ? 'Dr. S. Ramanathan, MBBS (Medical Officer)' :
                 isASHA ? 'Kavitha Devi (ASHA-774)' :
                 'Dr. K. Ramanathan (District Health Officer)'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Shift: Morning (08:00 - 16:00)</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex justify-center items-center font-bold text-xs shadow-xs">
              <User size={16} className="text-slate-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-3 sm:p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
