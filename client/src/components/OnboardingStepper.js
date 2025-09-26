import React from 'react';

export default function OnboardingStepper({ currentStep }) {
  const steps = [
    { id: 'profile', label: 'Profile' },
    { id: 'readings', label: 'Readings' },
    { id: 'education', label: 'Education' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="card" style={{ padding: 12, marginBottom: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 8 }}>
        {steps.map((step, index) => {
          const active = index <= currentIndex;
          return (
            <div key={step.id} style={{ textAlign: 'center' }}>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: active ? 'var(--cyan)' : 'var(--muted-bg)',
                }}
              />
              <div style={{ marginTop: 6, fontSize: 12, color: active ? 'var(--text)' : 'var(--muted)' }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
