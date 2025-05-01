import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      data-testid="home-page"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h1
          className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          data-testid="home-title"
        >
          Take control of your <span className="text-blue-600">finances</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500" data-testid="home-subtitle">
          Track your spending, set budgets, and achieve your financial goals
          with our easy-to-use finance tracker.
        </p>

        <div className="mt-10 flex justify-center gap-x-6">
          <Link href="/register" data-testid="get-started-link">
            <Button size="lg" testId="get-started-button">
              Get Started
            </Button>
          </Link>
          <Link href="/login" data-testid="login-link">
            <Button variant="secondary" size="lg" testId="login-button">
              Login
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 w-full">
        <h2
          className="text-center text-3xl font-bold"
          data-testid="features-title"
        >
          Key Features
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            className="rounded-lg bg-white p-6 shadow"
            data-testid="feature-1"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              Track Transactions
            </h3>
            <p className="mt-2 text-gray-600">
              Easily record and categorize your income and expenses to
              understand your spending habits.
            </p>
          </div>
          <div
            className="rounded-lg bg-white p-6 shadow"
            data-testid="feature-2"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              Budget Management
            </h3>
            <p className="mt-2 text-gray-600">
              Create and manage budgets for different categories to keep your
              spending in check.
            </p>
          </div>
          <div
            className="rounded-lg bg-white p-6 shadow"
            data-testid="feature-3"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              Financial Goals
            </h3>
            <p className="mt-2 text-gray-600">
              Set savings goals and track your progress towards achieving them
              over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
