"use client"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useAuthGuard } from "../hooks/useAuthGuard.jsx"
import DashboardLayout from "../components/layout/DashboardLayout.jsx"
import { formatDate } from "../utils/helpers.js"

const DashboardPage = () => {
  const { user } = useAuth()
  useAuthGuard({ requireAuth: true })

  const stats = [
    {
      title: "Total Orders",
      value: "24",
      change: "+12%",
      changeType: "positive",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Revenue",
      value: "$2,847",
      change: "+8%",
      changeType: "positive",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      title: "Products",
      value: "156",
      change: "+3%",
      changeType: "positive",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      title: "Customers",
      value: "89",
      change: "+15%",
      changeType: "positive",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
  ]

  const recentOrders = [
    { id: "#1234", customer: "John Doe", amount: "$129.99", status: "Completed", date: "2025-01-15" },
    { id: "#1235", customer: "Jane Smith", amount: "$89.50", status: "Processing", date: "2025-01-15" },
    { id: "#1236", customer: "Bob Johnson", amount: "$199.99", status: "Shipped", date: "2025-01-14" },
    { id: "#1237", customer: "Alice Brown", amount: "$59.99", status: "Pending", date: "2025-01-14" },
  ]

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success/10 text-success"
      case "processing":
        return "bg-warning/10 text-warning"
      case "shipped":
        return "bg-primary/10 text-primary"
      case "pending":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-background rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground mt-1">Here's what's happening with your store today.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last login</p>
              <p className="text-sm font-medium text-foreground">{formatDate(user?.last_synced_at)}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.changeType === "positive" ? "text-success" : "text-destructive"}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-primary">{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-background rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">View all</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id} className="border-b border-border last:border-b-0">
                    <td className="p-4 text-sm font-medium text-foreground">{order.id}</td>
                    <td className="p-4 text-sm text-foreground">{order.customer}</td>
                    <td className="p-4 text-sm font-medium text-foreground">{order.amount}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(order.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Add New Product</span>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="text-sm font-medium text-foreground">View All Orders</span>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Analytics</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-background rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Verified</span>
                <span className={`text-sm font-medium ${user?.is_verified ? "text-success" : "text-warning"}`}>
                  {user?.is_verified ? "Verified" : "Pending"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Type</span>
                <span className="text-sm font-medium text-foreground">{user?.is_admin ? "Administrator" : "User"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-foreground">{formatDate(user?.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Help Center</span>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-foreground">Contact Support</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
