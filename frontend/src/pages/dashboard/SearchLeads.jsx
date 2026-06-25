import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import axios from 'axios'
import { swal } from '../../utils/sweetalert'
import { selectCurrentToken } from '../../store/authSlice'
import { saveScan } from '../../store/leadsSlice'
import BusinessCard from '../../components/BusinessCard'
import SkeletonCard from '../../components/SkeletonCard'

const authHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

// Dynamically render a react-icon by name string stored in DB
function DynamicIcon({ name, size = 16, className = '' }) {
  const Icon = FiIcons[name] || FiIcons.FiGrid
  return <Icon size={size} className={className} />
}

export default function SearchLeads() {
  const dispatch = useDispatch()
  const token    = useSelector(selectCurrentToken)

  const [categories,     setCategories]     = useState([])
  const [selectedCat,    setSelectedCat]    = useState(null)
  const [city,           setCity]           = useState('')
  const [results,        setResults]        = useState(null)
  const [searching,      setSearching]      = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [catDropOpen,    setCatDropOpen]    = useState(false)
  const dropRef = useRef(null)

  // Load categories from DB on mount
  useEffect(() => {
    axios.get('/api/v1/categories', authHeaders(token))
      .then(res => setCategories(res.data))
      .catch(() => swal.error('Error', 'Failed to load categories.'))
  }, [token])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setCatDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    if (!selectedCat) {
      swal.warning('Select a Category', 'Please choose a business category before scanning.')
      return
    }
    if (!city.trim()) {
      swal.warning('Enter a City', 'Please enter a city name to scan.')
      return
    }
    setSearching(true)
    setResults(null)
    try {
      const res = await axios.get('/api/v1/search', {
        ...authHeaders(token),
        params: { city: city.trim(), category: selectedCat.categoryKey }
      })
      setResults(res.data)
    } catch (err) {
      swal.error('Scan Failed', err.response?.data?.detail || 'Something went wrong.')
    } finally {
      setSearching(false)
    }
  }

  async function handleSave() {
    if (!results || results.places.length === 0) return
    setSaving(true)
    try {
      await dispatch(saveScan({
        token,
        payload: {
          categoryKey:   selectedCat.categoryKey,
          categoryLabel: selectedCat.label,
          city:          results.city,
          totalFound:    results.total,
          noWebsite:     results.noWebsite,
          hasWebsite:    results.hasWebsite,
          results:       results.places.map(p => ({
            businessName: p.name,
            businessType: p.type,
            address:      p.address,
            phone:        p.phone,
            hours:        p.hours,
            website:      p.website,
            hasWebsite:   p.hasWebsite,
            mapsUrl:      p.mapsUrl,
            lat:          p.lat,
            lon:          p.lon,
          }))
        }
      })).unwrap()
      swal.success('Saved!', `${results.places.length} leads saved to your analytics.`)
    } catch (err) {
      swal.error('Save Failed', err || 'Could not save leads.')
    } finally {
      setSaving(false)
    }
  }

  async function handleExport() {
    if (!results) return
    try {
      const res = await axios.get('/api/v1/export', {
        ...authHeaders(token),
        params:       { city: results.city, category: selectedCat.categoryKey },
        responseType: 'blob',
      })
      const url  = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href  = url
      link.setAttribute('download', `leadradar_${results.city}_${selectedCat.categoryKey}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      swal.error('Export Failed', 'Could not export results.')
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl">

      {/* Page title */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-casper mb-1">Dashboard</p>
        <h1 className="font-syne text-2xl font-black text-white">Search Leads</h1>
        <p className="text-sm text-dove mt-1">Scan any city for businesses with no web presence.</p>
      </div>

      {/* Search bar row — grid col-8 / col-4 */}
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-12 gap-3 items-center">

          {/* City input — col 8 */}
          <div className="col-span-12 md:col-span-8 relative">
            <FiIcons.FiSearch
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-dove pointer-events-none"
            />
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Enter city — Jodhpur, Jaipur, Mumbai, Delhi..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
              style={{
                background:  'rgba(45,45,45,0.9)',
                border:      '1px solid rgba(170,187,197,0.2)',
                caretColor:  '#AABBC5',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(170,187,197,0.6)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(170,187,197,0.2)'}
            />
          </div>

          {/* Category dropdown — col 4 */}
          <div className="col-span-12 md:col-span-4 relative" ref={dropRef}>
            <button
              type="button"
              onClick={() => setCatDropOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm text-white transition-all duration-200"
              style={{
                background: 'rgba(45,45,45,0.9)',
                border:     `1px solid ${catDropOpen ? 'rgba(170,187,197,0.6)' : 'rgba(170,187,197,0.2)'}`,
              }}
            >
              <span className="flex items-center gap-2">
                {selectedCat
                  ? <><DynamicIcon name={selectedCat.iconName} size={15} className="text-casper" />{selectedCat.label}</>
                  : <span className="text-dove">Select category...</span>
                }
              </span>
              <motion.span animate={{ rotate: catDropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <FiIcons.FiChevronDown size={15} className="text-casper" />
              </motion.span>
            </button>

            <AnimatePresence>
              {catDropOpen && (
                <motion.ul
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-auto z-50 list-none p-0 m-0"
                  style={{
                    background: 'rgba(28,28,30,0.98)',
                    border:     '1px solid rgba(170,187,197,0.2)',
                    boxShadow:  '0 20px 60px rgba(0,0,0,0.6)',
                    maxHeight:  '280px',
                  }}
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit={{    opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {categories.map((cat) => (
                    <li
                      key={cat.categoryKey}
                      onClick={() => { setSelectedCat(cat); setCatDropOpen(false) }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors duration-150"
                      style={{
                        color:      selectedCat?.categoryKey === cat.categoryKey ? '#AABBC5' : 'rgba(255,255,255,0.8)',
                        background: selectedCat?.categoryKey === cat.categoryKey ? 'rgba(170,187,197,0.1)' : 'transparent',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(170,187,197,0.08)' }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background =
                          selectedCat?.categoryKey === cat.categoryKey ? 'rgba(170,187,197,0.1)' : 'transparent'
                      }}
                    >
                      <DynamicIcon name={cat.iconName} size={15} className="shrink-0" />
                      <span>{cat.label}</span>
                      {selectedCat?.categoryKey === cat.categoryKey && (
                        <FiIcons.FiCheck size={13} className="text-casper ml-auto" />
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Scan button */}
          <div className="col-span-12">
            <motion.button
              type="submit"
              disabled={searching}
              className="px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
              style={{ background: '#AABBC5', color: '#212023' }}
              whileHover={{ scale: 1.03, background: '#C2D4DC' }}
              whileTap={{ scale: 0.97 }}
            >
              {searching
                ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Scanning...</>
                : <><FiIcons.FiSearch size={15} /> Scan City</>
              }
            </motion.button>
          </div>
        </div>
      </form>

      {/* Results panel — fixed height, scrollable */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(170,187,197,0.12)', background: 'rgba(28,28,30,0.6)' }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: '1px solid rgba(170,187,197,0.1)', background: 'rgba(38,38,40,0.8)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">
              {results
                ? `${results.total} results — ${results.noWebsite} without website`
                : 'Results'
              }
            </span>
            {results && (
              <span className="badge badge-casper">{results.city} · {selectedCat?.label}</span>
            )}
          </div>
        </div>

        {/* Scrollable results area */}
        <div
          className="overflow-y-auto p-4"
          style={{ height: '520px' }}
        >
          {/* Skeleton loaders */}
          {searching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
            </div>
          )}

          {/* No search yet */}
          {!searching && !results && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(170,187,197,0.08)', border: '1px solid rgba(170,187,197,0.15)' }}
              >
                <FiIcons.FiSearch size={28} className="text-casper" />
              </div>
              <div>
                <p className="font-syne font-bold text-white text-lg">Search for leads</p>
                <p className="text-sm text-dove mt-1 max-w-xs">
                  Select a category, enter a city and click Scan City to find businesses.
                </p>
              </div>
            </div>
          )}

          {/* Results grid */}
          {!searching && results && results.places.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.places.map((place, i) => (
                <BusinessCard key={place.id || i} place={place} index={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!searching && results && results.places.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <p className="text-4xl">🔍</p>
              <p className="font-bold text-white">No results found</p>
              <p className="text-sm text-dove">Try a different city or category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons row */}
      {results && results.places.length > 0 && (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
            style={{ background: '#AABBC5', color: '#212023', boxShadow: '0 4px 16px rgba(170,187,197,0.25)' }}
            whileHover={{ scale: 1.03, background: '#C2D4DC' }}
            whileTap={{ scale: 0.97 }}
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <FiIcons.FiSave size={15} />
            }
            {saving ? 'Saving...' : 'Save Search Data'}
          </motion.button>

          <motion.button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-casper"
            style={{ border: '1px solid rgba(170,187,197,0.25)', background: 'rgba(45,45,45,0.8)' }}
            whileHover={{ scale: 1.03, borderColor: 'rgba(170,187,197,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            <FiIcons.FiDownload size={15} /> Export .xlsx
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}