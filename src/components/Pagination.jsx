import React from 'react'

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="row">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
      <span>Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  )
}
