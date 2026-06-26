"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Case = {
  urgencyLevel: string;
  abuseType: string;
  region: string;
};

type Props = {
  cases: Case[];
};

const COLORS = ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

export default function Charts({ cases }: Props) {
  // Urgency breakdown
  const urgencyData = [
    { name: "High", value: cases.filter((c) => c.urgencyLevel === "HIGH").length },
    { name: "Medium", value: cases.filter((c) => c.urgencyLevel === "MEDIUM").length },
    { name: "Low", value: cases.filter((c) => c.urgencyLevel === "LOW").length },
  ].filter((d) => d.value > 0);

  // Abuse type breakdown
  const abuseMap: Record<string, number> = {};
  cases.forEach((c) => {
    const type = c.abuseType || "other";
    abuseMap[type] = (abuseMap[type] || 0) + 1;
  });
  const abuseData = Object.entries(abuseMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Region breakdown
  const regionMap: Record<string, number> = {};
  cases.forEach((c) => {
    const region = c.region || "Unknown";
    regionMap[region] = (regionMap[region] || 0) + 1;
  });
  const regionData = Object.entries(regionMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="chartsSection">
      <h2 className="chartsTitle">Case Analytics</h2>

      <div className="chartsGrid">
        {/* Urgency Pie Chart */}
        <div className="chartCard">
          <h3 className="chartLabel">By Urgency Level</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={urgencyData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {urgencyData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1a1a2e",
                  border: "1px solid rgba(168,85,247,0.3)",
                  borderRadius: "10px",
                  color: "white",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Abuse Type Bar Chart */}
        <div className="chartCard">
          <h3 className="chartLabel">By Abuse Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={abuseData} barSize={28}>
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a1a2e",
                  border: "1px solid rgba(168,85,247,0.3)",
                  borderRadius: "10px",
                  color: "white",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {abuseData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Region Bar Chart */}
        <div className="chartCard chartCardWide">
          <h3 className="chartLabel">By Region</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionData} barSize={28}>
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a1a2e",
                  border: "1px solid rgba(168,85,247,0.3)",
                  borderRadius: "10px",
                  color: "white",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {regionData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}