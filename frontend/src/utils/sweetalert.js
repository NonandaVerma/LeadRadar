/**
 * LeadRadar — SweetAlert2 themed config
 * All alerts use project color palette.
 * Import { swal } and use instead of raw Swal everywhere.
 */
import Swal from 'sweetalert2'

const BASE = {
  background:    '#2d2d2d',
  color:         '#ffffff',
  confirmButtonColor:  '#AABBC5',
  cancelButtonColor:   '#676B6C',
  customClass: {
    popup:         'swal-leadradar',
    title:         'swal-title',
    confirmButton: 'swal-confirm',
    cancelButton:  'swal-cancel',
  }
}

export const swal = {
  success: (title, text = '') =>
    Swal.fire({ ...BASE, icon: 'success', title, text, timer: 2500, showConfirmButton: false }),

  error: (title, text = '') =>
    Swal.fire({ ...BASE, icon: 'error', title, text }),

  warning: (title, text = '') =>
    Swal.fire({ ...BASE, icon: 'warning', title, text }),

  confirm: (title, text = '', confirmText = 'Yes') =>
    Swal.fire({ ...BASE, icon: 'question', title, text, showCancelButton: true, confirmButtonText: confirmText, cancelButtonText: 'Cancel' }),

  info: (title, text = '') =>
    Swal.fire({ ...BASE, icon: 'info', title, text }),

  loading: (title = 'Please wait...') =>
    Swal.fire({ ...BASE, title, allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() }),

  close: () => Swal.close(),
}