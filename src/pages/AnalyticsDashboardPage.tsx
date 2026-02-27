import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  type AiScenarioFilter,
  getAnalyticsSummary,
  getAnalyticsTrend,
  type AnalyticsSummaryResponse,
  type AnalyticsTrendResponse,
  getOpsDashboard,
  getOpsRoutes,
  type OpsDashboardResponse,
  type OpsRoutesResponse,
} from '../core/api';

type MetricKey =
  | 'total'
  | 'success_rate'
  | 'ai_tutor_submitted'
  | 'ai_tutor_success'
  | 'ai_tutor_retry'
  | 'ai_tutor_cooldown_hit'
  | 'ai_tutor_daily_cap_hit';

const metricColors: Record<MetricKey, string> = {
  total: '#455A64',
  success_rate: '#00897B',
  ai_tutor_submitted: '#1D7AFC',
  ai_tutor_success: '#2E7D32',
  ai_tutor_retry: '#6A1B9A',
  ai_tutor_cooldown_hit: '#EF6C00',
  ai_tutor_daily_cap_hit: '#C62828',
};

const metricLabels: Record<MetricKey, string> = {
  total: 'Total Events',
  success_rate: 'Success Rate %',
  ai_tutor_submitted: 'Submitted',
  ai_tutor_success: 'Success',
  ai_tutor_retry: 'Retry',
  ai_tutor_cooldown_hit: 'Cooldown Hits',
  ai_tutor_daily_cap_hit: 'Daily Cap Hits',
};

