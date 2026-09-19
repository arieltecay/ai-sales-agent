import type { ChatOfflineStateProps } from "./types";

const OFFLINE_MESSAGE =
  "En este momento no estamos disponibles, pero volvemos pronto. ¡Gracias por tu paciencia!";

export const ChatOfflineState = ({ businessName }: ChatOfflineStateProps) => (
  <div className="min-h-screen flex flex-col bg-neutral-50">
    {/* Header */}
    <header className="bg-white border-b border-neutral-200 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <span className="material-icons text-primary-600 text-xl">storefront</span>
          </div>
          <div>
            <h1 className="font-semibold text-neutral-900">{businessName}</h1>
            <p className="text-xs text-neutral-500">Asistente virtual</p>
          </div>
        </div>
      </div>
    </header>

    {/* Chat area - single offline message */}
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-amber-600 text-2xl">schedule</span>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">No disponible temporalmente</h2>
          <p className="text-neutral-600 text-sm">{OFFLINE_MESSAGE}</p>
        </div>
      </div>
    </main>

    {/* Disabled input area */}
    <footer className="bg-white border-t border-neutral-200 px-4 py-3">
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            disabled
            placeholder="El asistente no está disponible en este momento"
            className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 placeholder-neutral-400 cursor-not-allowed"
            aria-disabled="true"
          />
        </div>
      </div>
    </footer>
  </div>
);