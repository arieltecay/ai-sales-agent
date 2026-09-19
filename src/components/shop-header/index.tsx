interface ShopHeaderProps {
  businessName: string;
}

export const ShopHeader = ({ businessName }: ShopHeaderProps) => (
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
);