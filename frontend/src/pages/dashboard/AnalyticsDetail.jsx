import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiMapPin, FiGrid, FiExternalLink, FiGlobe, FiXCircle } from 'react-icons/fi'
import { fetchScanResults, setCurrentPage, updateLeadStatus } from '../../store/leadsSlice'
import { selectCurrentToken } from '../../store/authSlice'
import { swal } from '../../utils/sweetalert'
import $ from 'jquery'
import 'datatables.net-dt'
import 'datatables.net-responsive-dt'

const STATUS_COLORS = {
  pending:  { bg: 'rgba(170,187,197,0.1)', color: '#AABBC5',  border: 'rgba(170,187,197,0.25)' },
  reached:  { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24',  border: 'rgba(251,191,36,0.25)'  },
  accepted: { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80',  border: 'rgba(74,222,128,0.25)'  },
  rejected: { bg: 'rgba(248,113,113,0.1)', color: '#f87171',  border: 'rgba(248,113,113,0.25)' },
}

export default function AnalyticsDetail() {
  const { scanId } = useParams()
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const token      = useSelector(selectCurrentToken)
  const { currentScan, results, status, totalResults, totalPages, currentPage } = useSelector(s => s.leads)
  const tableRef   = useRef(null)
  const dtRef      = useRef(null)

  useEffect(() => {
    dispatch(fetchScanResults({ token, scanId, page: 1 }))
  }, [dispatch, token, scanId])

  // Init DataTable
  useEffect(() => {
    if (status !== 'succeeded' || !tableRef.current || !results.length) return

    if (dtRef.current) { dtRef.current.destroy(); dtRef.current = null }

    dtRef.current = $(tableRef.current).DataTable({
      responsive:  true,
      pageLength:  15,
      order:       [[0, 'asc']],
      columnDefs:  [{ orderable: false, targets: [5, 6] }],
      language: {
        search:      'Filter results:',
        info:        'Showing _START_ to _END_ of _TOTAL_ businesses',
        emptyTable:  'No results in this scan.',
      },
    })

    return () => { if (dtRef.current) { dtRef.current.destroy(); dtRef.current = null } }
  }, [results, status])

  async function handleStatusChange(resultId, currentStatus) {
    const statuses = ['pending', 'reached', 'accepted', 'rejected']
    const { value } = await swal.confirm(
      'Update Lead Status',
      `Current: ${currentStatus}. Select new status:`,
    )
    // Use sweetalert2 select
    const Swal = (await import('sweetalert2')).default
    const { value: newStatus } = await Swal.fire({
      title:             'Update Lead Status',
      input:             'select',
      inputOptions:      { pending: 'Pending', reached: 'Reached Out', accepted: 'Accepted', rejected: 'Rejected' },
      inputValue:        currentStatus,
      showCancelButton:  true,
      confirmButtonText: 'Update',
      background:        '#2d2d2d',
      color:             '#ffffff',
      confirmButtonColor:'#AABBC5',
    })

    if (!newStatus) return

    try {
      await dispatch(updateLeadStatus({ token, resultId, leadStatus: newStatus })).unwrap()
      swal.success('Updated!', `Lead status changed to "${newStatus}".`)
    } catch (err) {
      swal.error('Error', err || 'Could not update status.')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="w-8 h-8 border-2 border-casper border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl">

      {/* Back button */}
      <motion.button
        onClick={() => navigate('/dashboard/analytics')}
        className="flex items-center gap-2 text-sm text-dove hover:text-casper transition-colors w-fit cursor-pointer"
        whileHover={{ x: -3 }}
      >
        <FiArrowLeft size={15} /> Back to Analytics
      </motion.button>

      {/* Scan header */}
      {currentScan && (
        <motion.div
          className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ background: 'rgba(170,187,197,0.07)', border: '1px solid rgba(170,187,197,0.15)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-casper">Scan Details</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <FiMapPin size={15} className="text-casper" />
                <span className="font-syne font-black text-white text-xl">{currentScan.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiGrid size={14} className="text-dove" />
                <span className="badge badge-casper">{currentScan.categoryLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-syne font-black text-white text-2xl">{currentScan.totalFound}</p>
              <p className="text-xs text-dove">Total</p>
            </div>
            <div className="text-center">
              <p className="font-syne font-black text-2xl" style={{ color: '#f87171' }}>{currentScan.noWebsite}</p>
              <p className="text-xs text-dove">No Website</p>
            </div>
            <div className="text-center">
              <p className="font-syne font-black text-2xl" style={{ color: '#4ade80' }}>{currentScan.hasWebsite}</p>
              <p className="text-xs text-dove">Has Website</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results table */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(170,187,197,0.12)', background: 'rgba(28,28,30,0.7)' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-5 overflow-x-auto">
          {results.length > 0 ? (
            <table ref={tableRef} className="w-full text-sm leadradar-table" style={{ color: '#fff' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(170,187,197,0.15)' }}>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Business</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Contact</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Address</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Website</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Lead Status</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Maps</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => {
                  const statusStyle = STATUS_COLORS[result.leadStatus] || STATUS_COLORS.pending
                  return (
                    <tr
                      key={result.resultId}
                      style={{ borderBottom: '1px solid rgba(170,187,197,0.06)' }}
                    >
                      <td className="py-3 px-3 font-medium text-white max-w-[180px]">
                        <p className="truncate">{result.businessName || '—'}</p>
                        {result.hours && (
                          <p className="text-xs text-dove mt-0.5 truncate">{result.hours}</p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge badge-casper">{result.businessType || '—'}</span>
                      </td>
                      <td className="py-3 px-3 text-dove text-xs">
                        {result.phone || '—'}
                      </td>
                      <td className="py-3 px-3 text-dove text-xs max-w-[160px]">
                        <p className="truncate">{result.address || '—'}</p>
                      </td>
                      <td className="py-3 px-3">
                        {result.hasWebsite
                          ? <span className="badge badge-green"><FiGlobe size={10} className="mr-1" />Yes</span>
                          : <span className="badge badge-red"><FiXCircle size={10} className="mr-1" />No</span>
                        }
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleStatusChange(result.resultId, result.leadStatus)}
                          className="badge cursor-pointer transition-all"
                          style={{
                            background: statusStyle.bg,
                            color:      statusStyle.color,
                            border:     `1px solid ${statusStyle.border}`,
                          }}
                        >
                          {result.leadStatus || 'pending'}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        {result.mapsUrl && (
                          <a
                            href={result.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-casper text-xs no-underline hover:text-white transition-colors"
                          >
                            <FiExternalLink size={13} /> Maps
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 text-dove">No results found for this scan.</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}