const AnalyticsDashboardPage = () => {
  const navigate = useNavigate();

  const [hours, setHours] = useState(24);
  const [scenario, setScenario] = useState<AiScenarioFilter>('all');
  const [metric, setMetric] = useState<MetricKey>('total');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<AnalyticsSummaryResponse | null>(null);
  const [summaryAll, setSummaryAll] = useState<AnalyticsSummaryResponse | null>(null);
  const [trend, setTrend] = useState<AnalyticsTrendResponse | null>(null);
  const [ops, setOps] = useState<OpsDashboardResponse | null>(null);
  const [opsRoutes, setOpsRoutes] = useState<OpsRoutesResponse | null>(null);

  const cards = useMemo(() => {
    if (!summary) return [];
    return [
      { key: 'kpi_success_rate', label: 'Success Rate', value: `${summary.kpis.successRate}%`, color: summary.kpis.successRate >= 70 ? '#2E7D32' : '#C62828' },
      { key: 'ai_tutor_submitted', label: 'Submitted', value: summary.counts.ai_tutor_submitted, color: '#1D7AFC' },
      { key: 'ai_tutor_success', label: 'Success', value: summary.counts.ai_tutor_success, color: '#2E7D32' },
      { key: 'ai_tutor_retry', label: 'Retry', value: summary.counts.ai_tutor_retry, color: '#6A1B9A' },
      { key: 'ai_tutor_cooldown_hit', label: 'Cooldown Hits', value: summary.counts.ai_tutor_cooldown_hit, color: '#EF6C00' },
      { key: 'ai_tutor_daily_cap_hit', label: 'Daily Cap Hits', value: summary.counts.ai_tutor_daily_cap_hit, color: '#C62828' },
    ];
  }, [summary]);

  const maxTrendValue = useMemo(() => {
    if (!trend || trend.points.length === 0) return 1;
    const values = trend.points.map((p) => Number(p[metric] || 0));
    if (metric === 'success_rate') {
      return Math.max(1, Math.min(100, ...values, 100));
    }
    return Math.max(1, ...values);
  }, [trend, metric]);

  const dualLine = useMemo(() => {
    if (!trend || trend.points.length < 2) {
      return { submittedPath: '', successPath: '', maxLineValue: 1 };
    }

    const width = 100;
    const height = 40;
    const submittedValues = trend.points.map((p) => p.ai_tutor_submitted || 0);
    const successValues = trend.points.map((p) => p.ai_tutor_success || 0);
    const maxLineValue = Math.max(1, ...submittedValues, ...successValues);
    const toPath = (values: number[]) =>
      values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - (v / maxLineValue) * height;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(' ');

    return {
      submittedPath: toPath(submittedValues),
      successPath: toPath(successValues),
      maxLineValue,
    };
  }, [trend]);

  const successRateLine = useMemo(() => {
    if (!trend || trend.points.length < 2) {
      return { path: '', maxValue: 100 };
    }

    const width = 100;
    const height = 40;
    const values = trend.points.map((p) => Number(p.success_rate || 0));
    const maxValue = 100;
    const path = values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - (Math.max(0, Math.min(v, maxValue)) / maxValue) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    return { path, maxValue };
  }, [trend]);

  const opsLatencyLine = useMemo(() => {
    if (!ops || ops.points.length < 2) {
      return { path: '', maxValue: 1 };
    }
    const width = 100;
    const height = 40;
    const values = ops.points.map((p) => Number(p.avg_latency_ms || 0));
    const maxValue = Math.max(1, ...values);
    const path = values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - (v / maxValue) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
    return { path, maxValue };
  }, [ops]);

  const opsErrorRetryLine = useMemo(() => {
    if (!ops || ops.points.length < 2) {
      return { errorPath: '', retryPath: '', maxValue: 1 };
    }
    const width = 100;
    const height = 40;
    const errors = ops.points.map((p) => p.error_count || 0);
    const retries = ops.points.map((p) => p.retry_count || 0);
    const maxValue = Math.max(1, ...errors, ...retries);
    const toPath = (values: number[]) =>
      values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - (v / maxValue) * height;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(' ');
    return {
      errorPath: toPath(errors),
      retryPath: toPath(retries),
      maxValue
    };
  }, [ops]);

  const load = async (selectedHours: number, selectedScenario: AiScenarioFilter) => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, trendRes, allRes, opsRes, opsRoutesRes] = await Promise.all([
        getAnalyticsSummary(selectedHours, selectedScenario),
        getAnalyticsTrend(selectedHours, selectedScenario),
        getAnalyticsSummary(selectedHours, 'all'),
        getOpsDashboard(selectedHours),
        getOpsRoutes(selectedHours, 20),
      ]);
      setSummary(summaryRes);
      setTrend(trendRes);
      setSummaryAll(allRes);
      setOps(opsRes);
      setOpsRoutes(opsRoutesRes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load analytics dashboard';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(hours, scenario);
  }, [hours, scenario]);

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #263238 0%, #455A64 100%)', py: 4, px: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
          Analytics Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          AI Tutor events overview and hourly trend.
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Button onClick={() => navigate('/home')} sx={{ mb: 2, fontWeight: 700 }}>
          Back to Home
        </Button>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                select
                label="Window"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value={6}>Last 6 hours</MenuItem>
                <MenuItem value={12}>Last 12 hours</MenuItem>
                <MenuItem value={24}>Last 24 hours</MenuItem>
                <MenuItem value={72}>Last 72 hours</MenuItem>
                <MenuItem value={168}>Last 7 days</MenuItem>
              </TextField>

              <TextField
                select
                label="Metric"
                value={metric}
                onChange={(e) => setMetric(e.target.value as MetricKey)}
                size="small"
                sx={{ minWidth: 220 }}
              >
                {Object.entries(metricLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as AiScenarioFilter)}
                size="small"
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="travel">Travel</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="migration">Migration</MenuItem>
              </TextField>

              <Button variant="contained" onClick={() => void load(hours, scenario)} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              {summary && <Chip label={`Window: ${summary.windowHours}h`} />}
              {summary && <Chip label={`Scenario: ${summary.scenario}`} />}
            </Box>
          </CardContent>
        </Card>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {cards.map((card) => (
            <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: card.color }}>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {summary && summaryAll && summary.scenario !== 'all' && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                Success Rate Comparison
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">All Scenarios</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {summaryAll.kpis.successRate}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{summary.scenario} Scenario</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {summary.kpis.successRate}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Delta</Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: summary.kpis.successRate - summaryAll.kpis.successRate >= 0 ? '#2E7D32' : '#C62828',
                        }}
                      >
                        {(summary.kpis.successRate - summaryAll.kpis.successRate).toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {summary && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                Top Scenarios (Submitted)
              </Typography>
              {summary.topScenarios.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No scenario data yet.</Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {summary.topScenarios.map((item) => (
                    <Chip
                      key={item.scenario}
                      label={`${item.scenario}: ${item.count}`}
                      sx={{ fontWeight: 700 }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Hourly Trend: {metricLabels[metric]}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Bar chart by hour for the selected window.
            </Typography>

            {trend && trend.points.length > 0 ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 180, mb: 1 }}>
                  {trend.points.map((point, idx) => {
                    const value = Number(point[metric] || 0);
                    const heightPct = Math.max(2, (value / maxTrendValue) * 100);
                    return (
                      <Box
                        key={`${point.hour_start}-${idx}`}
                        title={`${new Date(point.hour_start).toLocaleString()} | ${metricLabels[metric]}: ${value}`}
                        sx={{
                          flex: 1,
                          minWidth: 4,
                          height: `${heightPct}%`,
                          background: metricColors[metric],
                          borderRadius: '4px 4px 0 0',
                          opacity: value > 0 ? 0.95 : 0.25,
                        }}
                      />
                    );
                  })}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
                  <Typography variant="caption">
                    {new Date(trend.points[0].hour_start).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit' })}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Max: {maxTrendValue}
                  </Typography>
                  <Typography variant="caption">
                    {new Date(trend.points[trend.points.length - 1].hour_start).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit' })}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Dual Line Trend: Submitted vs Success
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip size="small" label="Submitted" sx={{ background: '#1D7AFC20', color: '#1D7AFC' }} />
                    <Chip size="small" label="Success" sx={{ background: '#2E7D3220', color: '#2E7D32' }} />
                    <Chip size="small" label={`Line Max: ${dualLine.maxLineValue}`} variant="outlined" />
                  </Box>
                  <Box
                    sx={{
                      border: '1px solid #E0E0E0',
                      borderRadius: 1.5,
                      p: 1,
                      background: '#FAFAFA',
                    }}
                  >
                    <svg viewBox="0 0 100 40" width="100%" height="160" preserveAspectRatio="none">
                      <polyline
                        points="0,40 100,40"
                        fill="none"
                        stroke="#E0E0E0"
                        strokeWidth="0.4"
                      />
                      <path d={dualLine.submittedPath} fill="none" stroke="#1D7AFC" strokeWidth="1.2" />
                      <path d={dualLine.successPath} fill="none" stroke="#2E7D32" strokeWidth="1.2" />
                    </svg>
                  </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Success Rate Trend (% per hour)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip size="small" label="Success Rate %" sx={{ background: '#00897B20', color: '#00897B' }} />
                    <Chip size="small" label="Max: 100%" variant="outlined" />
                  </Box>
                  <Box
                    sx={{
                      border: '1px solid #E0E0E0',
                      borderRadius: 1.5,
                      p: 1,
                      background: '#FAFAFA',
                    }}
                  >
                    <svg viewBox="0 0 100 40" width="100%" height="140" preserveAspectRatio="none">
                      <polyline points="0,40 100,40" fill="none" stroke="#E0E0E0" strokeWidth="0.4" />
                      <path d={successRateLine.path} fill="none" stroke="#00897B" strokeWidth="1.4" />
                    </svg>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No trend data for this window.</Typography>
            )}
          </CardContent>
        </Card>

        {ops && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Operational Dashboard
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Card variant="outlined"><CardContent><Typography variant="body2" color="text.secondary">Avg Latency</Typography><Typography variant="h5" sx={{ fontWeight: 800 }}>{ops.kpis.avgLatencyMs} ms</Typography></CardContent></Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Card variant="outlined"><CardContent><Typography variant="body2" color="text.secondary">P95 Latency</Typography><Typography variant="h5" sx={{ fontWeight: 800 }}>{ops.kpis.p95LatencyMs} ms</Typography></CardContent></Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Card variant="outlined"><CardContent><Typography variant="body2" color="text.secondary">Error Rate</Typography><Typography variant="h5" sx={{ fontWeight: 800, color: ops.kpis.errorRate > 5 ? '#C62828' : '#2E7D32' }}>{ops.kpis.errorRate}%</Typography></CardContent></Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Card variant="outlined"><CardContent><Typography variant="body2" color="text.secondary">AI Circuit</Typography><Typography variant="h5" sx={{ fontWeight: 800 }}>{ops.circuit.state}</Typography><Typography variant="caption" color="text.secondary">failures {ops.circuit.failures}/{ops.circuit.threshold}</Typography></CardContent></Card>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <Chip size="small" label={`Retries: ${ops.kpis.retryCount}`} />
                <Chip size="small" label={`Circuit Opens: ${ops.kpis.circuitOpenEvents}`} />
                {ops.circuit.state === 'OPEN' && <Chip size="small" color="warning" label={`Reopen in ${Math.ceil(ops.circuit.reopenInMs / 1000)}s`} />}
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Avg Latency Trend (hourly)
              </Typography>
              <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 1.5, p: 1, background: '#FAFAFA', mb: 2 }}>
                <svg viewBox="0 0 100 40" width="100%" height="120" preserveAspectRatio="none">
                  <polyline points="0,40 100,40" fill="none" stroke="#E0E0E0" strokeWidth="0.4" />
                  <path d={opsLatencyLine.path} fill="none" stroke="#1565C0" strokeWidth="1.4" />
                </svg>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Error vs Retry Trend (hourly)
              </Typography>
              <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 1.5, p: 1, background: '#FAFAFA' }}>
                <svg viewBox="0 0 100 40" width="100%" height="120" preserveAspectRatio="none">
                  <polyline points="0,40 100,40" fill="none" stroke="#E0E0E0" strokeWidth="0.4" />
                  <path d={opsErrorRetryLine.errorPath} fill="none" stroke="#C62828" strokeWidth="1.2" />
                  <path d={opsErrorRetryLine.retryPath} fill="none" stroke="#6A1B9A" strokeWidth="1.2" />
                </svg>
              </Box>
            </CardContent>
          </Card>
        )}

        {opsRoutes && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                API Route-level SLOs
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                P95 latency and 5xx rates per endpoint for the last {opsRoutes.windowHours} hours.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {opsRoutes.topFailingRoutes.length === 0 ? (
                  <Chip size="small" label="No failing routes in selected window" color="success" />
                ) : (
                  opsRoutes.topFailingRoutes.map((item) => (
                    <Chip
                      key={`${item.method}-${item.path}`}
                      size="small"
                      color="error"
                      label={`${item.method} ${item.path} | 5xx: ${item.errors5xx}`}
                    />
                  ))
                )}
              </Box>

              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 980 }}>
                  <Grid container sx={{ borderBottom: '1px solid #E0E0E0', pb: 1, mb: 1 }}>
                    <Grid size={{ xs: 3 }}><Typography variant="caption" sx={{ fontWeight: 700 }}>Method</Typography></Grid>
                    <Grid size={{ xs: 4 }}><Typography variant="caption" sx={{ fontWeight: 700 }}>Path</Typography></Grid>
                    <Grid size={{ xs: 1 }}><Typography variant="caption" sx={{ fontWeight: 700 }}>Req</Typography></Grid>
                    <Grid size={{ xs: 1 }}><Typography variant="caption" sx={{ fontWeight: 700 }}>5xx</Typography></Grid>
                    <Grid size={{ xs: 1 }}><Typography variant="caption" sx={{ fontWeight: 700 }}>5xx %</Typography></Grid>
                    <Grid size={{ xs: 1 }}><Typography variant="caption" sx={{ fontWeight: 700 }}>Avg ms</Typography></Grid>
                    <Grid size={{ xs: 1 }}><Typography variant="caption" sx={{ fontWeight: 700 }}>P95 ms</Typography></Grid>
                  </Grid>
                  {opsRoutes.routes.map((r) => (
                    <Grid container key={`${r.method}-${r.path}`} sx={{ py: 0.75, borderBottom: '1px dashed #EEEEEE' }}>
                      <Grid size={{ xs: 3 }}><Typography variant="body2">{r.method}</Typography></Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.path}</Typography></Grid>
                      <Grid size={{ xs: 1 }}><Typography variant="body2">{r.requestCount}</Typography></Grid>
                      <Grid size={{ xs: 1 }}><Typography variant="body2" sx={{ color: r.errors5xx > 0 ? '#C62828' : 'inherit', fontWeight: r.errors5xx > 0 ? 700 : 400 }}>{r.errors5xx}</Typography></Grid>
                      <Grid size={{ xs: 1 }}><Typography variant="body2">{r.errorRate}%</Typography></Grid>
                      <Grid size={{ xs: 1 }}><Typography variant="body2">{r.avgLatencyMs}</Typography></Grid>
                      <Grid size={{ xs: 1 }}><Typography variant="body2" sx={{ fontWeight: 700 }}>{r.p95LatencyMs}</Typography></Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default AnalyticsDashboardPage;
