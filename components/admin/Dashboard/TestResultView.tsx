'use client'
import { useState } from 'react'
import { X, Download, BarChart3, PieChart, Target, BookOpen, Calendar, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts'
import { PsychometricTestResult } from '@/lib/admin/adminApi'

interface TestResultsViewProps {
  testResult: PsychometricTestResult | null
  userName: string
  userEmail: string
  loading: boolean
  onClose: () => void
}

const COLORS = ['#8B4513', '#D4AF37', '#8B7355', '#E8DDD1', '#A0522D', '#CD853F']

export default function TestResultsView({ testResult, userName, userEmail, loading, onClose }: TestResultsViewProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    if (!testResult) return
    
    setDownloading(true)
    try {
      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf')
      
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      let yPosition = margin
      
      // Helper function to add text with automatic page breaks
      const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: string = '#000000') => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }
        
        pdf.setFontSize(fontSize)
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
        pdf.setTextColor(color)
        
        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
        pdf.text(lines, margin, yPosition)
        yPosition += lines.length * fontSize * 0.5 + 5
        
        return yPosition
      }
      
      // Helper function to add section divider
      const addSectionDivider = () => {
        yPosition += 5
        pdf.setDrawColor(139, 69, 19) // Primary color
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10
      }
      
      // Title
      pdf.setFillColor(139, 69, 19)
      pdf.rect(0, 0, pageWidth, 40, 'F')
      pdf.setTextColor('#FFFFFF')
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text('PSYCHOMETRIC ASSESSMENT REPORT', pageWidth/2, 25, { align: 'center' })
      
      yPosition = 50
      
      // Student Information
      pdf.setTextColor('#000000')
      addText('STUDENT INFORMATION', 14, true, '#8B4513')
      addText(`Name: ${userName}`)
      addText(`Email: ${userEmail}`)
      addText(`Test Completion Date: ${new Date(testResult.completedAt).toLocaleDateString()}`)
      addText(`Report Generated: ${new Date().toLocaleDateString()}`)
      addText(`Test Status: ${testResult.isValid ? 'Valid' : 'Invalid'}`)
      
      addSectionDivider()
      
      // Section A - Interests
      addText('SECTION A - INTERESTS (HOLLAND CODE ANALYSIS)', 14, true, '#8B4513')
      addText(`Holland Code: ${testResult.sections.interests.hollandCode}`, 12, true)
      addText('')
      addText('Interest Scores:', 11, true)
      addText(`• Realistic (Doers): ${testResult.sections.interests.realistic}`)
      addText(`• Investigative (Thinkers): ${testResult.sections.interests.investigative}`)
      addText(`• Artistic (Creators): ${testResult.sections.interests.artistic}`)
      addText(`• Social (Helpers): ${testResult.sections.interests.social}`)
      addText(`• Enterprising (Persuaders): ${testResult.sections.interests.enterprising}`)
      addText(`• Conventional (Organizers): ${testResult.sections.interests.conventional}`)
      
      addSectionDivider()
      
      // Section B - Personality Profile
      addText('SECTION B - PERSONALITY PROFILE', 14, true, '#8B4513')
      addText('Brain Quadrant Scores:', 11, true)
      addText(`• L1 (Analyst & Realist): ${testResult.sections.personality.L1}%`)
      addText(`• L2 (Conservative & Organizer): ${testResult.sections.personality.L2}%`)
      addText(`• R1 (Strategist & Imaginative): ${testResult.sections.personality.R1}%`)
      addText(`• R2 (Socializer & Empathic): ${testResult.sections.personality.R2}%`)
      addText('')
      addText(`Dominant Quadrants: ${testResult.sections.personality.dominantQuadrants.join(', ') || 'None specified'}`)
      addText(`Personality Types: ${testResult.sections.personality.personalityTypes.join(', ') || 'None specified'}`)
      
      addSectionDivider()
      
      // Section C - Employability
      addText('SECTION C - EMPLOYABILITY ASSESSMENT', 14, true, '#8B4513')
      addText(`Employability Quotient: ${testResult.sections.employability.quotient}/10`, 12, true)
      addText('')
      addText('Individual Scores:', 11, true)
      addText(`• Self Management: ${testResult.sections.employability.selfManagement}`)
      addText(`• Team Work: ${testResult.sections.employability.teamWork}`)
      addText(`• Enterprising: ${testResult.sections.employability.enterprising}`)
      addText(`• Problem Solving: ${testResult.sections.employability.problemSolving}`)
      addText(`• Speaking & Listening: ${testResult.sections.employability.speakingListening}`)
      
      addSectionDivider()
      
      // Section D - Character Strengths & Values
      addText('SECTION D - CHARACTER STRENGTHS & VALUES', 14, true, '#8B4513')
      
      if (testResult.sections.characterStrengths.userResponses?.whatYouLike) {
        addText('USER\'S DIRECT RESPONSES:', 11, true)
        addText(`What You Like: ${testResult.sections.characterStrengths.userResponses.whatYouLike}`)
      }
      
      if (testResult.sections.characterStrengths.userResponses?.whatYouAreGoodAt) {
        addText(`What You Are Good At: ${testResult.sections.characterStrengths.userResponses.whatYouAreGoodAt}`)
      }
      
      if (testResult.sections.characterStrengths.userResponses?.recentProjects) {
        addText(`Recent Projects: ${testResult.sections.characterStrengths.userResponses.recentProjects}`)
      }
      
      if (testResult.sections.characterStrengths.top3Strengths.length > 0) {
        addText('')
        addText('Character Strengths:', 11, true)
        testResult.sections.characterStrengths.top3Strengths.forEach((strength, index) => {
          addText(`${index + 1}. ${strength}`)
        })
      }
      
      if (testResult.sections.characterStrengths.values.length > 0) {
        addText('')
        addText('Values in Life:', 11, true)
        testResult.sections.characterStrengths.values.forEach((value, index) => {
          addText(`${index + 1}. ${value}`)
        })
      }
      
      // Footer
      yPosition += 20
      pdf.setFontSize(8)
      pdf.setTextColor('#666666')
      pdf.text('This report is generated by MentorMatch Psychometric Assessment System', pageWidth/2, pageHeight - 20, { align: 'center' })
      pdf.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth/2, pageHeight - 10, { align: 'center' })
      
      // Generate filename and download
      const fileName = `${userName.replace(/\s+/g, '_')}_psychometric_results_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const generateTextReport = (result: PsychometricTestResult, name: string): string => {
    const hollandCode = result.sections.interests.hollandCode || 'N/A'
    
    return `
