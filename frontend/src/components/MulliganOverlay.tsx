type MulliganPhase = "reviewing_hand" | "choosing_bottom";

type MulliganOverlayProps = {
  phase: MulliganPhase;
  mulliganCount: number;
  selectedBottomCards: string[];
  onMulligan: () => void;
  onKeep: () => void;
  onConfirmBottomCards: () => void;
};

export function MulliganOverlay({
  phase,
  mulliganCount,
  selectedBottomCards,
  onMulligan,
  onKeep,
}: MulliganOverlayProps) {
  const keepCount = 7 - mulliganCount;

  return (
    <div className="mulligan-overlay">
      <div className="mulligan-actions">
        {phase === "reviewing_hand" && (
          <>
            <button disabled={mulliganCount >= 6} onClick={onMulligan}>
              Mulligan
            </button>

            <button onClick={onKeep}>Keep {keepCount}</button>
          </>
        )}

        {phase === "choosing_bottom" && (
          <p>
            Choose {mulliganCount - selectedBottomCards.length} card(s) to put
            on bottom.
          </p>
        )}
      </div>
    </div>
  );
}