import React from "react";

const TIPS = [
  "Click and hold a link for more options.",
  "Use the search bar to quickly find your favorite sites.",
];

function TipsComponent() {
  const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];

  return (
    <span className="text-sm text-muted-foreground">
      <strong>Tip:</strong> {randomTip}
    </span>
  );
}

export default TipsComponent;