COMPREHENSIVE PSYCHOMETRIC ASSESSMENT REPORT
============================================

Student Name: ${name}
Email: ${userEmail}
Test Completion Date: ${new Date(result.completedAt).toLocaleDateString()}
Report Generated: ${new Date().toLocaleDateString()}
Test Status: ${result.isValid ? 'Valid' : 'Invalid'}

SECTION A - INTERESTS (HOLLAND CODE ANALYSIS)
=============================================

Holland Code: ${hollandCode}

Interest Scores:
- Realistic (Doers): ${result.sections.interests.realistic}
- Investigative (Thinkers): ${result.sections.interests.investigative}
- Artistic (Creators): ${result.sections.interests.artistic}
- Social (Helpers): ${result.sections.interests.social}
- Enterprising (Persuaders): ${result.sections.interests.enterprising}
- Conventional (Organizers): ${result.sections.interests.conventional}

SECTION B - PERSONALITY PROFILE
===============================

Brain Quadrant Scores:
- L1 (Analyst & Realist): ${result.sections.personality.L1}%
- L2 (Conservative & Organizer): ${result.sections.personality.L2}%
- R1 (Strategist & Imaginative): ${result.sections.personality.R1}%
- R2 (Socializer & Empathic): ${result.sections.personality.R2}%

Dominant Quadrants: ${result.sections.personality.dominantQuadrants.join(', ') || 'None specified'}
Personality Types: ${result.sections.personality.personalityTypes.join(', ') || 'None specified'}

SECTION C - EMPLOYABILITY ASSESSMENT
====================================

Employability Quotient: ${result.sections.employability.quotient}/10

Individual Scores:
- Self Management: ${result.sections.employability.selfManagement}
- Team Work: ${result.sections.employability.teamWork}
- Enterprising: ${result.sections.employability.enterprising}
- Problem Solving: ${result.sections.employability.problemSolving}
- Speaking & Listening: ${result.sections.employability.speakingListening}

SECTION D - CHARACTER STRENGTHS & VALUES
========================================

USER'S DIRECT RESPONSES:
${result.sections.characterStrengths.userResponses?.whatYouLike ? 
`What You Like: ${result.sections.characterStrengths.userResponses.whatYouLike}` : ''}

${result.sections.characterStrengths.userResponses?.whatYouAreGoodAt ? 
`What You Are Good At: ${result.sections.characterStrengths.userResponses.whatYouAreGoodAt}` : ''}

${result.sections.characterStrengths.userResponses?.recentProjects ? 
`Recent Projects: ${result.sections.characterStrengths.userResponses.recentProjects}` : ''}

Character Strengths:
${result.sections.characterStrengths.top3Strengths.map((strength, index) => `${index + 1}. ${strength}`).join('\n')}

