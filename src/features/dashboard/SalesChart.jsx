import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

const ChartBox = styled.div`
  /* Fill whatever space is left in the box after the heading, instead of guessing a fixed px height */
  flex: 1;
  min-height: 0;
`;

function SalesChart({ bookings, numberOfDays }) {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numberOfDays),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    const bookingsOnDay = bookings.filter((booking) =>
      isSameDay(date, new Date(booking.created_at)),
    );
    return {
      label: format(date, "MMM dd"),
      totalSales: bookingsOnDay.reduce((acc, cur) => acc + cur.totalPrice, 0),
      extrasSales: bookingsOnDay.reduce((acc, cur) => acc + cur.extraPrice, 0),
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };
  return (
    <StyledSalesChart>
      <Heading as="h2">
        {" "}
        Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "MMM dd yyyy")}
      </Heading>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis
              dataKey="label"
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
            />
            <YAxis
              tickFormatter={(value) => `Rs.${value}`}
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
            />
            <CartesianGrid strokeDasharray="4" />
            <Tooltip
              contentStyle={{ backgroundColor: colors.background }}
              formatter={(value, name) => [`Rs.${value}`, name]}
              itemSorter={(item) => (item.dataKey === "totalSales" ? 0 : 1)}
            />
            <Area
              dataKey="totalSales"
              type="monotone"
              stroke={colors.totalSales.stroke}
              fill={colors.totalSales.fill}
              strokeWidth={2}
              name="Total sales"
            />
            <Area
              dataKey="extrasSales"
              type="monotone"
              stroke={colors.extrasSales.stroke}
              fill={colors.extrasSales.fill}
              strokeWidth={2}
              name="Extras sales"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartBox>
    </StyledSalesChart>
  );
}

export default SalesChart;
