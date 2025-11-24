import { ExpertiseAnalysis } from './expertise-analyzer';

export class ReportGenerator {
    /**
     * Generates an HTML report for a team analysis
     */
    public static generateHTMLReport(analysis: ExpertiseAnalysis): string {
        const repoName = analysis.repository.split('/').pop() || 'analysis';
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team X-Ray Analysis Report - ${repoName}</title>
    <style>
        :root {
            --primary-color: #6366f1;
            --primary-dark: #4f46e5;
            --secondary-color: #64748b;
            --background-color: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #ef4444;
            --info-color: #3b82f6;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-main);
            background-color: var(--background-color);
            margin: 0;
            padding: 40px 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: linear-gradient(135deg, var(--primary-color) 0%, #a855f7 100%);
            color: white;
            padding: 60px 40px;
            border-radius: 24px;
            text-align: center;
            margin-bottom: 40px;
            box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }

        .header h1 {
            margin: 0 0 15px 0;
            font-size: 3em;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        .metadata {
            opacity: 0.9;
            font-size: 1.1em;
            font-weight: 500;
        }

        .section {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--border-color);
        }

        .section h2 {
            color: var(--text-main);
            font-size: 1.8em;
            margin-top: 0;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .expert-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 25px;
        }

        .expert-card {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .expert-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-color);
        }

        .expert-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 20px;
        }

        .expert-name {
            font-weight: 700;
            font-size: 1.4em;
            color: var(--text-main);
            margin-bottom: 4px;
        }

        .expert-email {
            color: var(--text-muted);
            font-size: 0.9em;
        }

        .expert-role {
            background: #eff6ff;
            color: var(--primary-color);
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.85em;
            font-weight: 600;
            display: inline-block;
        }

