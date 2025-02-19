'use client'

import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { withAuth } from '@/components/withAuth'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
]

const stats = [
  {
    title: 'Total Users',
    value: '8,249',
    change: '+20.1%',
    trend: 'up',
  },
  {
    title: 'Active Sessions',
    value: '1,423',
    change: '+12.5%',
    trend: 'up',
  },
  {
    title: 'Conversion Rate',
    value: '24.5%',
    change: '-3.2%',
    trend: 'down',
  },
  {
    title: 'Avg. Session Duration',
    value: '4m 12s',
    change: '+8.4%',
    trend: 'up',
  },
]

function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span
                  className={`text-sm ${
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Monthly Activity</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default withAuth(DashboardPage)
