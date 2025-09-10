export default function Dashboard({ categories }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      {categories.map((category) => (
        <div
          key={category.name}
          className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-600">{category.name}</h2>
          <p className="mt-2 text-xl text-gray-700">${category.amount.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

