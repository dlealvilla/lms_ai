export type ToastKind = 'info' | 'success' | 'error';

/** Lightweight Folio toast — no external dependency. */
export function showToast(message: string, kind: ToastKind = 'info', ms = 2800) {
  if (typeof document === 'undefined') return;
  const existing = document.querySelectorAll('[data-folio-toast]');
  existing.forEach((el) => el.remove());

  const toast = document.createElement('div');
  toast.setAttribute('data-folio-toast', '1');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  const tone =
    kind === 'success'
      ? 'bg-[#0F6B3E] text-white'
      : kind === 'error'
        ? 'bg-[#B93232] text-white'
        : 'bg-ink text-white';
  toast.className = [
    'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]',
    'px-4 py-2.5 rounded-lg text-[13px] font-semibold shadow-lg',
    'animate-[folio-toast-in_180ms_ease-out]',
    tone,
  ].join(' ');
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 8px)';
    toast.style.transition = 'opacity 160ms ease, transform 160ms ease';
    window.setTimeout(() => toast.remove(), 180);
  }, ms);
}
