export default function DashboardSubs() {
  return (
    <div className="p-6 rounded-lg bg-white shadow-md text-deepTealBlue">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-base leading-relaxed">
        This is your central hub for managing users, subcontractors, and other building operations.
        Use the sidebar to navigate between sections. Everything you need is just a click away.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded-md bg-neutralWhite shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-sm">View and manage all registered residents and administrators.</p>
        </div>

        <div className="p-4 border rounded-md bg-neutralWhite shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Subcontractors</h2>
          <p className="text-sm">Track and assign building maintenance subcontractors.</p>
        </div>
      </div>
    </div>
  );
}