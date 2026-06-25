import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiTrash2, FiBarChart2 } from 'react-icons/fi'
import { fetchAllScans, deleteScan } from '../../store/leadsSlice'
import { selectCurrentToken } from '../../store/authSlice'
import { swal } from '../../utils/sweetalert'
import $ from 'jquery'
import 'datatables.net-dt'
import 'datatables.net-responsive-dt'

export default function Analytics() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const token     = useSelector(selectCurrentToken)
  const { scans, status } = useSelector(s => s.leads)
  const tableRef  = useRef(null)
  const dtRef     = useRef(null)

  useEffect(() => {
    dispatch(fetchAllScans(token))
  }, [dispatch, token])

  // Init / reinit DataTable when scans change
  useEffect(() => {
    if (status !== 'succeeded' || !tableRef.current) return

    // Destroy existing instance before reinit
    if (dtRef.current) {
      dtRef.current.destroy()
      dtRef.current = null
    }

    dtRef.current = $(tableRef.current).DataTable({
      responsive:  true,
      pageLength:  10,
      order:       [[4, 'desc']],
      columnDefs:  [{ orderable: false, targets: [5] }],
      language: {
        search:       'Filter scans:',
        lengthMenu:   'Show _MENU_ scans',
        info:         'Showing _START_ to _END_ of _TOTAL_ scans',
        emptyTable:   'No scans saved yet. Go to Search Leads to start scanning.',
        zeroRecords:  'No matching scans found.',
      },
    })

    return () => {
      if (dtRef.current) {
        dtRef.current.destroy()
        dtRef.current = null
      }
    }
  }, [scans, status])

  async function handleDelete(scanId, city, catLabel) {
    const result = await swal.confirm(
      'Delete this scan?',
      `This will permanently delete all saved results for "${city} — ${catLabel}".`
    )
    if (!result.isConfirmed) return

    try {
      await dispatch(deleteScan({ token, scanId })).unwrap()
      swal.success('Deleted', 'Scan and all its results have been removed.')
    } catch (err) {
      swal.error('Error', err || 'Could not delete scan.')
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl">

      {/* Page title */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-casper mb-1">Dashboard</p>
        <h1 className="font-syne text-2xl font-black text-white">Analytics</h1>
        <p className="text-sm text-dove mt-1">All your saved lead scans — view details or delete.</p>
      </div>

      {/* Stats summary */}
      {status === 'succeeded' && (
        <motion.div
          className="flex items-center gap-6 p-4 rounded-2xl"
          style={{ background: 'rgba(170,187,197,0.06)', border: '1px solid rgba(170,187,197,0.12)' }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <FiBarChart2 size={16} className="text-casper" />
            <span className="text-sm font-semibold text-white">{scans.length} total scans</span>
          </div>
          <div className="w-px h-4" style={{ background: 'rgba(170,187,197,0.2)' }} />
          <span className="text-sm text-dove">
            {scans.reduce((sum, s) => sum + (s.noWebsite || 0), 0)} total pitch targets saved
          </span>
        </motion.div>
      )}

      {/* DataTable card */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(170,187,197,0.12)', background: 'rgba(28,28,30,0.7)' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-5 overflow-x-auto">
          {status === 'loading' && (
            <div className="flex items-center justify-center py-20">
              <span className="w-8 h-8 border-2 border-casper border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {status === 'succeeded' && (
            <table
              ref={tableRef}
              className="w-full text-sm leadradar-table"
              style={{ color: '#fff' }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(170,187,197,0.15)' }}>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">City</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">No Website</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Scanned At</th>
                  <th className="text-left py-3 px-3 text-casper font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan) => (
                  <tr
                    key={scan.scanId}
                    style={{ borderBottom: '1px solid rgba(170,187,197,0.06)' }}
                  >
                    <td className="py-3 px-3 font-medium text-white">{scan.city}</td>
                    <td className="py-3 px-3">
                      <span className="badge badge-casper">{scan.categoryLabel}</span>
                    </td>
                    <td className="py-3 px-3 text-dove">{scan.totalFound}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold" style={{ color: '#f87171' }}>{scan.noWebsite}</span>
                    </td>
                    <td className="py-3 px-3 text-dove text-xs">{formatDate(scan.scannedAt)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {/* View details */}
                        <motion.button
                          onClick={() => navigate(`/dashboard/analytics/${scan.scanId}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(170,187,197,0.1)', color: '#AABBC5', border: '1px solid rgba(170,187,197,0.2)' }}
                          whileHover={{ scale: 1.05, background: 'rgba(170,187,197,0.2)' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiEye size={13} /> View
                        </motion.button>

                        {/* Delete */}
                        <motion.button
                          onClick={() => handleDelete(scan.scanId, scan.city, scan.categoryLabel)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                          whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.2)' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiTrash2 size={13} /> Delete
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}