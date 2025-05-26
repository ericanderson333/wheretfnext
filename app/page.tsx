import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-primary">
            WhereTFNext
          </h1>
          <p className="text-xl text-text">
            Plan your next destination with friends after your party
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link href="/create-poll" className="card group">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary group-hover:text-secondary transition-colors">
                Create a Poll
              </h2>
              <p className="text-text">
                Start a new poll to decide where to go next. Share it with your friends via text or QR code.
              </p>
            </div>
          </Link>

          <Link href="/join-poll" className="card group">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary group-hover:text-secondary transition-colors">
                Join a Poll
              </h2>
              <p className="text-text">
                Received a poll link? Join in and vote for your favorite spot.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-text/60">
            Made with ❤️ for party planners everywhere
          </p>
        </div>
      </div>
    </main>
  )
} 