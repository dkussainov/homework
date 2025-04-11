import { themeQuartz } from "ag-grid-community";

export const lightTheme = themeQuartz.withParams({
  accentColor: "#1DA57A",
  backgroundColor: "#F2F1F1",
  browserColorScheme: "inherit",
  foregroundColor: "#36677B",
  headerFontSize: 14,
});

export const darkTheme = themeQuartz.withParams({
  accentColor: "#72A3CB",
  backgroundColor: "#1f2836",
  browserColorScheme: "dark",
  foregroundColor: "#FFFFFF",
  headerBackgroundColor: "#505C52",
  headerFontSize: 14,
});
