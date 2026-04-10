import {
    Expert,
    ManagementInsight,
    RepositoryStats,
    TeamHealthMetrics
} from '../types/expert';

type PartialTeamHealthMetrics = Partial<{
    knowledgeDistribution: Partial<TeamHealthMetrics['knowledgeDistribution']>;
    collaborationMetrics: Partial<TeamHealthMetrics['collaborationMetrics']>;
    performanceIndicators: Partial<TeamHealthMetrics['performanceIndicators']>;
}>;

type PartialManagementInsight = Partial<ManagementInsight> & Record<string, unknown>;

const MANAGEMENT_CATEGORIES: ManagementInsight['category'][] = ['RISK', 'OPPORTUNITY', 'EFFICIENCY', 'GROWTH'];
const MANAGEMENT_PRIORITIES: ManagementInsight['priority'][] = ['HIGH', 'MEDIUM', 'LOW'];
const MANAGEMENT_TIMELINES: ManagementInsight['timeline'][] = ['1-2 weeks', '1 month', '1 quarter'];

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function normalizePercentage(value: unknown, fallback: number): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return fallback;
    }

    const scaled = value > 0 && value <= 1 ? value * 100 : value;
    return clamp(Math.round(scaled), 0, 100);
}

function toStringArray(value: unknown, fallback: string[]): string[] {
    if (!Array.isArray(value)) {
        return fallback;
    }

    const normalized = value
        .map(item => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean);

    return normalized.length > 0 ? normalized : fallback;
}

