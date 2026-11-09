export default function Navegacion({ onInput }) {
  return (
    <div className="bg-mercadona p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <h1 className="text-white text-2xl font-bold hidden md:block">Mercadona</h1>
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="w-full pl-4 pr-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700"
            onChange={onInput} 
          />
        </div>
      </div>
    </div>
  );
}
