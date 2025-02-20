import Link from "next/link";
import { FaSolarPanel, FaFileUpload, FaChartLine, FaBell } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Smart Energy Monitoring for Your Home
          </h1>
          <p className="text-lg text-gray-600">
            Track and optimize your energy consumption with data-driven insights
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Track Usage</h3>
            <p className="text-gray-600">
              Monitor your daily energy consumption with easy manual input or CSV uploads
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Get Insights</h3>
            <p className="text-gray-600">
              View detailed analytics and identify energy consumption patterns
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Save Energy</h3>
            <p className="text-gray-600">
              Receive personalized recommendations to reduce energy waste
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-12 text-center">
          Simple Three-Step Process
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <Step
            number="01"
            title="Create Account"
            description="Set up your household profile in minutes"
          />
          <Step
            number="02"
            title="Input Data"
            description="Add your energy readings manually or via CSV"
          />
          <Step
            number="03"
            title="Monitor"
            description="Track usage and get optimization tips"
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16 border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Why Use Our Platform?
            </h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-1 bg-blue-600 rounded"></div>
                <div>
                  <h3 className="font-medium text-gray-900">Reduce Costs</h3>
                  <p className="text-gray-600">Lower your energy bills through data-driven decisions</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1 bg-blue-600 rounded"></div>
                <div>
                  <h3 className="font-medium text-gray-900">Environmental Impact</h3>
                  <p className="text-gray-600">Minimize your carbon footprint with efficient energy use</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1 bg-blue-600 rounded"></div>
                <div>
                  <h3 className="font-medium text-gray-900">Easy to Use</h3>
                  <p className="text-gray-600">Intuitive interface designed for everyone</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Key Features
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Real-time energy monitoring</li>
              <li>• Customizable alerts</li>
              <li>• Usage trend analysis</li>
              <li>• CSV data import/export</li>
              <li>• Secure cloud storage</li>
              <li>• Mobile-friendly interface</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-blue-600 font-mono text-xl font-medium mb-4">
        {number}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
