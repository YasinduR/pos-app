import React from 'react'

export default function stockUpdate({ isOpen, onClose, initialTransaction}) {

  if (!isOpen) return null;
  return (
    <div className='dialog-overlay'>
        <div className='dialog-box' style={{ width: "85%" }}>
            <div>
                <h1>Stock update</h1>
                <button onClick={onClose}>Close</button>
            </div>

        </div>
    </div>
  )

}
