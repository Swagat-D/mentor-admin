// components/admin/Dashboard/Settings.tsx
import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Eye, 
  EyeOff, 
  Bell,
  Shield,
  DollarSign,
  RefreshCw,
  Check,
  AlertTriangle,
  Info,
  Users,
  Mail,
  Globe,
  Database,
  Activity,
  BarChart3,
  Clock,
  Zap,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface SettingsData {
  platform: {
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    requireEmailVerification: boolean;
    autoApproveStudents: boolean;
    maxSessionDuration: number;
    sessionBuffer: number;
  };
  payments: {
    platformFeePercentage: number;
    minimumPayout: number;
    payoutSchedule: 'weekly' | 'monthly';
    currency: string;
    taxCalculation: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    adminAlerts: boolean;
    paymentAlerts: boolean;
    verificationAlerts: boolean;
    systemAlerts: boolean;
    lowBalanceAlert: number;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireTwoFactor: boolean;
    passwordExpiry: number;
    ipWhitelist: boolean;
  };
  automation: {
    autoVerifyMentors: boolean;
    autoSendReminders: boolean;
    autoArchiveOldSessions: boolean;
    autoGenerateReports: boolean;
    reportFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('platform');
  const [settings, setSettings] = useState<SettingsData>({
    platform: {
      maintenanceMode: false,
      allowRegistrations: true,
      requireEmailVerification: true,
      autoApproveStudents: true,
      maxSessionDuration: 120,
      sessionBuffer: 15,
    },
    payments: {
      platformFeePercentage: 15,
      minimumPayout: 50,
      payoutSchedule: 'weekly',
      currency: 'USD',
      taxCalculation: true,
    },
    notifications: {
      emailNotifications: true,
      adminAlerts: true,
      paymentAlerts: true,
      verificationAlerts: true,
      systemAlerts: true,
      lowBalanceAlert: 100,
    },
    security: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      requireTwoFactor: false,
      passwordExpiry: 90,
      ipWhitelist: false,
    },
    automation: {
      autoVerifyMentors: false,
      autoSendReminders: true,
      autoArchiveOldSessions: true,
      autoGenerateReports: true,
      reportFrequency: 'weekly',
    }
  });

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['platform']));
  const [hasChanges, setHasChanges] = useState(false);

  const sections = [
    { 
      id: 'platform', 
      label: 'Platform Control', 
      icon: SettingsIcon,
      description: 'Core platform settings and user management',
      color: 'text-blue-600'
    },
    { 
      id: 'payments', 
      label: 'Revenue & Payments', 
      icon: DollarSign,
      description: 'Fee structure and payout configuration',
      color: 'text-green-600'
    },
    { 
      id: 'notifications', 
      label: 'Alert System', 
      icon: Bell,
      description: 'Configure when and how you get notified',
      color: 'text-orange-600'
    },
    { 
      id: 'security', 
      label: 'Security & Access', 
      icon: Shield,
      description: 'Login security and access controls',
      color: 'text-red-600'
    },
    { 
      id: 'automation', 
      label: 'Smart Automation', 
      icon: Zap,
      description: 'Automate routine tasks and workflows',
      color: 'text-purple-600'
    },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Load from API
      const savedTime = localStorage.getItem('adminSettingsLastSaved');
      if (savedTime) {
        setLastSaved(new Date(savedTime));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save to API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const now = new Date();
      setLastSaved(now);
      localStorage.setItem('adminSettingsLastSaved', now.toISOString());
      setHasChanges(false);
      
      // Show success toast
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const QuickToggle = ({ 
    label, 
    description, 
    checked, 
    onChange, 
    icon: Icon,
    critical = false 
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: any;
    critical?: boolean;
  }) => (
    <div className={`p-4 border rounded-lg transition-all duration-200 ${
      checked 
        ? (critical ? 'border-red-200 bg-red-50/50' : 'border-green-200 bg-green-50/50')
        : 'border-border bg-card hover:bg-muted/50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {Icon && (
            <div className={`p-2 rounded-lg ${
              checked 
                ? (critical ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')
                : 'bg-muted text-muted-foreground'
            }`}>
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm sm:text-base">{label}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer ml-3 flex-shrink-0">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className={`w-11 h-6 rounded-full peer transition-all duration-200 ${
            checked 
              ? (critical ? 'bg-red-500' : 'bg-green-500')
              : 'bg-gray-300'
          } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-opacity-20 ${
            checked 
              ? (critical ? 'peer-focus:ring-red-300' : 'peer-focus:ring-green-300')
              : 'peer-focus:ring-gray-300'
          } relative`}>
            <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </div>
        </label>
      </div>
    </div>
  );

  const NumberInput = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    suffix = '',
    description 
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    suffix?: string;
    description?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || min)}
          min={min}
          max={max}
          className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  const SelectInput = ({ 
    label, 
    value, 
    onChange, 
    options, 
    description 
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    description?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-baskervville">Platform Settings</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Configure your platform quickly and efficiently
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
              hasChanges 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            } disabled:opacity-50`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{hasChanges ? 'Save Changes' : 'All Saved'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${
          settings.platform.maintenanceMode 
            ? 'border-red-200 bg-red-50' 
            : 'border-green-200 bg-green-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Activity className={`h-5 w-5 ${
              settings.platform.maintenanceMode ? 'text-red-600' : 'text-green-600'
            }`} />
            <div>
              <div className="font-medium text-sm">Platform Status</div>
              <div className={`text-xs ${
                settings.platform.maintenanceMode ? 'text-red-600' : 'text-green-600'
              }`}>
                {settings.platform.maintenanceMode ? 'Maintenance Mode' : 'Live & Active'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-sm">Platform Fee</div>
              <div className="text-xs text-muted-foreground">
                {settings.payments.platformFeePercentage}% per transaction
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-600" />
            <div>
              <div className="font-medium text-sm">Notifications</div>
              <div className="text-xs text-muted-foreground">
                {Object.values(settings.notifications).filter(Boolean).length} active alerts
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-medium text-sm">Automation</div>
              <div className="text-xs text-muted-foreground">
                {Object.values(settings.automation).filter(Boolean).length} active rules
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {sections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <div key={section.id} className="bg-card rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className={`p-2 sm:p-3 rounded-lg bg-muted ${section.color}`}>
                    <section.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-semibold font-baskervville">
                      {section.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {hasChanges && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <div className="pt-4 border-t border-border">
                    {/* Platform Settings */}
                    {section.id === 'platform' && (
                      <div className="space-y-4">
                        <QuickToggle
                          label="Maintenance Mode"
                          description="Temporarily disable platform for maintenance. Users will see a maintenance page."
                          checked={settings.platform.maintenanceMode}
                          onChange={(checked) => updateSetting('platform', 'maintenanceMode', checked)}
                          icon={AlertTriangle}
                          critical={true}
                        />
                        
                        <QuickToggle
                          label="Allow New Registrations"
                          description="Enable new users to sign up for accounts on your platform."
                          checked={settings.platform.allowRegistrations}
                          onChange={(checked) => updateSetting('platform', 'allowRegistrations', checked)}
                          icon={Users}
                        />
                        
                        <QuickToggle
                          label="Require Email Verification"
                          description="New users must verify their email address before accessing the platform."
                          checked={settings.platform.requireEmailVerification}
                          onChange={(checked) => updateSetting('platform', 'requireEmailVerification', checked)}
                          icon={Mail}
                        />
                        
                        <QuickToggle
                          label="Auto-Approve Students"
                          description="Automatically approve student accounts without manual review."
                          checked={settings.platform.autoApproveStudents}
                          onChange={(checked) => updateSetting('platform', 'autoApproveStudents', checked)}
                          icon={Check}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <NumberInput
                            label="Max Session Duration"
                            value={settings.platform.maxSessionDuration}
                            onChange={(value) => updateSetting('platform', 'maxSessionDuration', value)}
                            min={30}
                            max={240}
                            suffix="min"
                            description="Maximum length for a single mentoring session"
                          />
                          
                          <NumberInput
                            label="Session Buffer Time"
                            value={settings.platform.sessionBuffer}
                            onChange={(value) => updateSetting('platform', 'sessionBuffer', value)}
                            min={5}
                            max={60}
                            suffix="min"
                            description="Buffer time between consecutive sessions"
                          />
                        </div>
                      </div>
                    )}

                    {/* Payment Settings */}
                    {section.id === 'payments' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <NumberInput
                            label="Platform Fee"
                            value={settings.payments.platformFeePercentage}
                            onChange={(value) => updateSetting('payments', 'platformFeePercentage', value)}
                            min={1}
                            max={50}
                            suffix="%"
                            description="Commission charged per successful session"
                          />
                          
                          <NumberInput
                            label="Minimum Payout"
                            value={settings.payments.minimumPayout}
                            onChange={(value) => updateSetting('payments', 'minimumPayout', value)}
                            min={10}
                            max={500}
                            suffix="USD"
                            description="Minimum amount before payouts are processed"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SelectInput
                            label="Payout Schedule"
                            value={settings.payments.payoutSchedule}
                            onChange={(value) => updateSetting('payments', 'payoutSchedule', value)}
                            options={[
                              { value: 'weekly', label: 'Weekly (Fridays)' },
                              { value: 'monthly', label: 'Monthly (1st of month)' }
                            ]}
                            description="How often mentors receive their earnings"
                          />
                          
                          <SelectInput
                            label="Currency"
                            value={settings.payments.currency}
                            onChange={(value) => updateSetting('payments', 'currency', value)}
                            options={[
                              { value: 'USD', label: 'USD - US Dollar' },
                              { value: 'EUR', label: 'EUR - Euro' },
                              { value: 'GBP', label: 'GBP - British Pound' },
                              { value: 'INR', label: 'INR - Indian Rupee' }
                            ]}
                          />
                        </div>
                        
                        <QuickToggle
                          label="Automatic Tax Calculation"
                          description="Calculate and apply taxes based on user location and local regulations."
                          checked={settings.payments.taxCalculation}
                          onChange={(checked) => updateSetting('payments', 'taxCalculation', checked)}
                          icon={BarChart3}
                        />
                      </div>
                    )}

                    {/* Notifications */}
                    {section.id === 'notifications' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <QuickToggle
                            label="Email Notifications"
                            description="Receive important updates via email"
                            checked={settings.notifications.emailNotifications}
                            onChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                            icon={Mail}
                          />
                          
                          <QuickToggle
                            label="Admin Alerts"
                            description="Critical platform issues and urgent matters"
                            checked={settings.notifications.adminAlerts}
                            onChange={(checked) => updateSetting('notifications', 'adminAlerts', checked)}
                            icon={AlertTriangle}
                          />
                          
                          <QuickToggle
                            label="Payment Alerts"
                            description="Failed payments, refunds, and payout notifications"
                            checked={settings.notifications.paymentAlerts}
                            onChange={(checked) => updateSetting('notifications', 'paymentAlerts', checked)}
                            icon={DollarSign}
                          />
                          
                          <QuickToggle
                            label="Verification Alerts"
                            description="New mentor applications requiring review"
                            checked={settings.notifications.verificationAlerts}
                            onChange={(checked) => updateSetting('notifications', 'verificationAlerts', checked)}
                            icon={Shield}
                          />
                        </div>
                        
                        <NumberInput
                          label="Low Balance Alert"
                          value={settings.notifications.lowBalanceAlert}
                          onChange={(value) => updateSetting('notifications', 'lowBalanceAlert', value)}
                          min={50}
                          max={1000}
                          suffix="USD"
                          description="Get notified when platform balance drops below this amount"
                        />
                      </div>
                    )}

                    {/* Security */}
                    {section.id === 'security' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <NumberInput
                            label="Session Timeout"
                            value={settings.security.sessionTimeout}
                            onChange={(value) => updateSetting('security', 'sessionTimeout', value)}
                            min={15}
                            max={480}
                            suffix="min"
                            description="Auto-logout inactive admin sessions"
                          />
                          
                          <NumberInput
                            label="Max Login Attempts"
                            value={settings.security.maxLoginAttempts}
                            onChange={(value) => updateSetting('security', 'maxLoginAttempts', value)}
                            min={3}
                            max={10}
                            description="Lock account after failed attempts"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <QuickToggle
                            label="Two-Factor Authentication"
                            description="Require 2FA for all admin accounts (highly recommended)"
                            checked={settings.security.requireTwoFactor}
                            onChange={(checked) => updateSetting('security', 'requireTwoFactor', checked)}
                            icon={Shield}
                          />
                          
                          <QuickToggle
                            label="IP Whitelist"
                            description="Restrict admin access to specific IP addresses"
                            checked={settings.security.ipWhitelist}
                            onChange={(checked) => updateSetting('security', 'ipWhitelist', checked)}
                            icon={Globe}
                          />
                        </div>
                      </div>
                    )}

                    {/* Automation */}
                    {section.id === 'automation' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <QuickToggle
                            label="Auto-Verify Mentors"
                            description="Automatically approve mentor applications that meet criteria"
                            checked={settings.automation.autoVerifyMentors}
                            onChange={(checked) => updateSetting('automation', 'autoVerifyMentors', checked)}
                            icon={Check}
                          />
                          
                          <QuickToggle
                            label="Auto Send Reminders"
                            description="Send session reminders and follow-ups automatically"
                            checked={settings.automation.autoSendReminders}
                            onChange={(checked) => updateSetting('automation', 'autoSendReminders', checked)}
                            icon={Bell}
                          />
                          
                          <QuickToggle
                            label="Auto Archive Sessions"
                            description="Move completed sessions to archive after 30 days"
                            checked={settings.automation.autoArchiveOldSessions}
                            onChange={(checked) => updateSetting('automation', 'autoArchiveOldSessions', checked)}
                            icon={Database}
                          />
                          
                          <QuickToggle
                            label="Auto Generate Reports"
                            description="Create and email platform reports automatically"
                            checked={settings.automation.autoGenerateReports}
                            onChange={(checked) => updateSetting('automation', 'autoGenerateReports', checked)}
                            icon={BarChart3}
                          />
                        </div>
                        
                        {settings.automation.autoGenerateReports && (
                          <SelectInput
                            label="Report Frequency"
                            value={settings.automation.reportFrequency}
                            onChange={(value) => updateSetting('automation', 'reportFrequency', value)}
                            options={[
                              { value: 'daily', label: 'Daily Reports' },
                              { value: 'weekly', label: 'Weekly Reports' },
                              { value: 'monthly', label: 'Monthly Reports' }
                            ]}
                            description="How often to generate and send automated reports"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      {hasChanges && (
        <div className="sticky bottom-4 sm:bottom-6 z-10">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  You have unsaved changes
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                {saving ? 'Saving...' : 'Save Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}