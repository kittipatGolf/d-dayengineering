import { XMarkIcon } from "@heroicons/react/24/outline";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[540px] rounded-md bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-[32px] font-bold text-slate-700">เนเธเนเนเธเนเธเธฃเนเธเธฅเน</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="เธเธดเธ”"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form className="space-y-3">
          <div>
            <label htmlFor="first-name" className="mb-1 block font-semibold text-slate-700">
              * เธเธทเนเธญ
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="เธเธทเนเธญ"
              className="w-full rounded border border-slate-300 px-4 py-2 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label htmlFor="last-name" className="mb-1 block font-semibold text-slate-700">
              * เธเธฒเธกเธชเธเธธเธฅ
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="เธเธฒเธกเธชเธเธธเธฅ"
              className="w-full rounded border border-slate-300 px-4 py-2 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block font-semibold text-slate-700">
              * เน€เธเธญเธฃเนเนเธ—เธฃเธจเธฑเธเธ—เน
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="08x-xxx-xxxx"
              className="w-full rounded border border-slate-300 px-4 py-2 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block font-semibold text-slate-700">
              เธญเธตเน€เธกเธฅ
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full rounded border border-slate-300 px-4 py-2 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="button"
            className="mt-2 w-full rounded bg-sky-500 py-2 font-semibold text-white transition hover:bg-sky-400"
          >
            เธเธฑเธเธ—เธถเธ
          </button>
        </form>
      </div>
    </div>
  );
}
