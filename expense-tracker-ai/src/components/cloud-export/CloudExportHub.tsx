'use client';

import { useState } from 'react';
import { 
  X, Cloud, Send, History, Share2, Zap, Settings, 
  FileText, Table, PieChart, Receipt, Clock, CheckCircle, 
  AlertCircle, Users, Link2, QrCode, Download, Upload,
  Globe, Smartphone, Monitor, RefreshCw, Star, ArrowRight
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Expense } from '@/types';

interface CloudExportHubProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  popular: boolean;
  category: 'finance' | 'compliance' | 'analytics';
}

interface CloudService {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  status: 'active' | 'syncing' | 'error';
}

interface ExportHistory {
  id: string;
  template: string;
  destination: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
  recipients?: string[];
  size: string;
}

export default function CloudExportHub({ isOpen, onClose, expenses }: CloudExportHubProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'templates' | 'integrations' | 'history' | 'sharing'>('quick');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const templates: ExportTemplate[] = [
    { id: 'tax-report', name: 'Tax Report', description: 'IRS-ready expense categorization', icon: Receipt, popular: true, category: 'compliance' },
    { id: 'monthly-summary', name: 'Monthly Summary', description: 'Executive dashboard view', icon: PieChart, popular: true, category: 'analytics' },
    { id: 'budget-analysis', name: 'Budget Analysis', description: 'Variance and trend analysis', icon: FileText, popular: false, category: 'analytics' },
    { id: 'audit-trail', name: 'Audit Trail', description: 'Complete transaction history', icon: History, popular: false, category: 'compliance' },
    { id: 'expense-forecast', name: 'Expense Forecast', description: 'AI-powered spending predictions', icon: Zap, popular: true, category: 'analytics' },
    { id: 'team-report', name: 'Team Report', description: 'Multi-user expense breakdown', icon: Users, popular: false, category: 'finance' }
  ];

  const cloudServices: CloudService[] = [
    { id: 'google-sheets', name: 'Google Sheets', icon: '📊', connected: true, lastSync: '2 minutes ago', status: 'active' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦', connected: true, lastSync: '1 hour ago', status: 'active' },
    { id: 'onedrive', name: 'OneDrive', icon: '☁️', connected: false, status: 'active' },
    { id: 'notion', name: 'Notion', icon: '📝', connected: true, lastSync: '5 minutes ago', status: 'syncing' },
    { id: 'slack', name: 'Slack', icon: '💬', connected: true, lastSync: '1 day ago', status: 'active' },
    { id: 'zapier', name: 'Zapier', icon: '⚡', connected: false, status: 'active' }
  ];

  const exportHistory: ExportHistory[] = [
    { id: '1', template: 'Monthly Summary', destination: 'Google Sheets', timestamp: '2025-08-19T10:30:00Z', status: 'completed', size: '2.4 MB' },
    { id: '2', template: 'Tax Report', destination: 'Email', timestamp: '2025-08-18T14:15:00Z', status: 'completed', recipients: ['accountant@company.com'], size: '1.8 MB' },
    { id: '3', template: 'Budget Analysis', destination: 'Slack', timestamp: '2025-08-17T09:00:00Z', status: 'processing', size: '3.1 MB' },
    { id: '4', template: 'Team Report', destination: 'Notion', timestamp: '2025-08-16T16:45:00Z', status: 'failed', size: '4.2 MB' }
  ];

  const handleQuickExport = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Export Hub</h2>
                <p className="text-gray-600">Share and sync your data everywhere</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">All systems operational</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 px-8">
            {[
              { id: 'quick', label: 'Quick Export', icon: Zap },
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'integrations', label: 'Integrations', icon: Globe },
              { id: 'history', label: 'History', icon: History },
              { id: 'sharing', label: 'Sharing', icon: Share2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'quick' | 'templates' | 'integrations' | 'history' | 'sharing')}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'quick' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Export</h3>
                  <p className="text-gray-600">Export {expenses.length} expenses instantly to your connected services</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cloudServices.filter(s => s.connected).map((service) => (
                    <div key={service.id} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{service.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600">Last sync: {service.lastSync}</p>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'active' ? 'bg-green-500' :
                          service.status === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                          'bg-red-500'
                        }`} />
                      </div>
                      <button
                        onClick={handleQuickExport}
                        disabled={isProcessing}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        <span>{isProcessing ? 'Exporting...' : 'Export Now'}</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="h-6 w-6 text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Smart Sync</h4>
                  </div>
                  <p className="text-gray-700 mb-4">Enable automatic syncing to keep all your services up-to-date in real-time.</p>
                  <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Enable Auto-Sync
                    </button>
                    <span className="text-sm text-gray-600">Updates every 15 minutes</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Export Templates</h3>
                    <p className="text-gray-600">Pre-configured reports for different use cases</p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Create Custom</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <div
                        key={template.id}
                        className={`p-6 border rounded-xl cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Icon className="h-5 w-5 text-gray-700" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                                <span>{template.name}</span>
                                {template.popular && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              </h4>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            template.category === 'finance' ? 'bg-green-100 text-green-700' :
                            template.category === 'compliance' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {template.category}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedTemplate && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4">Export Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors flex items-center space-x-3">
                        <Send className="h-5 w-5 text-blue-600" />
                        <span>Email Report</span>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors flex items-center space-x-3">
                        <Table className="h-5 w-5 text-green-600" />
                        <span>Google Sheets</span>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors flex items-center space-x-3">
                        <Download className="h-5 w-5 text-purple-600" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connected Services</h3>
                  <p className="text-gray-600">Manage your integrations and data flows</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cloudServices.map((service) => (
                    <div key={service.id} className="p-6 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{service.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            {service.connected && (
                              <p className="text-sm text-gray-600">Last sync: {service.lastSync}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            service.connected ? 
                              service.status === 'active' ? 'bg-green-500' :
                              service.status === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                              'bg-red-500'
                            : 'bg-gray-300'
                          }`} />
                          {service.connected ? (
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                              Configure
                            </button>
                          ) : (
                            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {service.connected && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Auto-sync</span>
                            <span className="text-green-600 font-medium">Enabled</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Data exported</span>
                            <span className="text-gray-900 font-medium">2.4 GB</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Automation Workflows</h4>
                  </div>
                  <p className="text-gray-700 mb-4">Create powerful automation workflows to sync data across all your tools.</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Workflow
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
                    <p className="text-gray-600">Track all your data exports and downloads</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Filter
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Export History
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600">
                      <span>Template</span>
                      <span>Destination</span>
                      <span>Date</span>
                      <span>Status</span>
                      <span>Size</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {exportHistory.map((item) => (
                      <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-5 gap-4 items-center">
                          <div>
                            <span className="font-medium text-gray-900">{item.template}</span>
                            {item.recipients && (
                              <p className="text-sm text-gray-600">To: {item.recipients.join(', ')}</p>
                            )}
                          </div>
                          <span className="text-gray-700">{item.destination}</span>
                          <span className="text-gray-600">{format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                          <div className="flex items-center space-x-2">
                            {item.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {item.status === 'processing' && <Clock className="h-4 w-4 text-yellow-500" />}
                            {item.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                            <span className={`text-sm capitalize ${
                              item.status === 'completed' ? 'text-green-700' :
                              item.status === 'processing' ? 'text-yellow-700' :
                              'text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <span className="text-gray-600">{item.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sharing' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Data</h3>
                  <p className="text-gray-600">Create shareable links, QR codes, and collaborative access</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Shareable Links */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Link2 className="h-5 w-5" />
                      <span>Shareable Links</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Public Dashboard</span>
                          <button className="text-sm text-blue-600 hover:text-blue-700">Generate</button>
                        </div>
                        <p className="text-xs text-gray-600">Read-only access to expense summaries</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Team Report</span>
                          <button className="text-sm text-blue-600 hover:text-blue-700">Generate</button>
                        </div>
                        <p className="text-xs text-gray-600">Collaborative workspace for team members</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Codes */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <QrCode className="h-5 w-5" />
                      <span>QR Code Access</span>
                    </h4>
                    <div className="text-center p-8 border border-gray-200 rounded-lg">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Scan to access mobile-optimized expense view</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Generate QR Code
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collaboration Features */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Team Collaboration</h4>
                  </div>
                  <p className="text-gray-700 mb-4">Invite team members to collaborate on expense analysis and reporting.</p>
                  <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Invite Team
                    </button>
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Real-time collaboration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Mobile access</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Data processed: {expenses.length} expenses</span>
                <span>•</span>
                <span>Last backup: {format(subDays(new Date(), 1), 'MMM dd, HH:mm')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors">
                  Schedule Export
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Export Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}