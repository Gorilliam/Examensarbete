type MulliganPhase = "reviewing_hand" | "choosing_bottom";

type MulliganOverlayProps = {
  phase: MulliganPhase;
  mulliganCount: number;
  selectedBottomCards: number[];
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
  onConfirmBottomCards,
}: MulliganOverlayProps) {
  const keepCount = 7 - mulliganCount;
  const remainingCardsToBottom = mulliganCount - selectedBottomCards.length;

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
        <>
            <p>Choose {remainingCardsToBottom} card(s) to put on bottom.</p>

            {selectedBottomCards.length === mulliganCount && (
            <button onClick={onConfirmBottomCards}>Confirm</button>
            )}
        </>
        )}
      </div>
    </div>
  );
}