        .expert-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 25px 0;
            background: #f8fafc;
            padding: 15px;
            border-radius: 12px;
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            font-weight: 800;
            font-size: 1.5em;
            color: var(--primary-color);
            line-height: 1.2;
        }

        .stat-label {
            font-size: 0.8em;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            margin-top: 4px;
        }

        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 20px;
        }

        .tag {
            background: #f1f5f9;
            color: #475569;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.9em;
            font-weight: 500;
        }

        .management-insights {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 25px;
        }

        .management-card {
            border-radius: 16px;
            padding: 30px;
            border: 1px solid var(--border-color);
            background: white;
            position: relative;
        }

        .management-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            border-radius: 16px 16px 0 0;
        }

        .management-card.risk::before { background: var(--danger-color); }
        .management-card.opportunity::before { background: var(--success-color); }
        .management-card.efficiency::before { background: var(--info-color); }
        .management-card.growth::before { background: var(--warning-color); }

        .insight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .insight-badge {
            font-size: 0.75em;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        .risk .insight-badge { background: #fef2f2; color: var(--danger-color); }
        .opportunity .insight-badge { background: #f0fdf4; color: var(--success-color); }
        .efficiency .insight-badge { background: #eff6ff; color: var(--info-color); }
        .growth .insight-badge { background: #fffbeb; color: var(--warning-color); }

        .action-items {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
        }

        .action-items ul {
            margin: 10px 0 0 0;
            padding-left: 20px;
        }

        .ai-insights {
            background: linear-gradient(145deg, #1e293b, #0f172a);
            color: white;
            border: none;
        }

        .ai-insights h2 {
            color: white;
        }

        .ai-content {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .generated-info {
            text-align: center;
            color: var(--text-muted);
            margin-top: 60px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Team X-Ray Report</h1>
            <div class="metadata">
                ${repoName} • ${new Date().toLocaleDateString()}
            </div>
            <div style="margin-top: 15px; opacity: 0.8;">
                ${analysis.totalFiles} files analyzed • ${analysis.expertProfiles.length} experts identified
            </div>
        </div>

        <div class="section">
            <h2>👥 Team Experts</h2>
            <div class="expert-grid">
                ${analysis.expertProfiles.map(expert => `
                    <div class="expert-card">
                        <div class="expert-header">
                            <div>
                                <div class="expert-name">${expert.name}</div>
                                <div class="expert-email">${expert.email}</div>
                            </div>
                            ${expert.teamRole ? `<span class="expert-role">${expert.teamRole}</span>` : ''}
                        </div>
                        
                        <div class="expert-stats">
                            <div class="stat">
                                <div class="stat-value">${expert.expertise}%</div>
                                <div class="stat-label">Expertise</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">${expert.contributions}</div>
                                <div class="stat-label">Commits</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">${ReportGenerator.calculateDaysAgo(expert.lastCommit)}</div>
                                <div class="stat-label">Days Ago</div>
                            </div>
                        </div>

                        ${expert.specializations?.length ? `
                            <div class="tags-container">
                                ${expert.specializations.map(spec => `<span class="tag">${spec}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>

        ${analysis.managementInsights?.length ? `
            <div class="section">
                <h2>📊 Management Insights</h2>
                <div class="management-insights">
                    ${analysis.managementInsights.map(insight => `
                        <div class="management-card ${insight.category.toLowerCase()}">
                            <div class="insight-header">
                                <span class="insight-badge">${insight.category}</span>
                                <span class="insight-badge" style="opacity: 0.7">${insight.priority} Priority</span>
                            </div>
                            <h3 style="margin: 0 0 15px 0; font-size: 1.3em;">${insight.title}</h3>
                            <p style="color: var(--text-muted); margin-bottom: 20px;">${insight.description}</p>
                            
                            <div class="action-items">
                                <strong style="color: var(--text-main); display: block; margin-bottom: 8px;">
                                    ⚡ Action Items (${insight.timeline})
                                </strong>
                                <ul style="color: var(--text-muted);">
                                    ${insight.actionItems.map(action => `<li>${action}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                                <strong style="color: var(--primary-color);">Expected Impact:</strong>
                                <span style="color: var(--text-main);">${insight.impact}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <div class="section ai-insights">
            <h2>💡 AI Strategic Analysis</h2>
            <div class="ai-content">
                <div style="font-size: 1.2em; line-height: 1.8; margin-bottom: 30px;">
                    ${ReportGenerator.generateAnalysisSummary(analysis)}
                </div>
                <div class="recommendations">
                    <h4 style="color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px;">Key Recommendations</h4>
                    <div style="display: grid; gap: 15px;">
                        ${ReportGenerator.generateRecommendations(analysis)}
                    </div>
                </div>
            </div>
        </div>

        <div class="generated-info">
            Generated by Team X-Ray VS Code Extension • ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;
    }

    /**
     * Generates a CSV summary for spreadsheet analysis
     */
    public static generateCSV(analysis: ExpertiseAnalysis): { experts: string; files: string; managementInsights?: string } {
        // Experts CSV
        const expertsHeader = 'Name,Email,Expertise %,Contributions,Last Commit,Specializations,Team Role,Communication Style,Workload,Collaboration Style\n';
        const expertsRows = analysis.expertProfiles.map(expert => {
            return [
                `"${expert.name}"`,
                `"${expert.email}"`,
                expert.expertise,
                expert.contributions,
                `"${new Date(expert.lastCommit).toLocaleDateString()}"`,
                `"${(expert.specializations || []).join('; ')}"`,
                `"${expert.teamRole || ''}"`,
                `"${expert.communicationStyle || ''}"`,
                `"${expert.workloadIndicator || ''}"`,
                `"${expert.collaborationStyle || ''}"`
            ].join(',');
        }).join('\n');
        
        // Files CSV
        const filesHeader = 'File Name,File Path,Expert Count,Primary Expert,Change Frequency\n';
        const filesRows = analysis.fileExpertise.map(file => {
            const primaryExpert = file.experts[0];
            return [
                `"${file.fileName}"`,
                `"${file.filePath}"`,
                file.experts.length,
                `"${primaryExpert?.name || 'Unknown'}"`,
                file.changeFrequency
            ].join(',');
        }).join('\n');

        const result: { experts: string; files: string; managementInsights?: string } = {
            experts: expertsHeader + expertsRows,
            files: filesHeader + filesRows
        };

        // Management Insights CSV (if available)
        if (analysis.managementInsights?.length) {
            const insightsHeader = 'Category,Priority,Title,Description,Timeline,Impact,Action Items\n';
            const insightsRows = analysis.managementInsights.map(insight => {
                return [
                    `"${insight.category}"`,
                    `"${insight.priority}"`,
                    `"${insight.title}"`,
                    `"${insight.description}"`,
                    `"${insight.timeline}"`,
                    `"${insight.impact}"`,
                    `"${insight.actionItems.join('; ')}"`
                ].join(',');
            }).join('\n');
            
            result.managementInsights = insightsHeader + insightsRows;
        }

        return result;
    }

    /**
     * Generates an executive summary based on the analysis
     */
    private static generateAnalysisSummary(analysis: ExpertiseAnalysis): string {
        const { expertProfiles } = analysis;
        
        // Find key insights
        const topContributor = expertProfiles.sort((a, b) => b.contributions - a.contributions)[0];
        
        if (!topContributor) {
            return 'No team analysis available.';
        }
        
        // Generate concise insight
        return `${topContributor.name} is the primary contributor and a potential bottleneck for CI/CD expertise.`;
    }

    /**
     * Generates specific recommendations based on the analysis
     */
    private static generateRecommendations(analysis: ExpertiseAnalysis): string {
        const { teamHealthMetrics } = analysis;
        
        const recommendations = [];

        // Knowledge distribution recommendation
        const riskScore = teamHealthMetrics?.knowledgeDistribution?.riskScore ?? 0;
        if (riskScore > 70) {
            recommendations.push('Implement regular knowledge sharing sessions and documentation sprints');
        }

        // Collaboration recommendation
        const sharingScore = teamHealthMetrics?.collaborationMetrics?.knowledgeSharing ?? 0;
        if (sharingScore < 50) {
            recommendations.push('Establish regular code review rotations and pair programming sessions');
        }

        // If no specific metrics, provide general recommendations
        if (recommendations.length === 0) {
            recommendations.push(
                'Consider implementing pair programming sessions to distribute knowledge',
                'Document key workflows and architectural decisions',
                'Set up regular technical sharing sessions'
            );
        }

        return recommendations.map(rec => `<p>${rec}</p>`).join('');
    }

    /**
     * Calculate days ago from a date
     */
    private static calculateDaysAgo(lastCommitDate: any): string {
        try {
            if (!lastCommitDate) {
                return 'N/A';
            }
            
            let date: Date;
            
            if (lastCommitDate instanceof Date) {
                date = lastCommitDate;
            } else if (typeof lastCommitDate === 'string') {
                date = new Date(lastCommitDate);
            } else if (typeof lastCommitDate === 'number') {
                // Handle Unix timestamp (in seconds or milliseconds)
                const multiplier = lastCommitDate > 9999999999 ? 1 : 1000;
                date = new Date(lastCommitDate * multiplier);
            } else {
                return 'N/A';
            }

            if (isNaN(date.getTime())) {
                return 'N/A';
            }
            
            const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            return String(days);
        } catch (e) {
            console.error("Error calculating days ago:", e);
            return 'N/A';
        }
    }
}
