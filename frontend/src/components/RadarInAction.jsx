import { ContainerScroll } from "./ui/container-scroll-animation";
import { MdRadar } from 'react-icons/md';
import { MdWifiOff } from 'react-icons/md'     
import { MdSearchOff } from 'react-icons/md'  
import { MdSignalWifiStatusbarNotConnected } from 'react-icons/md' 

/* Dashboard mock */
function DashboardMock() {
  return (
    <div className="w-full h-full rounded-2xl p-5 md:p-6 flex flex-col gap-5 overflow-hidden">

      {/* Header row */}
      <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid rgba(170,187,197,0.08)' }}>
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="LeadRadar" className="h-7 w-auto object-contain" alt="logo"/>
          <span className="font-syne text-white text-base font-semibold"> Active Radar Scan </span>
        </div>

        {/* Live badge */}
        <span className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-green-500 text-white">
          <MdRadar  /> Live: Scanning Local Area
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col gap-1">

        {/* Column headers */}
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider px-3 pb-3" style={{ color: '#676B6C' }}>
          <div className="w-1/3">Business Name</div>
          <div className="w-1/3 text-center">Digital Gap Detected</div>
          <div className="w-1/3 text-right">Action</div>
        </div>

        {/* Row 1 */}
        <div className="flex justify-between items-center p-3 rounded-xl transition-colors" style={{ borderBottom: '1px solid rgba(170,187,197,0.06)' }}>
          <div className="w-1/3 flex flex-col gap-0.5">
            <span className="text-white font-medium text-sm">Apex Local Plumbers</span>
            <span className="text-xs" style={{ color: '#676B6C' }}>Austin, TX</span>
          </div>
          <div className="w-auto">
            <span className="flex gap-1.5  text-center text-xs font-semibold px-3 py-2 rounded-full bg-red-500 text-white">
              <MdWifiOff className="text-sm"/> Missing Website </span>
          </div>
          <div className="w-1/3 text-right">
            <button className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all bg-casper text-[#0e0e10] hover:bg-[#8FAAB5]"> View Intel </button>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex justify-between items-center p-3 rounded-xl transition-colors" style={{ borderBottom: '1px solid rgba(170,187,197,0.06)' }}>
          <div className="w-1/3 flex flex-col gap-0.5">
            <span className="text-white font-medium text-sm">Dr. Smith Dental</span>
            <span className="text-xs" style={{ color: '#676B6C' }}>Austin, TX</span>
          </div>
          <div className="w-auto">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full  bg-casper text-[#0e0e10]">
              <MdSearchOff className="text-sm"/> No SEO Footprint </span>
          </div>
          <div className="w-1/3 text-right">
            <button className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all  bg-casper text-[#0e0e10] hover:bg-[#8FAAB5]"> View Intel </button>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex justify-between items-center p-3 rounded-xl transition-colors" style={{ borderBottom: '1px solid rgba(170,187,197,0.06)' }}>
          <div className="w-1/3 flex flex-col gap-0.5">
            <span className="text-white font-medium text-sm">Sunrise Salon & Spa</span>
            <span className="text-xs" style={{ color: '#676B6C' }}>Austin, TX</span>
          </div>
          <div className="w-auto">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-amber-400 text-[#0e0e10]">
              <MdSignalWifiStatusbarNotConnected  className="text-sm"/> Weak Social Only </span>
          </div>
          <div className="w-1/3 text-right">
            <button className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all  bg-casper text-[#0e0e10] hover:bg-[#8FAAB5]"> View Intel </button>
          </div>
        </div>

        {/* Skeleton rows — "scanning in progress" */}
        {[1, 2].map((n) => (
          <div key={n} className="flex justify-between items-center p-3 rounded-xl opacity-40">
            <div className="w-1/3 flex flex-col gap-2">
              <div className="h-3 w-3/4 rounded-full animate-pulse" style={{ background: 'rgba(170,187,197,0.15)' }} />
              <div className="h-2 w-1/2 rounded-full animate-pulse" style={{ background: 'rgba(170,187,197,0.10)' }} />
            </div>
            <div className="w-1/3">
              <div className="h-5 w-28 rounded-full animate-pulse" style={{ background: 'rgba(170,187,197,0.12)' }} />
            </div>
            <div className="w-1/3 flex justify-end">
              <div className="h-7 w-20 rounded-lg animate-pulse" style={{ background: 'rgba(170,187,197,0.10)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer status bar */}
      <div className="flex items-center justify-between pt-3 text-xs" style={{ borderTop: '1px solid rgba(170,187,197,0.08)', color: '#676B6C' }} >
        <span>Scanning: <span style={{ color: '#AABBC5' }}>Austin, TX</span></span>
        <span>3 leads found · <span style={{ color: '#4ade80' }}>2 high priority</span></span>
      </div>
    </div>
  );
}

export default function RadarInAction() {
  return (
    <div className="flex flex-col overflow-hidden" style={{ background: '#262626', position: 'relative', zIndex: 1 }} >
      <ContainerScroll
        titleComponent={
        <>
          <h2 className="font-syne text-2xl md:text-3xl font-semibold mb-4 text-casper">
            Stop guessing. Start scanning.
          </h2>
          <span  className="font-syne text-5xl md:text-[5.5rem] font-black leading-none block tracking-tight text-white">
            Your Radar in Action 
          </span>
        </> } >
        <DashboardMock />
      </ContainerScroll>
    </div>
  );
}