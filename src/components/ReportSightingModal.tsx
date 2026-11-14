import React, { useState } from 'react';
import { SpideyPin } from '../types';
import { soundManager } from '../services/soundManager';
import { X, Send, MapPin, ExternalLink, CheckCircle } from 'lucide-react';

interface ReportSightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSighting: (pin: SpideyPin) => void;
}

export const ReportSightingModal: React.FC<ReportSightingModalProps> = ({
  isOpen,
  onClose,
  onSubmitSighting
}) => {
  const [title, setTitle] = useState('');
  const [lat, setLat] = useState('40.7128');
  const [lng, setLng] = useState('-74.0060');
  const [pinType, setPinType] = useState<'confirmed' | 'rumored'>('rumored');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPin: SpideyPin = {
      id: `user-sighting-${Date.now()}`,
      title: title.trim(),
      lat: parseFloat(lat) || 40.7128,
      lng: parseFloat(lng) || -74.006,
      pinType,
      createdAt: new Date().toISOString(),
      watchPartyCopy: description.trim() || 'Reported by local bystander network.',
      imageSrc: '/images/shareImage/shareImage.jpg'
    };

    soundManager.playCategory('notification');
    onSubmitSighting(newPin);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0a0d14] border-2 border-[#09a4c7] shadow-[0_0_35px_rgba(9,164,199,0.5)] rounded p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#09a4c7]/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-[#96e0f7]" />
            <h2 className="text-lg font-bold tracking-widest text-[#96e0f7]">
              REPORT SPIDEY SIGHTING
            </h2>
          </div>

          <button
            onClick={onClose}
            className="bit-border-3step px-3 py-1 bg-[#0e1c3b] hover:bg-[#09a4c7] text-[#96e0f7] hover:text-black border border-[#09a4c7] font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <X size={14} />
            <span>CLOSE</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
            <CheckCircle size={48} className="text-[#00ff50] mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">
              SIGHTING TRANSMITTED!
            </h3>
            <p className="text-xs text-gray-300 font-mono">
              Coordinates pinned to the tactical radar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-gray-300 mb-1">SIGHTING TITLE / LOCATION</label>
              <input
                type="text"
                required
                placeholder="e.g. Spider-Man spotted atop Chrysler Building"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-[#0e1c3b]/60 border border-[#09a4c7]/50 rounded text-white focus:outline-none focus:border-[#96e0f7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 mb-1">LATITUDE</label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full p-2 bg-[#0e1c3b]/60 border border-[#09a4c7]/50 rounded text-white focus:outline-none focus:border-[#96e0f7]"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">LONGITUDE</label>
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full p-2 bg-[#0e1c3b]/60 border border-[#09a4c7]/50 rounded text-white focus:outline-none focus:border-[#96e0f7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">CLASSIFICATION</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#00ff50]">
                  <input
                    type="radio"
                    name="pinType"
                    checked={pinType === 'confirmed'}
                    onChange={() => setPinType('confirmed')}
                  />
                  <span>CONFIRMED SIGHTING</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#ff4040]">
                  <input
                    type="radio"
                    name="pinType"
                    checked={pinType === 'rumored'}
                    onChange={() => setPinType('rumored')}
                  />
                  <span>RUMORED SIGHTING</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">EYEWITNESS DETAILS</label>
              <textarea
                rows={3}
                placeholder="What was Spider-Man doing? Which suit was he wearing?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-[#0e1c3b]/60 border border-[#09a4c7]/50 rounded text-white focus:outline-none focus:border-[#96e0f7]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-800">
              <a
                href="https://x.com/spideytracker"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#96e0f7] hover:underline flex items-center gap-1"
              >
                <span>REPORT ON X @SPIDEYTRACKER</span>
                <ExternalLink size={12} />
              </a>

              <button
                type="submit"
                className="px-5 py-2 bg-[#09a4c7] hover:bg-[#96e0f7] text-black font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send size={14} />
                <span>SUBMIT REPORT</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
