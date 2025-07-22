// lib/utils/pdfGenerator.ts
import { PsychometricTestResult } from '@/types/admin';

// This is a basic implementation. In a real app, you'd use libraries like jsPDF or react-pdf
export class PDFGenerator {
  static async generateTestResultsPDF(
    testResult: PsychometricTestResult, 
    userName: string
  ): Promise<Blob> {
    
    // For now, we'll create a comprehensive HTML content that can be converted to PDF
    // In production, you would use jsPDF, puppeteer, or a similar library
    
    const htmlContent = this.generateHTMLReport(testResult, userName);
    
    // Convert HTML to PDF (this would typically use a library like jsPDF)
    // For demonstration, we'll create a text file
    const textContent = this.generateTextReport(testResult, userName);
    
    return new Blob([textContent], { type: 'text/plain' });
  }

  private static generateHTMLReport(testResult: PsychometricTestResult, userName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Psychometric Test Results - ${userName}</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                margin: 40px; 
                color: #333; 
            }
            .header { 
                text-align: center; 
                border-bottom: 2px solid #3b82f6; 
                padding-bottom: 20px; 
                margin-bottom: 30px; 
            }
            .section { 
                margin-bottom: 30px; 
                page-break-inside: avoid; 
            }
            .section-title { 
                background: #3b82f6; 
                color: white; 
                padding: 10px; 
                margin-bottom: 15px; 
                font-size: 18px; 
                font-weight: bold; 
            }
            .chart-placeholder { 
                border: 2px dashed #ccc; 
                padding: 20px; 
                text-align: center; 
                margin: 15px 0; 
                background: #f9f9f9; 
            }
            .score-grid { 
                display: grid; 
                grid-template-columns: repeat(3, 1fr); 
                gap: 15px; 
                margin: 15px 0; 
            }
            .score-item { 
                text-align: center; 
                padding: 15px; 
                border: 1px solid #ddd; 
                border-radius: 5px; 
            }
            .score-value { 
                font-size: 24px; 
                font-weight: bold; 
                color: #3b82f6; 
            }
            .holland-code { 
                font-size: 32px; 
                font-weight: bold; 
                color: #10b981; 
                text-align: center; 
                margin: 20px 0; 
            }
            .employability-quotient { 
                text-align: center; 
                font-size: 48px; 
                font-weight: bold; 
                color: #f59e0b; 
                margin: 20px 0; 
            }
            .strengths-list { 
                list-style: none; 
                padding: 0; 
            }
            .strengths-list li { 
                padding: 8px; 
                margin: 5px 0; 
                background: #f3f4f6; 
                border-left: 4px solid #8b5cf6; 
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Comprehensive Psychometric Assessment Report</h1>
            <h2>${userName}</h2>
            <p>Generated on: ${new Date(testResult.completedAt).toLocaleDateString()}</p>
        </div>

        <div class="section">
            <div class="section-title">Section A - Interests (Holland Code Analysis)</div>
            <div class="holland-code">Holland Code: ${testResult.sections.interests.hollandCode}</div>
            <div class="chart-placeholder">
                <h3>Interest Scores Visualization</h3>
                <div class="score-grid">
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.interests.realistic}</div>
                        <div>Realistic (Doers)</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.interests.investigative}</div>
                        <div>Investigative (Thinkers)</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.interests.artistic}</div>
                        <div>Artistic (Creators)</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.interests.social}</div>
                        <div>Social (Helpers)</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.interests.enterprising}</div>
                        <div>Enterprising (Persuaders)</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.interests.conventional}</div>
                        <div>Conventional (Organizers)</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Section B - Personality Profile</div>
            <div class="chart-placeholder">
                <h3>Brain Quadrant Analysis</h3>
                <div class="score-grid">
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.personality.L1}%</div>
                        <div>L1: Analyst & Realist</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.personality.L2}%</div>
                        <div>L2: Conservative & Organizer</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.personality.R1}%</div>
                        <div>R1: Strategist & Imaginative</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${testResult.sections.personality.R2}%</div>
                        <div>R2: Socializer & Empathic</div>
                    </div>
                </div>
                <p><strong>Dominant Quadrants:</strong> ${testResult.sections.personality.dominantQuadrants.join(', ')}</p>
                <p><strong>Personality Types:</strong> ${testResult.sections.personality.personalityTypes.join(', ')}</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Section C - Employability Assessment</div>
            <div class="employability-quotient">${testResult.sections.employability.quotient}/10</div>
            <p style="text-align: center; font-size: 18px; margin-bottom: 20px;">Employability Quotient</p>
            <div class="score-grid">
                <div class="score-item">
                    <div class="score-value">${testResult.sections.employability.selfManagement}</div>
                    <div>Self Management</div>
                </div>
                <div class="score-item">
                    <div class="score-value">${testResult.sections.employability.teamWork}</div>
                    <div>Team Work</div>
                </div>
                <div class="score-item">
                    <div class="score-value">${testResult.sections.employability.enterprising}</div>
                    <div>Enterprising</div>
                </div>
                <div class="score-item">
                    <div class="score-value">${testResult.sections.employability.problemSolving}</div>
                    <div>Problem Solving</div>
                </div>
                <div class="score-item">
                    <div class="score-value">${testResult.sections.employability.speakingListening}</div>
                    <div>Speaking & Listening</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Section D - Character Strengths & Values</div>
            <h3>Top 3 Character Strengths:</h3>
            <ul class="strengths-list">
                ${testResult.sections.characterStrengths.top3Strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
            
            <h3>Character Categories:</h3>
            <ul class="strengths-list">
                ${testResult.sections.characterStrengths.categories.map(category => `<li>${category}</li>`).join('')}
            </ul>
            
            <h3>Core Values:</h3>
            <ul class="strengths-list">
                ${testResult.sections.characterStrengths.values.map(value => `<li>${value}</li>`).join('')}
            </ul>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666;">
            <p>This report is generated by MentorMatch Psychometric Assessment System</p>
            <p>Report generated on: ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>
    `;
  }

  private static generateTextReport(testResult: PsychometricTestResult, userName: string): string {
    return `
COMPREHENSIVE PSYCHOMETRIC ASSESSMENT REPORT
============================================

Student Name: ${userName}
Test Completion Date: ${new Date(testResult.completedAt).toLocaleDateString()}
Report Generated: ${new Date().toLocaleDateString()}

SECTION A - INTERESTS (HOLLAND CODE ANALYSIS)
=============================================

Holland Code: ${testResult.sections.interests.hollandCode}

Interest Scores:
- Realistic (Doers): ${testResult.sections.interests.realistic}
- Investigative (Thinkers): ${testResult.sections.interests.investigative}
- Artistic (Creators): ${testResult.sections.interests.artistic}
- Social (Helpers): ${testResult.sections.interests.social}
- Enterprising (Persuaders): ${testResult.sections.interests.enterprising}
- Conventional (Organizers): ${testResult.sections.interests.conventional}

SECTION B - PERSONALITY PROFILE
===============================

Brain Quadrant Scores:
- L1 (Analyst & Realist): ${testResult.sections.personality.L1}%
- L2 (Conservative & Organizer): ${testResult.sections.personality.L2}%
- R1 (Strategist & Imaginative): ${testResult.sections.personality.R1}%
- R2 (Socializer & Empathic): ${testResult.sections.personality.R2}%

Dominant Quadrants: ${testResult.sections.personality.dominantQuadrants.join(', ')}
Personality Types: ${testResult.sections.personality.personalityTypes.join(', ')}

SECTION C - EMPLOYABILITY ASSESSMENT
====================================

Employability Quotient: ${testResult.sections.employability.quotient}/10

Individual Scores:
- Self Management: ${testResult.sections.employability.selfManagement}
- Team Work: ${testResult.sections.employability.teamWork}
- Enterprising: ${testResult.sections.employability.enterprising}
- Problem Solving: ${testResult.sections.employability.problemSolving}
- Speaking & Listening: ${testResult.sections.employability.speakingListening}

SECTION D - CHARACTER STRENGTHS & VALUES
========================================

Top 3 Character Strengths:
${testResult.sections.characterStrengths.top3Strengths.map((strength, index) => `${index + 1}. ${strength}`).join('\n')}

Character Categories:
${testResult.sections.characterStrengths.categories.map((category, index) => `${index + 1}. ${category}`).join('\n')}

Core Values:
${testResult.sections.characterStrengths.values.map((value, index) => `${index + 1}. ${value}`).join('\n')}

============================================
This report is generated by MentorMatch Psychometric Assessment System
Report Status: ${testResult.isValid ? 'Valid' : 'Invalid'}
============================================
    `;
  }

  // Method to trigger download
  static downloadPDF(blob: Blob, fileName: string = 'psychometric-test-results.txt') {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Enhanced PDF generation method (would use jsPDF in real implementation)
  static async generateAdvancedPDF(
    testResult: PsychometricTestResult, 
    userName: string
  ): Promise<void> {
    try {
      // This is where you would implement jsPDF or similar
      // For now, we'll use the text version
      const pdfBlob = await this.generateTestResultsPDF(testResult, userName);
      const fileName = `${userName.replace(/\s+/g, '_')}_psychometric_results_${new Date().toISOString().split('T')[0]}.txt`;
      this.downloadPDF(pdfBlob, fileName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF report');
    }
  }
}