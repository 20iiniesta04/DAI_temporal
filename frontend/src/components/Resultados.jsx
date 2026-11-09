import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Resultados({ de }) {
    if (!de || de.length < 3) return <div className="text-center mt-10 text-gray-500">Escribe al menos 3 letras...</div>;

    // Usamos ruta para que pase por Caddy
    const { data, error, isLoading } = useSWR(
        `/api/productos/busqueda-anticipada/${de}`,
        fetcher
    );

    const ponProductos = (productos) => {
        if (productos.length === 0) return <div className="text-center text-red-500 font-bold mt-10">No hay productos.</div>;

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto mt-6">
                {productos.map(p => (
                    <div key={p._id} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden border border-gray-200 flex flex-col">
                        <img src={p.imageUrl || 'https://via.placeholder.com/150'} alt={p.name} className="h-48 w-full object-contain p-4 bg-white" />
                        <div className="p-4 flex-grow">
                            <h3 className="font-bold text-sm mb-1 text-gray-800">{p.name}</h3>
                            <p className="text-mercadona font-bold text-lg mt-2">{p.price} €</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (isLoading) return <h1 className="text-center mt-10 text-xl font-bold text-mercadona">Cargando...</h1>;
    if (error) return <div className="text-center mt-10 text-red-600">Error de conexión (Revisa que el backend esté encendido)</div>;

    return ponProductos(data);
}