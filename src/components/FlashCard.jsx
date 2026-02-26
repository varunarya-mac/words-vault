import { useState } from 'react'

export default function FlashCard({ front, back, flipped, onFlip }) {
  return (
    <div className="flip-card w-full max-w-md mx-auto" onClick={onFlip}>
      <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
        {/* Front of card */}
        <div className={`flip-card-front ${flipped ? 'hidden' : ''}`}>
          <div className="glass-card p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide font-medium">
                Word / Idiom
              </p>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                {front}
              </h2>
              <p className="text-sm text-gray-400 italic">
                Tap to reveal meaning
              </p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className={`flip-card-back ${!flipped ? 'hidden' : ''}`}>
          <div className="glass-card p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <p className="text-sm text-primary-500 mb-4 uppercase tracking-wide font-medium">
                Meaning
              </p>
              <p className="text-lg text-gray-800 leading-relaxed mb-6">
                {back}
              </p>
              <p className="text-sm text-gray-400 italic">
                Tap to flip back
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
