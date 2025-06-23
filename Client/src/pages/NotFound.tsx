import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-deepTealBlue text-neutralWhite font-sans flex flex-col items-center justify-center p-6 sm:p-12">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <p className="text-xl mb-6">Oops! The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="inline-block bg-condoBlue hover:bg-blue-600 text-neutralWhite font-medium rounded-md py-2 px-6 transition"
      >
        Go Home
      </Link>
    </main>
  )
}