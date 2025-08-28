import { useState, useCallback } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Navigation from '../components/Navigation'
import AddLaptopQuery from '../components/AddLaptopQuery'
import ListSection from '../components/ListSection'
import ResolvedSection from '../components/ResolvedSection'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'resolved'>('add')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTabChange = (tab: 'add' | 'list' | 'resolved') => {
    setActiveTab(tab)
  }

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'add':
        return <AddLaptopQuery onQueryAdded={handleRefresh} />
      case 'list':
        return <ListSection key={refreshKey} onQueryUpdated={handleRefresh} />
      case 'resolved':
        return <ResolvedSection key={refreshKey} />
      default:
        return <AddLaptopQuery onQueryAdded={handleRefresh} />
    }
  }

  return (
    <>
      <Head>
        <title>TechFix Pro - Laptop Repair Management System</title>
        <meta name="description" content="Professional laptop repair management with advanced tracking and resolution features" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-96 h-96 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-full blur-3xl pulse-glow"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-6xl md:text-7xl font-extrabold gradient-text mb-8 leading-tight tracking-tight">
                Welcome to TechFix Pro
              </h2>
              <p className="text-2xl md:text-3xl text-gray-700 max-w-5xl mx-auto mb-12 leading-relaxed font-medium">
                Experience the future of laptop repair management with our intelligent tracking system. 
                Submit queries, monitor progress, and achieve resolutions with unprecedented efficiency.
              </p>
            </div>
          </div>
        </div>

        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className="space-y-8">
          {renderContent()}
        </div>
      </Layout>
    </>
  )
}