function toStringValue(value: unknown, fallback: string): string {
    if (typeof value !== 'string') {
        return fallback;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : fallback;
}

function normalizeCategory(value: unknown): ManagementInsight['category'] {
    if (typeof value === 'string') {
        const upper = value.toUpperCase();
        if (MANAGEMENT_CATEGORIES.includes(upper as ManagementInsight['category'])) {
            return upper as ManagementInsight['category'];
        }
    }
    return 'OPPORTUNITY';
}

function normalizePriority(value: unknown): ManagementInsight['priority'] {
    if (typeof value === 'string') {
        const upper = value.toUpperCase();
        if (MANAGEMENT_PRIORITIES.includes(upper as ManagementInsight['priority'])) {
            return upper as ManagementInsight['priority'];
        }
    }
    return 'MEDIUM';
}

function normalizeTimeline(value: unknown): ManagementInsight['timeline'] {
    if (typeof value === 'string') {
        if (MANAGEMENT_TIMELINES.includes(value as ManagementInsight['timeline'])) {
            return value as ManagementInsight['timeline'];
        }
    }
    return '1 month';
}

function getHumanExperts(experts: Expert[]): Expert[] {
    return experts.filter(expert => !expert.isBot);
}

function buildSpecializationCounts(experts: Expert[]): Array<[string, number]> {
    const counts = new Map<string, number>();

    experts.forEach(expert => {
        (expert.specializations || []).forEach(specialization => {
            const trimmed = specialization.trim();
            if (!trimmed) {
                return;
            }
            counts.set(trimmed, (counts.get(trimmed) || 0) + 1);
        });
    });

    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function inferSinglePointsOfFailure(humanExperts: Expert[]): string[] {
    const sorted = [...humanExperts].sort((a, b) => b.contributions - a.contributions);
    const totalContributions = sorted.reduce((sum, expert) => sum + expert.contributions, 0);
    const singlePoints: string[] = [];

    sorted.slice(0, 3).forEach(expert => {
        if (totalContributions <= 0) {
            return;
        }

        const share = expert.contributions / totalContributions;
        if (share >= 0.35) {
            singlePoints.push(`${expert.name} (${Math.round(share * 100)}% commits)`);
        }
    });

    if (singlePoints.length === 0 && sorted.length > 0 && humanExperts.length <= 2) {
        singlePoints.push(`${sorted[0].name} (primary maintainer)`);
    }

    return singlePoints;
}

export function buildFallbackTeamHealthMetrics(
    experts: Expert[],
    stats?: RepositoryStats
): TeamHealthMetrics {
    const humanExperts = getHumanExperts(experts);
    const specializationCounts = buildSpecializationCounts(humanExperts);
    const singlePointsOfFailure = inferSinglePointsOfFailure(humanExperts);

    const criticalAreas = specializationCounts.slice(0, 3).map(([area]) => area);
    if (criticalAreas.length === 0) {
        criticalAreas.push('Core application logic');
    }

    const wellDistributed = specializationCounts
        .filter(([, count]) => count >= 2)
        .slice(0, 3)
        .map(([area]) => area);

    const riskScore = clamp(
        25 +
            singlePointsOfFailure.length * 22 +
            (humanExperts.length < 3 ? 18 : humanExperts.length < 5 ? 8 : 0) +
            (wellDistributed.length === 0 ? 15 : wellDistributed.length === 1 ? 8 : 0),
        5,
        95
    );

    const collaborationPenalty = singlePointsOfFailure.length * 10;
    const teamSizeBoost = clamp(humanExperts.length * 4, 0, 20);

    const crossTeamWork = clamp(70 - collaborationPenalty + teamSizeBoost, 20, 95);
    const codeReviewParticipation = clamp(
        62 +
            (stats?.recentActivityLevel === 'high' ? 12 : stats?.recentActivityLevel === 'medium' ? 6 : 0) -
            singlePointsOfFailure.length * 8,
        20,
        98
    );
    const knowledgeSharing = clamp(45 + wellDistributed.length * 15 - collaborationPenalty, 15, 95);

    const siloedMembers = singlePointsOfFailure.map(entry => entry.split(' (')[0]).slice(0, 3);

    const weeklyDeployments = Math.max(1, Math.round((stats?.recentActivity ?? 0) / 12));
    const blockers = singlePointsOfFailure.slice(0, 2).map(entry => `Dependency on ${entry.split(' (')[0]} for key decisions`);

    return {
        knowledgeDistribution: {
            criticalAreas,
            singlePointsOfFailure,
            wellDistributed,
            riskScore
        },
        collaborationMetrics: {
            crossTeamWork,
            codeReviewParticipation,
            knowledgeSharing,
            siloedMembers
        },
        performanceIndicators: {
            averageReviewTime: stats?.recentActivityLevel === 'high' ? '8 hours' : stats?.recentActivityLevel === 'medium' ? '1 day' : '2 days',
            deploymentFrequency: `${weeklyDeployments}/week`,
            blockers
        }
    };
}

export function buildFallbackManagementInsights(
    experts: Expert[],
    teamHealthMetrics: TeamHealthMetrics,
    stats?: RepositoryStats
): ManagementInsight[] {
    const humanExperts = getHumanExperts(experts);
    const sortedExperts = [...humanExperts].sort((a, b) => b.contributions - a.contributions);
    const primary = sortedExperts[0]?.name || 'primary contributor';
    const secondary = sortedExperts[1]?.name || 'another team member';

    const riskPriority: ManagementInsight['priority'] =
        teamHealthMetrics.knowledgeDistribution.riskScore >= 70
            ? 'HIGH'
            : teamHealthMetrics.knowledgeDistribution.riskScore >= 45
                ? 'MEDIUM'
                : 'LOW';

    const efficiencyPriority: ManagementInsight['priority'] =
        teamHealthMetrics.collaborationMetrics.codeReviewParticipation < 50 ? 'HIGH' : 'MEDIUM';

    return [
        {
            category: 'RISK',
            priority: riskPriority,
            title: 'Knowledge Concentration Needs Mitigation',
            description: teamHealthMetrics.knowledgeDistribution.singlePointsOfFailure.length > 0
                ? `Critical knowledge is concentrated around ${teamHealthMetrics.knowledgeDistribution.singlePointsOfFailure.join(', ')}.`
                : 'Current contributor history suggests potential concentration risk in key areas.',
            actionItems: [
                'Assign backup owners for critical domains',
                'Document onboarding paths for high-risk areas',
                'Rotate reviewers on high-impact pull requests'
            ],
            timeline: riskPriority === 'HIGH' ? '1-2 weeks' : '1 month',
            impact: 'Reduces delivery risk during absence, turnover, or urgent incidents.'
        },
        {
            category: 'OPPORTUNITY',
            priority: 'MEDIUM',
            title: 'Structured Cross-Training Opportunity',
            description: `Pair ${primary} with ${secondary} on cross-domain work to improve resilience and mentorship depth.`,
            actionItems: [
                'Schedule recurring pair-programming sessions',
                'Set cross-domain learning objectives for each sprint',
                'Track coverage growth in critical knowledge areas'
            ],
            timeline: '1 month',
            impact: 'Improves team flexibility and decreases single-maintainer dependencies.'
        },
        {
            category: 'EFFICIENCY',
            priority: efficiencyPriority,
            title: 'Review Throughput and Coordination',
            description: `Current review participation is ${teamHealthMetrics.collaborationMetrics.codeReviewParticipation}%, with ${stats?.recentActivityLevel || 'medium'} recent activity.`,
            actionItems: [
                'Expand the active reviewer pool',
                'Set lightweight review SLAs for high-priority changes',
                'Use reviewer rotation to reduce bottlenecks'
            ],
            timeline: '1-2 weeks',
            impact: 'Shortens cycle time and reduces coordination overhead in active periods.'
        }
    ];
}

export function normalizeTeamHealthMetrics(
    rawMetrics: unknown,
    experts: Expert[],
    stats?: RepositoryStats
): TeamHealthMetrics {
    const fallback = buildFallbackTeamHealthMetrics(experts, stats);
    const parsed: PartialTeamHealthMetrics = typeof rawMetrics === 'object' && rawMetrics !== null
        ? rawMetrics as PartialTeamHealthMetrics
        : {};

    const knowledgeDistribution = parsed.knowledgeDistribution || {};
    const collaborationMetrics = parsed.collaborationMetrics || {};
    const performanceIndicators = parsed.performanceIndicators || {};

    return {
        knowledgeDistribution: {
            criticalAreas: toStringArray(knowledgeDistribution.criticalAreas, fallback.knowledgeDistribution.criticalAreas),
            singlePointsOfFailure: toStringArray(
                knowledgeDistribution.singlePointsOfFailure,
                fallback.knowledgeDistribution.singlePointsOfFailure
            ),
            wellDistributed: toStringArray(knowledgeDistribution.wellDistributed, fallback.knowledgeDistribution.wellDistributed),
            riskScore: normalizePercentage(knowledgeDistribution.riskScore, fallback.knowledgeDistribution.riskScore)
        },
        collaborationMetrics: {
            crossTeamWork: normalizePercentage(collaborationMetrics.crossTeamWork, fallback.collaborationMetrics.crossTeamWork),
            codeReviewParticipation: normalizePercentage(
                collaborationMetrics.codeReviewParticipation,
                fallback.collaborationMetrics.codeReviewParticipation
            ),
            knowledgeSharing: normalizePercentage(
                collaborationMetrics.knowledgeSharing,
                fallback.collaborationMetrics.knowledgeSharing
            ),
            siloedMembers: toStringArray(collaborationMetrics.siloedMembers, fallback.collaborationMetrics.siloedMembers)
        },
        performanceIndicators: {
            averageReviewTime: toStringValue(
                performanceIndicators.averageReviewTime,
                fallback.performanceIndicators.averageReviewTime
            ),
            deploymentFrequency: toStringValue(
                performanceIndicators.deploymentFrequency,
                fallback.performanceIndicators.deploymentFrequency
            ),
            blockers: toStringArray(performanceIndicators.blockers, fallback.performanceIndicators.blockers)
        }
    };
}

export function normalizeManagementInsights(
    rawInsights: unknown,
    experts: Expert[],
    teamHealthMetrics: TeamHealthMetrics,
    stats?: RepositoryStats
): ManagementInsight[] {
    const normalized = Array.isArray(rawInsights)
        ? rawInsights
            .filter((insight): insight is PartialManagementInsight => typeof insight === 'object' && insight !== null)
            .map((insight): ManagementInsight => ({
                category: normalizeCategory(insight.category),
                priority: normalizePriority(insight.priority),
                title: toStringValue(insight.title, 'Management Insight'),
                description: toStringValue(insight.description, 'Insight details unavailable.'),
                actionItems: toStringArray(insight.actionItems, ['Review contributor trends and follow up with the team.']),
                timeline: normalizeTimeline(insight.timeline),
                impact: toStringValue(insight.impact, 'Improves team visibility and planning.')
            }))
            .filter(insight => insight.title !== 'Management Insight' || insight.description !== 'Insight details unavailable.')
        : [];

    if (normalized.length > 0) {
        return normalized;
    }

    return buildFallbackManagementInsights(experts, teamHealthMetrics, stats);
}
