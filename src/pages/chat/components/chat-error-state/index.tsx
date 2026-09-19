interface ChatErrorStateProps {
  message: string;
}

export const ChatErrorState = ({ message }: ChatErrorStateProps) => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div className="max-w-md w-full text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <span className="material-icons text-red-600 text-2xl">error_outline</span>
      </div>
      <h2 className="text-lg font-semibold text-neutral-900 mb-2">No pudimos cargar el negocio</h2>
      <p className="text-neutral-600 text-sm">{message}</p>
    </div>
  </div>
);