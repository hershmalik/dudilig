import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Clock,
  DollarSign,
  AlertCircle,
  Users,
  Target,
  CheckCircle,
} from "lucide-react";
import type { SimulatorState } from "@shared/schema";

export default function Simulator() {
  const [approach, setApproach] = useState("standard");
  const [market, setMarket] = useState("us");

  const { data: state, isLoading } = useQuery<SimulatorState>({
    queryKey: ["/api/simulator", approach, market],
  });

  if (isLoading || !state) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading simulator...</p>
        </div>
      </div>
    );
  }

  const { metrics, recommendations, impactAnalysis, funnelData, tradeoffData } = state;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Compliance Impact Simulator
          </h1>
          <p className="text-muted-foreground">
            Strategic decision-making for cross-functional compliance programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Compliance Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={approach} onValueChange={setApproach}>
                <SelectTrigger data-testid="select-approach">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard KYC Flow</SelectItem>
                  <SelectItem value="ai-optimized">AI-Optimized Phased Collection</SelectItem>
                  <SelectItem value="minimal">Minimal Upfront Collection</SelectItem>
                  <SelectItem value="full-verification">Full Upfront Verification</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {approach === "standard" && "Industry-standard data collection with balanced compliance requirements"}
                {approach === "ai-optimized" && "Smart data collection triggers based on user behavior and risk signals"}
                {approach === "minimal" && "Collect minimum required data, expand based on transaction triggers"}
                {approach === "full-verification" && "Comprehensive data collection before any service access"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Target Market
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={market} onValueChange={setMarket}>
                <SelectTrigger data-testid="select-market">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">US - CIP + AML + OFAC</SelectItem>
                  <SelectItem value="eu">EU - GDPR + AML5 + MiCA</SelectItem>
                  <SelectItem value="uk">UK - FCA + AML + PCI</SelectItem>
                  <SelectItem value="singapore">Singapore - MAS + AML + KYC</SelectItem>
                  <SelectItem value="japan">Japan - JFSA + AML + Privacy</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">User Conversion</span>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="metric-conversion">
                {metrics.conversionRate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Complexity</span>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="metric-complexity">
                {metrics.engineeringComplexity}/10
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Regulatory Risk</span>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="metric-risk">
                {metrics.regulatoryRisk}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Time to Market</span>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="metric-time">
                {metrics.timeToMarket} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">User Friction</span>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="metric-friction">
                {metrics.userFrictionScore}/10
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Annual Cost</span>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="metric-cost">
                ${metrics.annualCost}K
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Compliance</span>
              </div>
              <p className="text-3xl font-bold text-foreground" data-testid="metric-compliance">
                {metrics.complianceScore}/100
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="stage" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk vs Conversion Trade-off</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tradeoffData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="approach" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Conversion %"
                  />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Risk %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Strategic Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="space-y-1" data-testid={`recommendation-${index}`}>
                <h4 className="text-sm font-semibold text-foreground">{rec.category}</h4>
                <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-Functional Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Team</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Impact</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Effort</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Timeline</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Dependencies</th>
                  </tr>
                </thead>
                <tbody>
                  {impactAnalysis.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-0"
                      data-testid={`impact-row-${index}`}
                    >
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{row.team}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{row.impact}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            row.effort === "Low"
                              ? "outline"
                              : row.effort === "Medium"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {row.effort}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{row.timeline}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{row.dependencies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Strategic Decision Tool:</strong> Use this simulator to
            model compliance implementation approaches. Data-driven insights help align
            cross-functional teams on business impact, engineering effort, and regulatory risk.
          </p>
        </div>
      </div>
    </div>
  );
}