Values in Life:
${result.sections.characterStrengths.values.map((value, index) => `${index + 1}. ${value}`).join('\n')}

============================================
This report is generated by MentorMatch Psychometric Assessment System
Report Generated: ${new Date().toLocaleString()}
============================================
    `.trim()
  }

  const renderInterestsChart = () => {
    if (!testResult) return null
    
    const data = [
      { name: 'Realistic', value: testResult.sections.interests.realistic, color: COLORS[0] },
      { name: 'Investigative', value: testResult.sections.interests.investigative, color: COLORS[1] },
      { name: 'Artistic', value: testResult.sections.interests.artistic, color: COLORS[2] },
      { name: 'Social', value: testResult.sections.interests.social, color: COLORS[3] },
      { name: 'Enterprising', value: testResult.sections.interests.enterprising, color: COLORS[4] },
      { name: 'Conventional', value: testResult.sections.interests.conventional, color: COLORS[5] },
    ]

    return (
      <div className="mb-8 bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
          Section A - Interests (Holland Code: {testResult.sections.interests.hollandCode})
        </h3>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--legal-border)" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100} 
                tick={{ fill: 'var(--legal-dark-text)', fontSize: 12 }}
              />
              <YAxis tick={{ fill: 'var(--legal-dark-text)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--legal-bg-primary)', 
                  border: '1px solid var(--legal-border)',
                  borderRadius: '6px'
                }} 
              />
              <Legend />
              <Bar dataKey="value" fill="var(--legal-brown)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-background p-4 rounded border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Holland Code {testResult.sections.interests.hollandCode}</strong> represents your top career interest areas. 
            This combination suggests careers that blend these personality types for optimal job satisfaction.
          </p>
        </div>
      </div>
    )
  }

  const renderPersonalityChart = () => {
    if (!testResult) return null
    
    const data = [
      { name: 'L1 (Analyst & Realist)', value: testResult.sections.personality.L1, color: COLORS[0] },
      { name: 'L2 (Conservative & Organizer)', value: testResult.sections.personality.L2, color: COLORS[1] },
      { name: 'R1 (Strategist & Imaginative)', value: testResult.sections.personality.R1, color: COLORS[2] },
      { name: 'R2 (Socializer & Empathic)', value: testResult.sections.personality.R2, color: COLORS[3] },
    ]

    // Helper function to get career recommendations based on quadrant
    const getCareerRecommendations = (quadrant: string): string[] => {
      const careerMap: { [key: string]: string[] } = {
        'L1': ['Data Scientist', 'Retail', 'Engineer'],
        'L2': ['Bank Manager', 'IT — QA', 'Programmer', 'Accountant'],
        'R1': ['Diplomat', 'Artist', 'Politics', 'Designer'],
        'R2': ['Teacher', 'Nurse', 'Social Worker', 'Sales', 'Customer Service']
      }
      return careerMap[quadrant] || []
    }

    // Helper function to get suitable subjects based on quadrant
    const getSuitableSubjects = (quadrant: string): string[] => {
      const subjectMap: { [key: string]: string[] } = {
        'L1': ['Physics', 'Maths', 'Statistics', 'Engineering'],
        'L2': ['Commerce', 'Economics'],
        'R1': ['Arts', 'Business Administration', 'Political Science', 'Policy Making'],
        'R2': ['Sociology', 'Psychology']
      }
      return subjectMap[quadrant] || []
    }

    return (
      <div className="mb-8 bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <PieChart className="h-5 w-5 mr-2 text-primary" />
          Section B - Personality Profile
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ')[0]}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--legal-bg-primary)', 
                    border: '1px solid var(--legal-border)',
                    borderRadius: '6px'
                  }} 
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-background p-4 rounded border border-border">
              <h4 className="font-medium text-foreground mb-3">Dominant Quadrants:</h4>
              {testResult.sections.personality.dominantQuadrants.map((quadrant, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-foreground font-medium">{quadrant}</span>
                </div>
              ))}
            </div>
            <div className="bg-background p-4 rounded border border-border">
              <h4 className="font-medium text-foreground mb-3">Personality Types:</h4>
              {testResult.sections.personality.personalityTypes.map((type, index) => (
                <div key={index} className="text-sm text-muted-foreground mb-1">{type}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Career and Subject Recommendations */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-3 text-blue-800">Suitable Subjects</h4>
            <div className="space-y-2">
              {testResult.sections.personality.dominantQuadrants.flatMap(quadrant => 
                getSuitableSubjects(quadrant)
              ).slice(0, 6).map((subject, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-blue-700">{subject}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-3 text-green-800">Suitable Career Options</h4>
            <div className="space-y-2">
              {testResult.sections.personality.dominantQuadrants.flatMap(quadrant => 
                getCareerRecommendations(quadrant)
              ).slice(0, 6).map((career, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-700">{career}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderEmployabilitySection = () => {
    if (!testResult) return null
    
    return (
      <div className="mb-8 bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Target className="h-5 w-5 mr-2 text-primary" />
          Section C - Employability Quotient
        </h3>
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-amber-600 font-baskervville">{testResult.sections.employability.quotient}/10</div>
            <div className="text-sm text-amber-700 font-medium">Employability Quotient</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center bg-white p-4 rounded border border-amber-200">
              <div className="text-xl font-semibold text-amber-600">{testResult.sections.employability.selfManagement}</div>
              <div className="text-sm text-muted-foreground">Self Management</div>
            </div>
            <div className="text-center bg-white p-4 rounded border border-amber-200">
              <div className="text-xl font-semibold text-amber-600">{testResult.sections.employability.teamWork}</div>
              <div className="text-sm text-muted-foreground">Team Work</div>
            </div>
            <div className="text-center bg-white p-4 rounded border border-amber-200">
              <div className="text-xl font-semibold text-amber-600">{testResult.sections.employability.enterprising}</div>
              <div className="text-sm text-muted-foreground">Enterprising</div>
            </div>
            <div className="text-center bg-white p-4 rounded border border-amber-200">
              <div className="text-xl font-semibold text-amber-600">{testResult.sections.employability.problemSolving}</div>
              <div className="text-sm text-muted-foreground">Problem Solving</div>
            </div>
            <div className="text-center bg-white p-4 rounded border border-amber-200">
              <div className="text-xl font-semibold text-amber-600">{testResult.sections.employability.speakingListening}</div>
              <div className="text-sm text-muted-foreground">Speaking & Listening</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCharacterStrengths = () => {
    if (!testResult) return null
    
    return (
      <div className="mb-8 bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          Section D - Character Strengths & Values
        </h3>
        
        {/* User's Direct Responses */}
        <div className="mb-6 bg-primary/5 p-4 rounded-lg border border-primary/20">
          <h4 className="font-medium mb-4 text-primary">User's Direct Responses</h4>
          <div className="space-y-4">
            {testResult.sections.characterStrengths.userResponses?.whatYouLike && (
              <div className="bg-background p-3 rounded border border-border">
                <h5 className="font-medium text-foreground mb-2">What You Like:</h5>
                <p className="text-muted-foreground text-sm">{testResult.sections.characterStrengths.userResponses.whatYouLike}</p>
              </div>
            )}
            {testResult.sections.characterStrengths.userResponses?.whatYouAreGoodAt && (
              <div className="bg-background p-3 rounded border border-border">
                <h5 className="font-medium text-foreground mb-2">What You Are Good At:</h5>
                <p className="text-muted-foreground text-sm">{testResult.sections.characterStrengths.userResponses.whatYouAreGoodAt}</p>
              </div>
            )}
            {testResult.sections.characterStrengths.userResponses?.recentProjects && (
              <div className="bg-background p-3 rounded border border-border">
                <h5 className="font-medium text-foreground mb-2">Recent Projects:</h5>
                <p className="text-muted-foreground text-sm">{testResult.sections.characterStrengths.userResponses.recentProjects}</p>
              </div>
            )}
          </div>
        </div>

        {/* Analyzed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testResult.sections.characterStrengths.top3Strengths.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium mb-3 text-purple-800">Character Strengths</h4>
              <ul className="space-y-2">
                {testResult.sections.characterStrengths.top3Strengths.map((strength, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-purple-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {testResult.sections.characterStrengths.values.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium mb-3 text-green-800">Values in Life</h4>
              <ul className="space-y-2">
                {testResult.sections.characterStrengths.values.map((value, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-700">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-background rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-border">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold gradient-text font-baskervville">
              Psychometric Test Results
            </h2>
            <p className="text-muted-foreground mt-1 flex items-center">
              <span>{userName}</span>
              <span className="mx-2">•</span>
              <span>{userEmail}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              disabled={!testResult || downloading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading test results...</span>
            </div>
          ) : testResult ? (
            <div className="space-y-8">
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-primary mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-muted-foreground">Completed At:</span>
                    <span className="ml-2 text-foreground font-medium">
                      {new Date(testResult.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Test Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      testResult.isValid 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {testResult.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </div>
              </div>

              {renderInterestsChart()}
              {renderPersonalityChart()}
              {renderEmployabilitySection()}
              {renderCharacterStrengths()}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Test Results Found</h3>
              <p className="text-muted-foreground">
                No psychometric test results are available for this user.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}